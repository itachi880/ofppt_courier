const { auth_middleware } = require("../../utils");
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

  try {
    if (req.user.role != Roles.admin)
      return res.status(401).end("you don't have access");
    const [errUpdate] = await Users.updateByID(userId, updateData);
    if (errUpdate)
      return res.status(500).end("server error") && console.log(errUpdate);
    res.end("done");
  } catch (e) {
    console.log(e);
    res.status(500).end("server error");
  }
});
router.post("/add", async (req, res) => {
  console.log(req.body);
  const userData = req.body;
  userData.password = hashPass(userData.password);
  try {
    if (req.user.role != Roles.admin)
      return res.status(401).end("you don't have access");
    const [errAdd] = await Users.insert(userData);
    if (errAdd)
      return res.status(500).end("server error") && console.log(errAdd);
    res.end("done");
  } catch (e) {
    console.log(e);
    res.status(500).end("server error");
  }
});
module.exports = router;
