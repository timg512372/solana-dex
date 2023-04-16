require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const swapRouter = require("./routes/swap");

const port = process.env.PORT ? process.env.PORT : 4000;
// console.log(port);

const app = express();
app.use(bodyParser.json());
app.use(
  cors({
    origin: "*",
  })
);

app.use("/swap/", swapRouter);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

module.exports = { app };
