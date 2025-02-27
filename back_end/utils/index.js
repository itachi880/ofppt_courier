const EasyMailer = require("esay_mailer");

const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
require("dotenv").config(path.join(__dirname, "..", ".env"));
const noAuthRoutes = ["/users/request-forget-pass"];
module.exports.fileSaver = multer({ storage: multer.memoryStorage() });
module.exports.mailer = new EasyMailer({
  user: process.env.MAILER_EMAIL, // Votre email ou nom d'utilisateur SMTP
  pass: process.env.MAILER_PASS, // Votre mot de passe SMTP
  host_service: EasyMailer.HOSTS_DEFAULT_LIST.GMAIL,
});
module.exports.hashPass = (pass) => {
  return crypto
    .createHash("sha256")
    .update(pass + process.env.HASH_SALT)
    .digest("hex");
};
module.exports.noAuthRoutes = noAuthRoutes;

module.exports.jwt_signe = (data) =>
  jwt.sign(data, process.env.HASH_SALT, { expiresIn: "1d" });
/**
 *
 * @param {string} token
 * @returns {[jwt.JsonWebTokenError | null , {id:number,role:string,dep_id:number,parent_dep_id:number} | null]}
 */
module.exports.jwt_verify = (token) => {
  try {
    return [null, jwt.verify(token, process.env.HASH_SALT)];
  } catch (e) {
    return [e, null];
  }
};
module.exports.Roles = {
  admin: "admin",
  normal: "normal",
  Chef_Dr: "Che_Dr",
};
module.exports.auth_middleware = function (req, res, next = () => {}) {
  if (noAuthRoutes.includes(req.originalUrl.split("?")[0])) return next();
  const [auth_error, auth_data] = module.exports.jwt_verify(
    req.headers.authorization + ""
  );
  if (auth_error) return res.status(401).end("token error");
  req.user = auth_data;
  next();
};
module.exports.generateCode = (email) => {
  const secret = process.env.HASH_SALT;
  return jwt.sign({ email }, secret, { expiresIn: "15m" });
};
module.exports.verifierCode = (code) => {
  try {
    const decoded = jwt.verify(code, process.env.HASH_SALT);
    return decoded.email;
  } catch (error) {
    console.error("Code invalide ou expiré.");
    return null;
  }
};

//conditions types

/**
 * @typedef {object} TableFeald
 * @property {string} value - Description of the column property.
 * @property {string} operateur - Description of the column property.
 */

/**
 * @template T
 * @typedef {object} Condition<T>
 * @property {(Condition<T>|((Record<keyof T, TableFeald>) & Condition<T>))[]} and - Logical `AND` conditions
 * @property {(Condition<T>|((Record<keyof T, TableFeald>) & Condition<T>))[]} or - Logical `OR` conditions
 */

/**
 *
 * @param {Condition} condition
 * @returns
 */
module.exports.parse_condition = (condition) => {
  if (!condition) return " 1=1";
  const sql = [];
  for (const [key, val] of Object.entries(condition)) {
    if (key === "and" || key === "or") {
      sql.push(
        `(${val.map(module.exports.parse_condition).join(" " + key + " ")})`
      );
    } else {
      sql.push(
        `${key} ${val.operateur} ${
          typeof val.value == "object"
            ? null
            : "'" + module.exports.escapeChar(val.value + "") + "'"
        }
        `
      );
    }
  }
  return sql.join(" and ");
};

module.exports.escapeChar = (string) => {
  let str = "";
  const badChars = {
    "'": "\\'",
    '"': '\\"',
    "\\": "\\\\",
    ";": "\\;",
    "--": "\\--",
    "/*": "\\/*",
    "*": "\\*",
    "%": "\\%",
    _: "\\_",
    "(": "\\(",
    ")": "\\)",
    "-": "\\-",
    "=": "\\=",
    ">": "\\>",
    "<": "\\<",
    "|": "\\|",
    "!": "\\!",
    "@": "\\@",
  };

  for (let i = 0; i < string.length; i++) {
    str += badChars[string[i]] || string[i];
  }
  return str;
};
module.exports.courierStates = {
  normal: "normal",
  urgent: "urgent",
  "tres urgent": "tres urgent",
};
module.exports.documentType = {
  courier: "courier",
  event: "event",
};
module.exports.APP_LINKS = {
  FRONT_END: "http://localhost:3000",
  BACK_END: "http://localhost:4000",
};
module.exports.USE_DEV = true;
