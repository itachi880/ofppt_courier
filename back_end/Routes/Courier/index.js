const path = require("path");
const { Courier, CourierAssignee, TablesNames } = require("../../Models");
const {
  auth_middleware,
  Roles,
  fileSaver,
  documentType,
} = require("../../utils");
const router = require("express").Router();
const fs = require("fs");
router.use(auth_middleware);

router.post("/add", fileSaver.array("files", 3), async (req, res) => {
  if (req.user.role != Roles.admin)
    return res.status(401).end("Don't have access");

  const [err, response] = await Courier.insert({
    title: req.body.titel,
    deadline: req.body.deadline,
    state: req.body.state,
    description: req.body.description,
    expiditeur: req.body.expiditeur,
    create_by: req.user.id,
    is_courier: +(req.body.type == documentType.courier),
    created_at: req.body.created_at,
  });
  if (err) {
    console.error(err);
    return res.status(500).end("Backend error");
  }

  if (req.files.length > 0) {
    const files = req.files.map((e, i) => {
      const fileName = `${i}_${Date.now()}.${e.originalname.split(".")[1]}`;
      fs.writeFile(
        path.join(__dirname, "..", "..", "data", fileName),
        e.buffer,
        (writeErr) => {
          if (writeErr) console.error(writeErr);
        }
      );
      return fileName;
    });

    const [err1] = await Courier.insertFiles(files, response.insertId);
    if (err1) {
      console.error(err1);
      return res.status(500).end("Backend error");
    }
  }

  let assigneed_to;
  try {
    assigneed_to = JSON.parse(req.body.assigneed_to);
  } catch (parseErr) {
    console.error(parseErr);
    return res.status(400).end("Invalid assigneed_to format");
  }

  if (!assigneed_to) return res.status(205).end(response.insertId + "");
  const [err2] = await CourierAssignee.insertMany([
    ...assigneed_to.departements.map((e) => ({
      courier_id: response.insertId,
      department_id: e,
    })),
    ...assigneed_to.groups.map((grp) => ({
      courier_id: response.insertId,
      group_id: grp,
    })),
  ]);

  if (err2) {
    console.error(err2);
    return res.status(500).end("Backend error");
  }

  return res.end(response.insertId + "");
});

router.get("/all", async (req, res) => {
  let [err, response] = [null, null];
  const pageNember = req.query.page;
  if (req.user.role == Roles.admin) {
    [err, response] = await CourierAssignee.getCouriers(
      undefined,
      undefined,
      undefined,
      undefined,
      true,
      pageNember
    );
  } else {
    [err, response] = await CourierAssignee.getCouriers(
      req.user.depId,
      req.user.grpId,
      undefined,
      undefined,
      true,
      pageNember
    );
  }
  if (err) return res.status(500).end("back end err") && console.log(err);
  return res.json(response);
});

router.post(
  "/update/:courierId",
  fileSaver.array("files", 3),
  async (req, res) => {
    const courierId = req.params.courierId;

    if (!courierId) return res.status(400).send("Courier ID is required");

    try {
      const [courierError, courierData] = await Courier.read({
        and: [
          {
            [TablesNames.courier + ".id"]: {
              value: courierId,
              operateur: "=",
            },
          },
        ],
      });
      if (courierError) return res.status(404).end("not found");
      //!check for role and dep and group
      if (updateError) return res.status(404).send("Courier not found");
      console.log(req.body.assigneed_to);
      const [assigneError] = await CourierAssignee.updateAssignment(
        JSON.parse(req.body.assigneed_to),
        courierId
      );
      if (assigneError) return res.status(500).end("");
      const deleted_imgs = JSON.parse(req.body.deleted_imgs).imgs || [];
      const [errDelete] = await Courier.deleteFiles(deleted_imgs);
      if (!errDelete)
        deleted_imgs.forEach((file) => {
          fs.unlink(path.join(__dirname, "..", "..", "data", file), (err) => {
            if (err) console.error(`Error deleting file ${file}:`, err);
          });
        });
      if (!req.files || req.files.length === 0)
        return res.end("Courier updated successfully");
      const files = req.files.map((file, i) => {
        const name = `${i}_${Date.now()}.${file.originalname.split(".")[1]}`;
        fs.writeFile(
          path.join(__dirname, "..", "..", "data", name),
          file.buffer,
          () => {}
        );
        return name;
      });
      const [errInsert] = await Courier.insertFiles(files, courierId);
      if (errInsert) return res.status(500).end("new imgs not inserted");
      return res.end("Courier updated successfully");
    } catch (error) {
      console.error("Error updating courier:", error);
      res.status(500).send("Server error");
    }
  }
);
router.get("/bettwen", async (req, res) => {
  const { startDate, endDate = null } = req.query;
  if (!startDate && !endDate) {
    return res.status(400).send("Start date and end date are required");
  }
  try {
    let [err, response] = [null, null];
    if (req.user.role == Roles.admin) {
      [err, response] = await CourierAssignee.getCouriers(
        undefined,
        undefined,
        endDate ? "  deadline >= ? AND deadline <= ? " : "  deadline >= ?",
        endDate ? [startDate, endDate] : [startDate]
      );
    } else {
      [err, response] = await CourierAssignee.getCouriers(
        req.user.depId,
        req.user.grpId,
        endDate ? "  deadline >= ? AND deadline <= ? " : "  deadline >= ? ",
        endDate ? [startDate, endDate] : [startDate]
      );
    }
    if (err) {
      console.error(err);
      return res.status(500).send("Backend error");
    }

    return res.json(response);
  } catch (error) {
    console.error("Error fetching couriers:", error);
    return res.status(500).send("Server error");
  }
});
router.get("/:id", async (req, res) => {
  try {
    const resl =
      req.user.role != Roles.admin
        ? await CourierAssignee.getCouriers(
            req.user.grpId,
            req.user.depId,
            ` ${TablesNames.courier}.id = ? `,
            [req.params.id]
          )
        : await CourierAssignee.getCouriers(
            undefined,
            undefined,
            ` ${TablesNames.courier}.id = ? `,
            [req.params.id]
          );
    if (resl[0]) return res.status(500).end("error") && console.log(resl[0]);
    return res.json(resl[1]);
  } catch (e) {
    return res.status(500).end("error");
  }
});
module.exports = router;
