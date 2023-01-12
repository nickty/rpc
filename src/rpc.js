const amqplib = require("amqplib");
const { v4: uuid4 } = require("uuid");

let amqplibConnection = null;

const getChannel = async () => {
  if (amqplibConnection === null) {
    amqplibConnection = await amqplib.connect("ammqp://localhost");
  }

  return await amqplibConnection.createChannel();
};

const RPCObserver = async (RPC_QUEUE_NAME, fakeResponse) => {
  const channel = await getChannel();

  await channel.assertQueue(RPC_QUEUE_NAME, {
    durable: false,
  });
  channel.prefetch(1);
  channel.consume(
    RPC_QUEUE_NAME,
    async (msg) => {
      if (msg.content) {
        // DB operation
        const payload = JSON.parse(msg.content.toString());
        const response = { fakeResponse, payload }; //call fake db operation
        channel.sendToQueue(
          msg.propertise.replayTo,
          Buffer.from(JSON.stringify(response)),
          {
            correlation: msg.propertise.correlationId,
          }
        );
      }
    },
    {
      noAck: false,
    }
  );
};

const requestData = async (RPC_QUEUE_NAME, requestPayload, uuid) => {
  const channel = await getChannel();

  const q = await channel.assertQueue("", { exclusive: true });

  channel.sendToQueue(
    RPC_QUEUE_NAME,
    Buffer.from(JSON.stringify(requestData)),
    {
      replayTo: q.queue,
      correlationId: uuid,
    }
  );

  return new Promise((resolve, reject) => {
    channel.consume(
      q.queue,
      (msg) => {
        if (msg.propertise.correlationId === uuid) {
          resolve(JSON.parse(msg.content.toString()));
        } else {
          reject("Data not found!");
        }
      },
      {
        noAck: true,
      }
    );
  });
};

const RPCRequest = async (RPC_QUEUE_NAME, requestPayload) => {
  const uuid = uuid4(); //correlation id
  return requestData(RPC_QUEUE_NAME, requestPayload, uuid);
};

module.exports = {
  getChannel,
  RPCObserver,
  RPCRequest,
};
