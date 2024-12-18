const { Courier } = require("../../Models");
const { auth_middleware, Roles } = require("../../utils");
const router = require("express").Router();
router.use(auth_middleware);

router.post("/add", async (req, res) => {
  if (req.user.role != Roles.admin) return res.status(401).end("don't have access");
  const [err, response] = await Courier.insert({ titel: req.body.titel, deadline: req.body.deadline, state: req.body.state, description: req.body.description, create_by: req.user.id });
  if (err) return res.status(500).end("back end err") && console.log(err);
  return res.end(response.insertId);
});
router.post("/showByID", async (req, res) => {
  const [err, response] = await Courier.read({ and: [{ id: req.body.id }] });
  if (err) return res.status(500).end("back end err") && console.log(err);
  return res.json(response);
});

module.exports = router;
