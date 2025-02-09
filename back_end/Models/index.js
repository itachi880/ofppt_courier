const { db } = require("../database");
const { mailer, parse_condition, escapeChar } = require("../utils");

//!tables schema types
const TablesNames = {
  users: "users",
  departement: "departement",
  courier_assigne: "courier_assigne",
  group: "group",
  courier: "couriers",
  courier_files: "courier_files",
};

/**
 * @typedef {object} User user table schema
 * @property {number} id
 * @property {string} email
 * @property {string} password
 * @property {string} role
 * @property {number} departement_id
 * @property {number} group_id
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * @typedef {object} Departement departement table schema
 * @property {number} id
 * @property {string} name
 * @property {(number | null)} parent_department_id
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * @typedef {object} Group group table schema
 * @property {number} id
 * @property {string} name
 * @property {number} departement_id
 * @property {string} created_at
 * @property {string} updated_at
 */
/**
 * @typedef {object} DepartementGroup - left join with groups
 * @property {number} departement_id
 * @property {number} departement_parent_id
 * @property {string} departement_name
 * @property {(number | null)} group_id
 * @property {(string | null)} group_name
 */

/**
 * @typedef {object} CourierAssignee courier_assignees table schema
 * @property {number} id - Unique identifier for the assignee record.
 * @property {number} courier_id - Identifier for the associated courier.
 * @property {number} group_id - Identifier for the group (if assignee_type is 'group').
 * @property {number} department_id - Identifier for the department the assignee belongs to.
 * @property {string} created_at - Timestamp of when the assignee record was created.
 */

/**
 * @typedef {object} Courier - table database COURIER
 * @property {number} id - id de Courier
 * @property {string} title
 * @property {string} description
 * @property {string} deadline
 * @property {"normal"|"urgent"|"tres urgent"} state
 * @property {number} create_by - id de createur
 * @property {string} created_at
 * @property {string} expiditeur
 * @property {string} updated_at
 */
//! CourierAssignee
/**
 * @typedef {object} CourierAssignee
 * @property {number} id
 * @property {number} courier_id
 * @property {string} assignee_type
 * @property {number} user_id
 * @property {number} group_id
 * @property {number} department_id
 * @property {string} created_at
 */
//!
/**
 * @typedef {object} Notification - notification table schema
 * @property {number} id
 * @property {string} description
 * @property {number} dep_id
 * @property {number | null} grp_id
 * @property {string} date - ex: "YYYY-MM-DD"
 * @property {boolean} notified
 */

//query statement result

/**
 * @typedef {Object} insertResult
 * @property {number} insertId ID of the inserted row if it's an auto-increment field
 * @property {number} affectedRows Number of affected rows, usually 1 for INSERT
 * @property {number} warningStatus The number of warnings (if any)
 */

/**
 * @typedef {Object} updateResult
 * @property {number} affectedRows Number of affected rows, usually 1 for UPDATE
 * @property {number} changedRows Number of rows actually changed (i.e., with modified values)
 * @property {number} warningStatus The number of warnings (if any)
 */

/**
 * @typedef {Object} deleteResult
 * @property {number} affectedRows The number of rows that were deleted (typically 1 if the deletion was successful, 0 if no rows were found matching the condition).
 * @property {number} warningStatus The number of warnings generated during the query execution (usually 0 if there are no warnings).
 */

