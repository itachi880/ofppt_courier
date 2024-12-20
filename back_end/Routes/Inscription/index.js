const { Users } = require("../../Models");
const { hashPass, Roles, auth_middleware } = require("../../utils");
const router = require("express").Router();
router.use(auth_middleware);
router.post("/", async (req, res) => {
  try {
    const { email, role, departement_id, group_id } = req.body;

    if (!email || !role || !departement_id || !group_id) return res.status(400).end("all data are required");

    if (req.user.role != Roles.admin) return res.status(401).end("you don't have access");
    const [errCreate, data] = await Users.insert({
      email,
      password: hashPass(email),
      role,
      departement_id,
      group_id,
    });
    console.log(errCreate);
    if (errCreate) return res.status(500).end("server error") && console.log(errCreate);

    return res.end(data.insertId + "");
  } catch (e) {
    console.log(e);
    return res.status(500).end("server error");
  }
});
module.exports = router;
