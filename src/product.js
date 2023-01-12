const express = require("express");
const { RPCObserver, RPCRequest } = require("./rpc");
const PORT = 8000;

const app = express();

app.use(express.json());

const fakeProductResponse = {
  _id: "asldkfj",
  title: "iPhone",
  price: 600,
};

RPCObserver("PRODUCT_PRC", fakeProductResponse);

app.get("/products", async (req, res) => {
  const requestPayload = {
    customerId: "asldkfj",
  };

  try {
    const responseData = await RPCRequest("CUSTOMER_RPC", requestPayload);
    console.log(responseData);
    return res.status(200).json(responseData);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

app.get("/", (req, res) => {
  return res.json("products service");
});

app.listen(PORT, () => {
  console.log(`products is Running on ${PORT}`);
  console.clear();
});
