const path = require("path");
const { CourierAssignee, Users } = require("../Models");
const { mailer, APP_LINKS } = require("../utils");
const fs = require("fs");
module.exports.notifyCourierCreation = async (
  to,
  expiditeur,
  state,
  deadline,
  created_at,
  title,
  id_courier
) => {
  return await mailer.sendEmail({
    to: to,
    subject: "Création d'un Courrier",
    html: {
      STRING_CODE: fs.readFileSync(
        path.join(__dirname, "..", "utils", "CreateCourrier.html"),
        { encoding: "utf-8" }
      ),
      DATA_TO_REPLACE: {
        expiditeur,
        state,
        deadline,
        created_at,
        title,
        link: APP_LINKS.FRONT_END + "/courrier/update/" + id_courier,
      },
      SOURCE_WORD: "courier",
    },
  });
};
//!khdama
module.exports.notifyCourierDeadline = async () => {
  /*idea => get all couriers that have deadline in 48h 
    => get all users that are in the departements and groups of the courier 
    => send email to the users

  */
  try {
    const couriers = await CourierAssignee.getCouriers(
      undefined,
      undefined,
      "deadline >= ? AND deadline<= ?",
      [
        new Date().toISOString().split("T")[0],
        new Date(new Date().getTime() + 2 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
      ]
    );
    couriers[1].forEach(async (courier) => {
      const users = await Users.read({
        or: [
          ...courier.departements.map((e) => ({
            departement_id: { value: e, operateur: "=" },
          })),
          ...courier.groups.map((e) => ({
            group_id: { value: e, operateur: "=" },
          })),
        ],
      });
      users[1].forEach(async (user) => {
        mailer.sendEmail({
          to: user.email,
          subject: "Rappel Urgent : Échéance de votre courrier approchant !",
          html: {
            STRING_CODE: fs.readFileSync(
              path.join(__dirname, "..", "utils", "DeadlineCourier.html"),
              { encoding: "utf-8" }
            ),
            DATA_TO_REPLACE: {
              description: courier.description,
              expiditeur: courier.expiditeur,
              state: courier.state,
              deadline: courier.deadline,
              created_at: courier.created_at,
              title: courier.title,
              link: APP_LINKS.FRONT_END + "/courrier/update/" + courier.id, //!modifer le lien
            },
            SOURCE_WORD: "courier",
          },
        });
      });
    });
  } catch (e) {
    console.log("data base error", e);
    process.exit(1);
  }
};
