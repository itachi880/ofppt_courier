const { auth_middleware, verifierCode } = require("../../utils");
const { Users } = require("../../Models");
const { Roles, hashPass } = require("../../utils");
const router = require("express").Router();
router.use(auth_middleware);
router.get("/", async (req, res) => {
  if (req.user.role != Roles.admin) return res.status(401).end("no access");
  try {
    res.json((await Users.read())[1]);
  } catch (e) {
    console.log(e);
    res.status(500).end("back end error");
  }
});
router.get("/:id", async (req, res) => {
  const userId = req.params.id;
  try {
    if (req.user.role != Roles.admin)
      return res.status(401).end("you don't have access");
    const [err, user] = await Users.readById(userId);
    if (err) return res.status(500).end("server error") && console.log(err);
    res.json(user);
  } catch (e) {
    console.log(e);
    res.status(500).end("server error");
  }
});
router.delete("/:id", async (req, res) => {
  const userId = req.params.id;
  try {
    if (req.user.role != Roles.admin)
      return res.status(401).end("you don't have access");
    const [errDelete] = await Users.deleteByID(userId);
    if (errDelete)
      return res.status(500).end("server error") && console.log(errDelete);
    res.end("done");
  } catch (e) {
    console.log(e);
    res.status(500).end("server error");
  }
});
router.put("/:id", async (req, res) => {
  const userId = req.params.id;
  const updateData = req.body;
  if (updateData.departement_id == 0) updateData.departement_id = null;
  if (updateData.group_id == 0) updateData.group_id = null;
  try {
    if (req.user.role != Roles.admin)
      return res.status(401).end("you don't have access");
    const [errUpdate] = await Users.updateByID(userId, updateData);
    if (errUpdate)
      return res.status(500).end("server error") && console.log(errUpdate);
    res.end("done");
  } catch (e) {
    console.log(e);
    return res.status(500).end("server error");
  }
});
router.post("/add", async (req, res) => {
  console.log(req.body);
  const userData = req.body;
  userData.password = hashPass(userData.password);
  if (userData.group_id <= 0) userData.group_id = null;
  if (userData.departement_id <= 0) userData.departement_id = null;
  try {
    if (req.user.role != Roles.admin)
      return res.status(401).end("you don't have access");
    const [errAdd, data] = await Users.insert(userData);
    if (errAdd)
      return res.status(500).end("server error") && console.log(errAdd);
    res.end(data.insertId + "");
  } catch (e) {
    console.log(e);
    res.status(500).end("server error");
  }
});
router.post("/forget-pass", async (req, res) => {
  const { pass } = req.body;
  console.log(req.body);
  if (!pass || pass.length <= 3)
    return res.status(400).end("send correct pass");
  const [error] = await Users.update(
    {
      password: hashPass(pass),
    },
    {
      and: [{ email: { operateur: "=", value: req.user.email } }],
    }
  );
  if (error) return res.status(500).end("problem");
  return res.end("modified");
});
module.exports = router;
