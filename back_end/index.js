require("dotenv").config();
require("./cron-job").cron();
const express = require("express");
const https = require("https");
const fs = require("fs");
const app = express();
const cors = require("cors");
const UsersRoute = require("./Routes/Users");
const CourierRoute = require("./Routes/Courier");
const DepartementRoute = require("./Routes/Departement");
const LoginRoute = require("./Routes/Login");
const GroupRoute = require("./Routes/Group");
const inscriptionRoute = require("./Routes/Inscription");
const {
  envoyerEmail,
  generateCode,
  verifierCode,
  APP_LINKS,
  USE_DEV,
} = require("./utils");
const path = require("path");
//back end app;
if (!USE_DEV) {
  fetch(process.env.SRC_LINKS_APPS + "/back_end")
    .then(async (e) => await e.text())
    .then((e) => {
      APP_LINKS.BACK_END = "https://" + e;
    })
    .catch((e) => {
      APP_LINKS.BACK_END = "http://localhost:4000";
    });
  //front_end
  fetch(process.env.SRC_LINKS_APPS + "/front_end")
    .then(async (e) => await e.text())
    .then((e) => {
      APP_LINKS.FRONT_END = "https://" + e;
    })
    .catch((e) => {
      APP_LINKS.FRONT_END = "http://localhost:3000";
    });
}
app.use(
  express.json(),
  cors({
    origin: "*",
  })
);

app.use("/users", UsersRoute);
app.use("/courier", CourierRoute);
app.use("/departement", DepartementRoute);
app.use("/login", LoginRoute);
app.use("/groups", GroupRoute);
app.use("/register", inscriptionRoute);
app.use(express.static(__dirname + "/data"));

if (!USE_DEV) {
  const options = {
    key: fs.readFileSync(path.join(__dirname, "certs", "key.pem")), // Your private key
    cert: fs.readFileSync(path.join(__dirname, "certs", "cert.pem")), // Your certificate
  };
  https.createServer(options, app).listen(process.env.APP_PORT, () => {
    console.log("HTTPS Server running on port " + process.env.APP_PORT);
  });
} else {
  app.listen(process.env.APP_PORT, () =>
    console.log("running http: " + process.env.APP_PORT)
  );
}