module.exports.Users = {
  /**
   * Insert a new user into the database
   * @param {User} user
   * @returns {Promise<[(import("mysql2").QueryError | string | null ),(insertResult | null )]>}
   */
  async insert(user) {
    try {
      const user_columns = Object.keys(user);
      if (user_columns.length == 0) return ["Fields are required", null];
      const query = `
      INSERT INTO ${TablesNames.users} (${user_columns.join(", ")})
      VALUES (${user_columns.map(() => "?").join(", ")})
    `;
      const values = Object.values(user);
      return [null, (await db.query(query, values))[0]]; // No error, returning the result
    } catch (e) {
      console.error(e);
      return [e, null]; // Returning the error message in case of failure
    }
  },
  /**
   * Update user information in the database by ID
   * @param {Partial<User>} data
   * @param {number} id
   * @returns {Promise<[(import("mysql2").QueryError | string | null ),(updateResult | null )]>}
   */
  async updateByID(id, data) {
    if (!id) return ["User ID is required", null];
    const setFields = [];
    const values = [];
    Object.entries(data).forEach((e) => {
      setFields.push(e[0] + "= ? ");
      values.push(e[1]);
    });
    if (setFields.length === 0) {
      return ["No fields to update", null];
    }
    const query = `
      UPDATE ${TablesNames.users} 
      SET ${setFields.join(", ")} 
      WHERE id = ?
    `;
    values.push(id);

    try {
      return [null, (await db.query(query, values))[0]];
    } catch (e) {
      console.error(e);
      return [e, null];
    }
  },

  /**
   * Update user information with conditions
   * @param {Partial<User>} data
   * @param {import("../utils").Condition<User>} by
   * @returns {Promise<[(import("mysql2").QueryError | string | null ),(updateResult | null )]>}
   */
  async update(data, by) {
    try {
      const setFields = [];
      const values = [];
      Object.entries(data).forEach((e) => {
        setFields.push(e[0] + " = ? ");
        values.push(e[1]);
      });
      if (setFields.length === 0) return ["No fields to update", null];

      const query = `
      UPDATE ${TablesNames.users}  
      SET ${setFields.join(", ")} 
      WHERE ${parse_condition(by)}
    `;

      return [null, (await db.query(query, values))[0]];
    } catch (e) {
      console.error(e);
      return [e, null];
    }
  },

  /**
   * @param {number} id The ID of the user to delete.
   * @returns {Promise<[(import("mysql2").QueryError | string | null ),(deleteResult | null )]>} A promise that resolves to the deletion response containing either an error message or the result object.
   */
  async deleteByID(id) {
    if (!id) return ["User ID is required", null];

    const query = `
      DELETE FROM ${TablesNames.users}
      WHERE id = ?
    `;

    try {
      return [null, (await db.query(query, [id]))[0]];
    } catch (e) {
      console.error(e);
      return [e, null];
    }
  },

  /**
   * Read users from the database with optional filtering conditions
   * @param {import("../utils").Condition<User>} by - Conditions for filtering users (e.g., { name: { value: 'John', operateur: '=' } })
   * @returns {Promise<[(import("mysql2").QueryError | string | null ),(Array<User> | null)]>}
   */
  async read(by) {
    try {
      const query = `SELECT * FROM ${TablesNames.users} WHERE ${parse_condition(
        by
      )}`;
      const [rows] = await db.query(query);
      return [null, rows];
    } catch (e) {
      console.error(e);
      return [e, null];
    }
  },
  /**
   * Read a single user by ID from the database
   * @param {number} id - The ID of the user to retrieve
   * @returns {Promise<[(import("mysql2").QueryError | string | null ),(User | null)]>}
   */
  async readById(id) {
    try {
      const query = `SELECT * FROM ${TablesNames.users} WHERE id = ? LIMIT 1`;
      const [rows] = await db.query(query, [id]);
      if (rows.length === 0) {
        return ["User not found", null]; // Retourne une erreur si l'utilisateur n'existe pas
      }

      return [null, rows[0]]; // Retourne l'utilisateur trouvé
    } catch (e) {
      console.error(e);
      return [e, null];
    }
  },

  /**
   * Search for users based on search criteria
   * @param {Partial<User>} searchCriteria - The search criteria to match users
   * @returns {Promise<[(import("mysql2").QueryError | string | null ),(Array<User> | null)]>}
   */
  async searchForUser(searchCriteria) {
    try {
      if (!searchCriteria || Object.keys(searchCriteria).length === 0) {
        return ["No search criteria provided", null];
      }
      const values = [];
      const conditions = Object.entries(searchCriteria).map(([key, value]) => {
        if (typeof value == "string") {
          values.push("%" + value + "%");
          return `${key} LIKE ?`;
        }
        values.push(value);
        return `${key} = ?`;
      });
      const query = `SELECT * FROM ${TablesNames.users} WHERE ${conditions.join(
        " AND "
      )}`;

      const [rows] = await db.query(query, values);
      return [null, rows]; // Return users matching the criteria
    } catch (e) {
      console.error(e);
      return [e, null]; // Return any error
    }
  },
};

