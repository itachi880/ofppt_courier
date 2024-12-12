const EasyMailer = require('esay_mailer');


const mailer = new EasyMailer({
  // Port SMTP (25, 465, ou 587)
  user: process.env.MAILER_EMAIL, // Votre email ou nom d'utilisateur SMTP
  pass: process.env.MAILER_PASS, // Votre mot de passe SMTP
  host_service: EasyMailer.HOSTS_DEFAULT_LIST.GMAIL
});

module.exports = mailer;
