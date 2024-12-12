require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
app.use(
  cors({
    origin: "*",
  })
);
app.listen(80, () => {
  console.log("serveur running at port 80");
});