module.exports.Departement = {
  /**
   * @param {Departement} departement
   * @returns {Promise<[(import("mysql2").QueryError|string|null),(insertResult|null)]>}
   */
  async insert(departement) {
    try {
      const departement_columns = Object.keys(departement);
      if (departement_columns.length == 0) return ["all feald required", null];
      const query = `
      INSERT INTO ${TablesNames.departement} (${departement_columns.join(", ")})
      VALUES (${departement_columns.map(() => "?").join(", ")})
    `;
      const values = Object.values(departement);

      return [null, (await db.query(query, values))[0]]; // No error, returning the result
    } catch (e) {
      console.error(e);
      return [e, null]; // Returning the error message in case of failure
    }
  },
  /**
   * @param {import("../utils").Condition<DepartementGroup>} by
   * @returns {Promise<[(import("mysql2").QueryError|string|null),(insertResult|null)]>}
   */
  async read(by) {
    try {
      const query = `
      SELECT ${TablesNames.departement}.id AS department_id,
       ${TablesNames.departement}.name AS department_name,
       ${TablesNames.departement}.parent_department_id AS department_parent_id,
       \`${TablesNames.group}\`.id AS   ${TablesNames.group}_id,
       \`${TablesNames.group}\`.name AS   ${TablesNames.group}_name 
        FROM ${TablesNames.departement} LEFT JOIN \`${TablesNames.group}\` 
        ON ${TablesNames.departement}.id = \`${TablesNames.group}\`.${
        TablesNames.departement
      }_id
        WHERE ${parse_condition(by)} 
      `;

      const rows = [];
      const idsIndexes = {};
      const queryResult = await db.query(query);
      queryResult[0].forEach((row) => {
        const index = idsIndexes[row.department_id];
        if (index >= 0) {
          if (!row.group_id) return;
          rows[index].groups.push({ id: row.group_id, name: row.group_name });
        } else {
          idsIndexes[row.department_id] =
            rows.push({
              department_id: row.department_id,
              department_name: row.department_name,
              parent_department_id: row.parent_department_id,
              groups: [],
            }) - 1;
          if (!row.group_id) return;
          rows[idsIndexes[row.department_id]].groups.push({
            id: row.group_id,
            name: row.group_name,
          });
        }
        return;
      });
      return [null, rows];
    } catch (e) {
      console.error(e);
      return [e, null];
    }
  },
  /**
   * @param {number} id
   * @param {Partial<Departement>} by
   * @returns {Promise<[(import("mysql2").QueryError|string|null),(updateResult|null)]>}
   */
  async update(id, by) {
    try {
      const data = Object.entries(by);
      if (!id || data.length == 0) return ["data required", null];
      const sql = [];
      const values = [];
      data.forEach((column) => {
        sql.push(column[0] + " = ?");
        values.push(column[1]);
      });
      values.push(id);
      const query = `
        UPDATE ${TablesNames.departement} 
        SET ${sql.join(" ,")} 
        WHERE id = ?
  `;
      return [null, (await db.query(query, values))[0]];
    } catch (e) {
      return [e, null];
    }
  },
  /**
   * @param {number} id - id of departement
   * @returns {Promise<[(import("mysql2").QueryError|string | null) , (deleteResult | null)]>}
   */
  async deleteByID(id) {
    try {
      if (!id) return ["id requierd", null];
      const query = `
      DELETE FROM ${TablesNames.departement}
      WHERE id = ?
    `;

      return [null, (await db.query(query, [id]))[0]];
    } catch (e) {
      console.error(e);
      return [e, null];
    }
  },
  /**
   * @param {number} id
   * @returns {Promise<[(import("mysql2").QueryError | null | string),(Array<Group> | null)]>}
   */
  async getGroups(id) {
    try {
      if (!id) return ["id requierd", null];
      const query = `SELECT * FROM \`${TablesNames.group}\` WHERE id = ? `;

      return [null, (await db.query(query, [id]))[0]];
    } catch (e) {
      return [e, null];
    }
  },
};

