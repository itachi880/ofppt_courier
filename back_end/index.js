require("./events").startTasks();
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

app.use(
  express.json(),
  cors({
    origin: "*",
  })
);
app.use("/users", UsersRoute);
app.use("/courier", CourierRoute);
app.use("/Departement", DepartementRoute);
app.use("/login", LoginRoute);
app.use("/groups", GroupRoute);
app.use("/register", inscription);
app.listen(process.env.APP_PORT, () => {
  console.log("serveur running at port " + process.env.APP_PORT);
});
