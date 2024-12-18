const { auth_middleware } = require("../../utils");

const router = require("express").Router();
router.use(auth_middleware);

module.exports = router;
