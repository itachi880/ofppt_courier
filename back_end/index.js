require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const UsersRoute = require("./Routes/Users");
const CourierRoute = require("./Routes/Courier");
const DepartementRoute = require("./Routes/Departement");
const LoginRoute = require("./Routes/Login");
const GroupRoute = require("./Routes/Group");
const inscription = require("./Routes/inscription");
const {
  envoyerEmail,
  generateCode,
  verifierCode,
  FRONT_END_APP,
} = require("./utils");

app.use(
  express.json(),
  cors({
    origin: "*",
  })
);
app.post("/data", (req, res) => {
  const { email } = req.body;
  const code = generateCode(email);
  envoyerEmail(
    email,
    (process.env.FRONT_END_APP || "http://localhost:3000") +
      "/new_password?token=" +
      code
  )
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
app.use("/register", inscription);
app.use(express.static(__dirname + "/data"));
app.listen(process.env.APP_PORT, () => {
  console.log("serveur running at port " + process.env.APP_PORT);
});
