const EasyMailer = require("esay_mailer");
const crypto = require("crypto");
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