module.exports.Group = {
  /**
   * Insert a new group into the database
   * @param {Group} group
   * @returns {Promise<[(import("mysql2").QueryError|string|null),(insertResult|null)]>}
   */
  async insert(group) {
    try {
      const group_columns = Object.keys(group);
      if (group_columns.length == 0) return ["All fields are required", null];
      const query = `
      INSERT INTO \`${TablesNames.group}\` (${group_columns.join(", ")})
      VALUES (${group_columns.map(() => "?").join(", ")})
    `;
      const values = Object.values(group);

      return [null, (await db.query(query, values))[0]];
    } catch (e) {
      console.error(e);
      return [e, null];
    }
  },

  /**
   * Retrieve groups based on conditions
   * @param {import("../utils").Condition<Group>} by
   * @returns {Promise<[(import("mysql2").QueryError|string|null),(Array<Group>|null)]>}
   */
  async read(by) {
    try {
      const query = `SELECT * FROM \`${
        TablesNames.group
      }\` WHERE ${parse_condition(by)}`;

      const [rows] = await db.query(query);
      return [null, rows];
    } catch (e) {
      console.error(e);
      return [e, null];
    }
  },

  /**
   * Update a group's information
   * @param {number} id - The ID of the group to update
   * @param {Partial<Group>} updates - Fields to update
   * @returns {Promise<[(import("mysql2").QueryError|string|null),(updateResult|null)]>}
   */
  async update(id, updates) {
    try {
      if (!id || Object.keys(updates).length === 0)
        return ["ID and update fields are required", null];
      const fields = [];
      const values = [];
      for (const [key, value] of Object.entries(updates)) {
        fields.push(`${key} = ?`);
        values.push(value);
      }
      values.push(id);

      const query = `
      UPDATE \`${TablesNames.group}\`
      SET ${fields.join(", ")}
      WHERE id = ?
    `;

      return [null, (await db.query(query, values))[0]];
    } catch (e) {
      console.error(e);
      return [e, null];
    }
  },

  /**
   * Delete a group by ID
   * @param {number} id - ID of the group to delete
   * @returns {Promise<[(import("mysql2").QueryError|string|null),(deleteResult|null)]>}
   */
  async deleteByID(id) {
    try {
      if (!id) return ["Group ID is required", null];
      const query = `
      DELETE FROM \`${TablesNames.group}\`
      WHERE id = ?
    `;

      return [null, (await db.query(query, [id]))[0]];
    } catch (e) {
      console.error(e);
      return [e, null];
    }
  },
};

