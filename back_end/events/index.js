const cron = require("node-cron");
const { Notifications } = require("../Models");

module.exports.startTasks = function () {
  cron.schedule("0 0 * * *", async (date) => {
    await Notifications.Sync();
    await Notifications.NotifyAll();
  });
};
module.exports.startTasks();
