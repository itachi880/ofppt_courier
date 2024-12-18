const { auth_middleware } = require("../../utils");
const { Users } = require("../../Models");
const { Roles } = require("../../utils");
const router = require("express").Router();
router.use(auth_middleware);
router.delete("/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    if (req.user.role != Roles.admin) return res.status(401).end("you don't have access");
    const [errDelete] = await Users.deleteByID(userId);
    if (errDelete) return res.status(500).end("server error") && console.log(errDelete);
    res.end("done");
  } catch (e) {
    console.log(e);
    res.status(500).end("server error");
  }
});
module.exports = router;
