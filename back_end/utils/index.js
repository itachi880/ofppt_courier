const EasyMailer = require("esay_mailer");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
module.exports.mailer = new EasyMailer({
  user: process.env.MAILER_EMAIL, // Votre email ou nom d'utilisateur SMTP
  pass: process.env.MAILER_PASS, // Votre mot de passe SMTP
  host_service: EasyMailer.HOSTS_DEFAULT_LIST.GMAIL,
});
module.exports.hashPass = (pass) =>
  crypto
    .createHash("sha256")
    .update(pass + process.env.HASH_SALT)
    .digest("hex");
module.exports.jwt_signe = (data) => jwt.sign(data, process.env.HASH_SALT, { expiresIn: "1d" });
/**
 *
 * @param {string} token
 * @returns {[jwt.JsonWebTokenError | null , {id:number,role:string}]}
 */
module.exports.jwt_verify = async (token) => {
  try {
    return [null, jwt.verify(token, process.env.HASH_SALT)];
  } catch (e) {
    return [e, null];
  }
};
module.exports.Roles = {
  admin: "admin",
  normal: "normal",
};
module.exports.auth_middleware = function (req, res, next = () => {}) {
  const [auth_error, auth_data] = module.exports.jwt_verify(req.headers.authorization);
  if (auth_error) return res.status(401).end("token error");
  req.user = auth_data;
  next();
};
