require("dotenv").config();
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
} = require("./utils");
const { notifyCourierDeadline } = require("./services/mailer");
//back end app;
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
app.use(
  express.json(),
  cors({
    origin: "*",
  })
);
app.post("/data", (req, res) => {
  const { email } = req.body;
  const code = generateCode(email);
  envoyerEmail(email, APP_LINKS.FRONT_END + "/new_password?token=" + code)
    .then((res) => {
      console.log("email sucsess");
    })
    .catch((e) => {
      console.log(e);
    });
  const resp = verifierCode(code);
  return res.end("done");
});
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
//notifyCourierDeadline();