module.exports.Courier = {
  /**
   * Insert a new courier into the database
   * @param {Partial<Courier>} courier
   * @returns {Promise<[(import("mysql2").QueryError | string | null ),(insertResult | null )]>}
   */

  async insert(courier) {
    try {
      const courier_columns = Object.keys(courier);
      if (courier_columns.length == 0) return ["Fields are required", null];

      const query = `
        INSERT INTO ${TablesNames.courier} (${courier_columns.join(", ")})
        VALUES (${courier_columns.map(() => "?").join(", ")})
      `;
      const values = Object.values(courier);
      return [null, (await db.query(query, values))[0]];
    } catch (e) {
      console.error(e);
      return [e, null];
    }
  },

  /**
   * Update courier information in the database by ID
   * @param {Courier} courier
   * @param {number} id
   * @returns {Promise<[(import("mysql2").QueryError | string | null ),(updateResult | null )]>}
   */
  async updateByID(id, courier) {
    try {
      if (!id) return ["Courier ID is required", null];

      const setFields = [];
      const values = [];
      Object.entries(courier).forEach((column) => {
        setFields.push(column[0] + " = ?");
        values.push(column[1]);
      });

      if (setFields.length === 0) {
        return ["No fields to update", null];
      }

      const query = `
        UPDATE ${TablesNames.courier}
        SET ${setFields.join(", ")}
        WHERE id = ?
      `;
      values.push(id);

      return [null, (await db.query(query, values))[0]];
    } catch (e) {
      console.error(e);
      return [e, null];
    }
  },

  /**
   * Read couriers from the database with optional filtering conditions
   * @param {import("../utils").Condition<Courier>} by - Conditions for filtering couriers
   * @returns {Promise<[(import("mysql2").QueryError | string | null ),(Array<Courier> | null)]>}
   */
  async read(by = {}) {
    try {
      const query = `SELECT ${TablesNames.courier}.id, 
      ${TablesNames.courier}.title, 
      ${TablesNames.courier}.description, 
      ${TablesNames.courier}.deadline, 
      ${TablesNames.courier}.state, 
      ${TablesNames.courier}.created_at, 
      ${TablesNames.courier}.is_courier, 
      ${TablesNames.courier}.updated_at,
      ${TablesNames.courier_files}.id as img_id,
      path FROM ${TablesNames.courier} JOIN ${TablesNames.courier_files} on ${
        TablesNames.courier
      }.id=${TablesNames.courier_files}.courier_id ${parse_condition(by)}`;

      const rows = [];

      const res = await db.query(query);
      res[0].forEach((courier) => {
        const index = rows.findIndex((row) => row.id == courier.id);
        if (index >= 0) return rows[index].path.push(courier.path);
        courier.path = [courier.path];
        rows.push(courier);
      });
      return [null, rows];
    } catch (e) {
      console.error(e);
      return [e, null];
    }
  },

  /**
   * Delete a courier by ID
   * @param {number} id - ID of the courier to delete
   * @returns {Promise<[(import("mysql2").QueryError | string | null ),(deleteResult | null)]>}
   */
  async deleteByID(id) {
    try {
      if (!id) return ["Courier ID is required", null];

      const query = `
        DELETE FROM ${TablesNames.courier}
        WHERE id = ?
      `;

      return [null, (await db.query(query, [id]))[0]];
    } catch (e) {
      console.error(e);
      return [e, null];
    }
  },
  async insertFiles(files, id) {
    try {
      const query = `INSERT INTO courier_files (path, courier_id) VALUES ${files
        .map(() => "(?, ?)")
        .join(", ")}`;
      const values = files.flatMap((file) => [file, id]);
      return [null, (await db.query(query, values))[0]];
    } catch (e) {
      console.error(e);
      return [e, null];
    }
  },
  /**
   *
   * @param {string[]} files
   * @returns {Promise<[(null| import("mysql2").QueryError),(null | string | deleteResult)]>}
   */
  async deleteFiles(files) {
    if (!files || files.length == 0) return ["no files", null];
    try {
      const query = `DELETE FROM courier_files WHERE ${files
        .map((file) => `path='${escapeChar(file)}'`)
        .join(" OR ")}`;
      return [null, (await db.query(query))[0]];
    } catch (e) {
      return [e, null];
    }
  },
};

// ? sholde run as cron job each day & one time at app start up

module.exports.Notifications = {
  /**
   * @type {Record<string, Notification[]>}
   */
  NotificationsQueue: {},
  tomorrow: new Date(Date.now() + 86400000),
  today: new Date(),

  /**
   * Add a notification to the database
   * @param {Notification} notification
   * @returns {Promise<void>}
   */
  async AddNotif(notification) {
    try {
      await db.query(
        "INSERT INTO notifications (description, dep_id, grp_id, date, notified) VALUES (?, ?, ?, ?, ?)",
        [
          notification.description,
          notification.dep_id,
          notification.grp_id,
          notification.date,
          false, // Default notified to false
        ]
      );
    } catch (e) {
      console.error("Error in notification preparation", e);
    }
  },

  /**
   * Notify all users for today's notifications
   * @returns {Promise<void>}
   */
  async NotifyAll() {
    const today = this.today.toISOString().split("T")[0];
    const notifications = this.NotificationsQueue[today] || [];

    for (const notif of notifications) {
      try {
        let query = "SELECT email FROM users WHERE ";
        if (notif.dep_id && !notif.grp_id)
          query += `department_id=${notif.dep_id} AND group_id IS NULL`;
        else if (notif.dep_id && notif.grp_id)
          query += `group_id=${notif.grp_id} OR (department_id=${notif.dep_id} AND group_id IS NULL)`;

        const [mailed_to] = await db.query(query);
        mailed_to.forEach((person) => {
          mailer.sendEmail({
            subject: "Notification OFPPT_COURIER",
            text: notif.description,
            to: person.email,
          });
        });

        await db.query("DELETE FROM notifications WHERE id = ?", [notif.id]);
      } catch (err) {
        console.error(`Failed to notify for: ${notif.id}`, err);
      }
    }

    delete this.NotificationsQueue[today];
  },

  /**
   * Sync notifications from the database to the queue
   * @returns {Promise<void>}
   */
  async Sync() {
    const today = this.today.toISOString().split("T")[0];
    const [notifications] = await db.query(
      "SELECT * FROM notifications WHERE notified = false AND date = ?",
      [today]
    );
    if (!this.NotificationsQueue[today])
      this.NotificationsQueue[today] = notifications;
    else this.NotificationsQueue[today].push(...notifications);
  },
};

