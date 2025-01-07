// ! kolchi 5dam hnaaaaaaa
const { Group } = require("../../Models");
const { auth_middleware, Roles } = require("../../utils");

const router = require("express").Router();
router.use(auth_middleware);

// Route to add a new group
router.post("/add", async (req, res) => {
  if (req.user.role != Roles.admin || !req.body.name || !req.body.departement_id) return res.status(401).end("Don't have access");
  // if (req.user.role != Roles.admin && req.user.dep_id != req.params.id) {
  //   return res.status(401).end("don't have access");
  // }  
  const [err,response] = await Group.insert({ name: req.body.name, departement_id: req.body.departement_id });
  if (err) return res.status(500).end("Server error") && console.log(err);
  return res.end(response.insertId + "");
});

// Route to update an existing group
router.post("/update", async (req, res) => {
  if (req.user.role != Roles.admin || !req.body.id || !req.body.updateBy) return res.status(401).end("Don't have access");
  const [err] = await Group.update(req.body.id, req.body.updateBy);
  if (err) return res.status(500).end("Server error") && console.log(err);
  return res.end("Done");
});

// Route to get all groups
router.get("/all", async (req, res) => {
  const [err, result] = await Group.read();
  if (err) return res.status(500).end("Server error") && console.log(err);
  res.json(result);
});

// Route to get a single group by ID
router.get("/:id", async (req, res) => {
  const [err, result] = await Group.read({ and: [{ id: { value: req.params.id, operateur: "=" } }] });
  if (err) return res.status(500).end("Server error") && console.log(err);
  res.json(result);
});

// Route to delete a group by ID
router.delete("/:id", async (req, res) => {
  if (req.user.role != Roles.admin || !req.params.id) return res.status(401).end("Don't have access or data incomplete");
  const [err] = await Group.deleteByID(req.params.id);
  if (err) return res.status(500).end("Server error") && console.log(err);
  return res.end("Deleted successfully");
});

module.exports = router;
