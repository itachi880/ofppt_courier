const cron = require("node-cron");
const { notifyCourierDeadline } = require("./services/mailer");

module.exports.cron = () => {
  cron.schedule("0 0 * * *", async (date) => {
    console.log(date);
    console.log("start notifyCourierDeadline");
    await notifyCourierDeadline();
    console.log("end notifyCourierDeadline");
  });
};
