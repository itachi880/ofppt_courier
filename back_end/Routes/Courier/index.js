const { Courier, CourierAssignee } = require("../../Models");
const { auth_middleware, Roles } = require("../../utils");
const router = require("express").Router();
router.use(auth_middleware);

router.post("/add", async (req, res) => {
  if (req.user.role != Roles.admin) return res.status(401).end("don't have access");
  const [err, response] = await Courier.insert({ titel: req.body.titel, deadline: req.body.deadline, state: req.body.state, description: req.body.description, create_by: req.user.id });
  if (err) return res.status(500).end("back end err") && console.log(err);
  const assigneed_to = req.body.assigneed_to;
  if (!assigneed_to) return res.status(205).end(response.insertId + "");
  const [err2] = await CourierAssignee.insertMany(assigneed_to.map((e) => ({ courier_id: response.insertId, department_id: e.department_id, group_id: e.group_id })));
  if (err2) return res.status(500).end("back end err") && console.log(err2);
  return res.end(response.insertId + "");
});

router.get("/all", async (req, res) => {
  let [err, response] = [null, null];
  //get the couriel for the user;
  if (req.user.role == Roles.admin) {
    [err, response] = await CourierAssignee.getCouriers();
  } else {
    [err, response] = await CourierAssignee.getCouriers(req.user.depId, req.user.grpId);
  }
  if (err) return res.status(500).end("back end err") && console.log(err);
  return res.json(response);
});

router.get("/:id", async (req, res) => {
  const [err, response] = await Courier.read({ and: [{ id: { value: req.params.id, operateur: "=" } }] });
  if (err) return res.status(500).end("back end err") && console.log(err);
  return res.json(response);
});

//!  L jadiiiid
// Route to assign a courier to a department/group

// Route to update an existing assignment
router.post("/update/assigne", async (req, res) => {
  // Check if the user is an admin
  if (req.user.role !== Roles.admin) return res.status(401).end("Don't have access");

  const { courierId, depId, grpId, userId } = req.body;

  // Check for required fields
  if (!courierId || !depId || !userId) {
    return res.status(400).end("Courier ID, Department ID, Assignee Type, and User ID are required");
  }

  // Update the assignment in the database
  const [err] = await CourierAssignee.updateAssignment({
    courier_id: courierId,
    department_id: depId,
    group_id: grpId,
    user_id: userId,
  });

  if (err) return console.error(err) && res.status(500).end("Backend error");

  return res.end("Done");
});

// Route to get an assignment by courierId

//? momkin t7ayd o tb9a ghi get courrier by id li lfo9

router.get("/assigne/:courierId", async (req, res) => {
  // Get the courierId from the request parameters
  const courierId = req.params.courierId;

  if (!courierId) return res.status(400).end("Courier ID is required");

  // Retrieve the assignment from the database
  const [err, response] = await CourierAssignee.getAssignmentByCourierId(courierId);
  if (err) return console.error(err) && res.status(500).end("Backend error");

  if (!response || response.length === 0) return res.status(404).end("Assignment not found");

  return res.json(response);
});
router.post("/update/:courierId", async (req, res) => {
  const courierId = req.params.courierId;

  if (!courierId) {
    return res.status(400).send("Courier ID is required");
  }

  const { title, description, deadline, critical } = req.body;
  // Validation des données
  if (!title || !description || !deadline) {
    return res.status(400).send("Missing required fields: title, description, or deadline");
  }

  try {
    // Rechercher le courrier dans la base de données
    const courier = await Courier.updateByID(courierId, { title, description, deadline, critical });
    if (!courier) {
      return res.status(404).send("Courier not found");
    }
    res.status(200).json({
      message: "Courier updated successfully",
      courier,
    });
  } catch (error) {
    console.error("Error updating courier:", error);
    res.status(500).send("Server error");
  }
});

//!
module.exports = router;
