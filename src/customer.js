const express = require("express");
const PORT = 9000;

const app = express();

app.use(express.json());

app.get("/profile", (req, res) => {
  return res.json("Customer service");
});

app.get("/", (req, res) => {
  return res.json("Customer service");
});

app.listen(PORT, () => {
  console.log(`Customer is Running on ${PORT}`);
  console.clear();
});
