const { Departement } = require("../../Models");
const { auth_middleware, Roles } = require("../../utils");

const router = require("express").Router();
router.use(auth_middleware);
router.post("/add", async (req, res) => {
  if (req.user.role != Roles.admin) return res.status(401).end("don't have access");
  const [err, response] = await Departement.insert(!req.body.dep_parent ? { name: req.body.name } : { name: req.body.name, parent_department_id: req.body.dep_parent });
  if (err) return res.status(500).end("server err") && console.log(err);
  return res.end(response.insertId);
});
//! send data in updateBy and id seperated in the body
router.post("/update", async (req, res) => {
  if (req.user.role != Roles.admin) return res.status(401).end("don't have access");
  const [err, response] = await Departement.update(req.body.id, req.body.updateBy);
  if (err) return res.status(500).end("server err") && console.log(err);
  return res.end(response.insertId);
});
router.get("/all", async (req, res) => {
  const [err, result] = await Departement.read();
  if (err) return res.status(500).end("server err") && console.log(err);
  res.json(result);
});
module.exports = router;
