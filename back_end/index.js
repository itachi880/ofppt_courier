require("dotenv").config();
require("./cron-job").cron();
const express = require("express");
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
//back end app;
if (!USE_DEV) {
  fetch(process.env.SRC_LINKS_APPS + "/back_end")
    .then(async (e) => await e.text())
    .then((e) => {
      APP_LINKS.BACK_END = "http://" + e;
    })
    .catch((e) => {
      APP_LINKS.BACK_END = "http://localhost:4000";
    });
  //front_end
  fetch(process.env.SRC_LINKS_APPS + "/front_end")
    .then(async (e) => await e.text())
    .then((e) => {
      APP_LINKS.FRONT_END = "http://" + e;
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
app.listen(process.env.APP_PORT, () => {
  console.log("serveur running at port " + process.env.APP_PORT);
});
