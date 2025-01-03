const { Departement } = require("../../Models");
const { auth_middleware, Roles } = require("../../utils");

const router = require("express").Router();
router.use(auth_middleware);
router.post("/add", async (req, res) => {
  if (req.user.role != Roles.admin || req.user.parent_dep_id) return res.status(401).end("don't have access");
  const [err, response] = await Departement.insert(!req.body.dep_parent ? { name: req.body.name, parent_department_id: req.user.parent_dep_id } : { name: req.body.name, parent_department_id: req.body.dep_parent });
  if (err) return res.status(500).end("server err") && console.log(err);
  return res.end(response.insertId + "");
});
//! send data in updateBy and id seperated in the body
router.post("/update", async (req, res) => {
  if (req.user.role != Roles.admin || (req.user.dep_id != req.body.id && req.user.role == Roles.admin)) return res.status(401).end("don't have access");
  const [err] = await Departement.update(req.body.id, req.body.updateBy);
  if (err) return res.status(500).end("server err") && console.log(err);
  return res.end("done");
});
router.get("/all", async (req, res) => {
  const [err, result] = await Departement.read();
  if (err) return res.status(500).end("server err") && console.log(err);
  res.json(result); 
});
router.get("/:id", async (req, res) => {
  const [err, result] = await Departement.read({ and: [{ id: { value: req.params.id, operateur: "=" } }] });
  if (err) return res.status(500).end("server err") && console.log(err);
  res.json(result);
});
router.delete("/:id", async (req, res) => {
  if (req.user.role != Roles.admin || !req.params.id) return res.status(401).end("don't have access or data incomplete");
  const [err] = await Departement.deleteByID(req.params.id);
  if (err) return res.status(500).end("server err") && console.log(err);
  return res.end("Deleted successfully");
});

module.exports = router;
