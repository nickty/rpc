const express = require("express");
const PORT = 8000;

const app = express();

app.use(express.json());

app.get("/products", (req, res) => {
  return res.json("products service");
});

app.get("/", (req, res) => {
  return res.json("products service");
});

app.listen(PORT, () => {
  console.log(`products is Running on ${PORT}`);
  console.clear();
});
