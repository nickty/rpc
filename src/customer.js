const express = require("express");
const { RPCObserver, RPCRequest } = require("./rpc");
const PORT = 9000;

const app = express();

app.use(express.json());

const fakeCustomerResponse = {
  _id: "asldkfj",
  name: "Mike",
  country: "Bangladesh",
};

RPCObserver("CUSTOMER_PRC", fakeCustomerResponse);

app.get("/wishlist", async (req, res) => {
  const requestPayload = {
    productId: 123,
    customerId: "asldkfj",
  };

  try {
    const responseData = await RPCRequest("PRODUCT_RPC", requestPayload);
    console.log(responseData);
    return res.status(200).json(responseData);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
});

app.get("/", (req, res) => {
  return res.json("Customer service");
});

app.listen(PORT, () => {
  console.log(`Customer is Running on ${PORT}`);
  console.clear();
});
