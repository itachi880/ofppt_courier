const { Users } = require("../../Models");
const { hashPass, jwt_signe } = require("../../utils");

const router = require("express").Router();

router.post("/", async (req, res) => {
  console.log(req.body);
  try {
    const [err, data] = await Users.read({ and: [{ email: { value: req.body.email, operateur: "=" }, password: { value: hashPass(req.body.password), operateur: "=" } }] });
    if (err) return res.status(500).end("server error") && console.log(err);
    if (data.length == 0) return res.status(404).end("not found");
    res.json({ token: jwt_signe({ id: data[0].id, role: data[0].role }), data: data[0] });
  } catch (e) {
    console.log(e);
    res.status(500).end("server error");
  }
});
module.exports = router;