// !   L jadiid

module.exports.CourierAssignee = {
  /**
   *
   * @param {CourierAssignee} courier_assignee
   * @returns {Promise<[(import("mysql2").QueryError | string | null ),( insertResult | null)]>}
   */
  async insert(courier_assignee) {
    try {
      const columns = Object.keys(courier_assignee);
      if (columns.length == 0) return ["Fields required", null];
      const query = `INSERT INTO ${TablesNames.courier_assigne} (${columns.join(
        ", "
      )}) VALUES (${columns.map(() => "?").join(", ")})`;
      const values = Object.values(courier_assignee);
      return [null, (await db.query(query, values))[0]];
    } catch (e) {
      console.error(e);
      return [e, null];
    }
  },
  /**
   *
   * @param {{departments:number[],groups:number[]}} courier_assignee
   * @param {number} id - courier id
   * @returns {Promise<[(import("mysql2").QueryError | string | null ),( insertResult | null)]>}
   */
  // [{dep_id},{group_id}] ()
  async insertMany(courier_assignee, id) {
    const keys = Object.keys(courier_assignee);

    // If no assignments are provided
    if (keys.length === 0) return ["no assignees", null];

    try {
      // Fixed columns order
      const columns = `courier_id, group_id, department_id`;
      let query = `
        INSERT INTO ${TablesNames.courier_assigne}
        (${columns})
        VALUES `;

      // Prepare placeholders and values
      const placeholders = [];
      const values = [];

      keys.forEach((key) => {
        if (!courier_assignee[key]) return;
        const row = [
          id ?? courier_assignee[key].courier_id,
          courier_assignee[key].group_id ?? null,
          courier_assignee[key].department_id ?? null,
        ];

        placeholders.push(`(?, ?, ?)`);
        values.push(...row);
      });

      query += placeholders.join(", ");

      // Execute the query
      const [result] = await db.query(query, values);
      return [null, result];
    } catch (e) {
      return [e, null];
    }
  },
  /**
   *
   * @param {import("../utils").Condition<CourierAssignee>} by
   * @returns {Promise<[(import("mysql2").QueryError | string | null ),( CourierAssignee[] | null)]>}
   *
   */

  async read(by) {
    try {
      const query = `SELECT * FROM ${
        TablesNames.courier_assigne
      } WHERE ${parse_condition(by)}`;
      const [rows] = await db.query(query);
      return [null, rows];
    } catch (e) {
      console.error(e);
      return [e, null];
    }
  },
  /**
   *
   * @param {number} id
   * @returns {Promise<[(import("mysql2").QueryError | string | null ),( deleteResult | null)]>}
   */
  async deleteByID(id) {
    try {
      if (!id) return ["ID required", null];
      const query = `DELETE FROM ${TablesNames.courier_assigne} WHERE id = ?`;
      return [null, (await db.query(query, [id]))[0]];
    } catch (e) {
      console.error(e);
      return [e, null];
    }
  },
  /**
   * Update an existing assignment
   * @param {Partial<{departements:number[],groups:number[]}>} assignment
   * @returns {Promise<[(import("mysql2").QueryError | string | null ),(insertResult | null)]>}
   */
  async updateAssignment(assignment, id) {
    try {
      const [resDel] = await db.query(
        `DELETE FROM ${TablesNames.courier_assigne} WHERE courier_id=${id};`
      );
      if (!assignment.groups) assignment.groups = [];
      if (!assignment.departements) assignment.departements = [];
      const [res] = await db.query(`
      INSERT INTO ${
        TablesNames.courier_assigne
      } (courier_id,group_id,department_id) values ${[
        ...assignment.departements.map((dep) => `(${id},NULL,${dep})`),
        ...assignment.groups.map((grp) => `(${id},NULL,${grp})`),
      ].join(",")}`);
      return [null, res];
    } catch (e) {
      console.error(e);
      return [e, null];
    }
  },
  /**
   * Get couriers by department ID or group ID
   * @param {number} dep_id - Department ID
   * @param {number} grp_id - Group ID
   * @returns {Promise<[(import("mysql2").QueryError | string | null ),(Array<Courier> | null)]>}
   */
  async getCouriers(
    dep_id,
    grp_id,
    condition,
    conditionValue,
    pagination = false,
    page = 0,
    pageSize = 10
  ) {
    try {
      let query = `SELECT 
      ${TablesNames.courier}.id, 
      ${TablesNames.courier}.title, 
      ${TablesNames.courier}.description, 
      ${TablesNames.courier}.deadline, 
      ${TablesNames.courier}.expiditeur, 
      ${TablesNames.courier}.state, 
      ${TablesNames.courier_assigne}.group_id, 
      ${TablesNames.courier_assigne}.department_id, 
      ${TablesNames.courier}.created_at, 
      ${TablesNames.courier}.is_courier, 
      ${TablesNames.courier}.updated_at, 
      ${TablesNames.courier_files}.path 
    FROM ${TablesNames.courier_assigne} 
    JOIN ${TablesNames.courier} 
    ON ${TablesNames.courier_assigne}.courier_id = ${TablesNames.courier}.id 
    LEFT JOIN ${TablesNames.courier_files} 
    ON ${TablesNames.courier_files}.courier_id = ${TablesNames.courier}.id`;

      const values = [];

      if (dep_id) {
        query += ` WHERE ${TablesNames.courier_assigne}.department_id = ?`;
        values.push(dep_id);
      } else if (grp_id) {
        query += ` WHERE ${TablesNames.courier_assigne}.group_id = ?`;
        values.push(grp_id);
      }

      if (condition) {
        if (dep_id || grp_id) query += " AND ";
        else query += " WHERE ";
        query += condition;
        values.push(...conditionValue);
      }
      if (pagination) {
        query += ` ORDER BY ${TablesNames.courier}.created_at DESC`;
        query += ` LIMIT ? OFFSET ?`;
        values.push(pageSize, page * pageSize - pageSize);
      }
      const [rows] = await db.query(query, values);

      const result = [];
      const insertedIds = new Map();

      rows.forEach((row) => {
        const courierId = row[`id`];
        if (!insertedIds.has(courierId)) {
          row[`deadline`].setHours(24);

          result.push({
            id: courierId,
            title: row[`title`],
            description: row[`description`],
            expiditeur: row[`expiditeur`],
            deadline: row[`deadline`],
            state: row[`state`],
            created_at: row[`created_at`],
            updated_at: row[`updated_at`],
            is_courier: row[`is_courier`],
            departements: [],
            groups: [],
            imgs: [],
          });
          insertedIds.set(courierId, result.length - 1);
        }

        const index = insertedIds.get(courierId);
        if (
          row.department_id &&
          !result[index].departements.includes(row.department_id)
        ) {
          result[index].departements.push(row.department_id);
        }
        if (row.group_id && !result[index].groups.includes(row.group_id)) {
          result[index].groups.push(row.group_id);
        }
        if (row.path && !result[index].imgs.includes(row.path)) {
          result[index].imgs.push(row.path);
        }
      });

      return [null, result];
    } catch (e) {
      console.error(e);
      return [e, null];
    }
  },
};
