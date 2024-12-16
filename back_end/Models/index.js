const { db } = require("../database");
const cron = require("node-cron");

//tables schema types
const TablesNames = { users: "users", departement: "departement", courier_assigne: "courier_assigne", group: "group", courier: "couriers" };

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
 * @property {(number|null)} parent_department_id
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
 * @typedef {object} CourierAssignee courier_assignees table schema
 * @property {number} id - Unique identifier for the assignee record.
 * @property {number} courier_id - Identifier for the associated courier.
 * @property {string} assignee_type - Type of the assignee (e.g., user, group).
 * @property {number} user_id - Identifier for the user (if assignee_type is 'user').
 * @property {number} group_id - Identifier for the group (if assignee_type is 'group').
 * @property {number} department_id - Identifier for the department the assignee belongs to.
 * @property {string} created_at - Timestamp of when the assignee record was created.
 */

/**
 * @typedef {object} Courier - table database COURIER
 * @property {number} id - id de Courier
 * @property {string} titel
 * @property {string} description
 * @property {string} deadline
 * @property {"normal"|"urgent"|"tres urgent"} state
 * @property {number} create_by - id de createur
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * @typedef {object} Notification - notification table schema
 * @property {number} id
 * @property {string} description
 * @property {number} dep_id
 * @property {number | null} grp_id
 * @property {string} date - ex: "YYYY-MM-DD"
 * @property {boolean} notified
 */
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
      return [null, await db.query(query, values)[0]]; // No error, returning the result
    } catch (e) {
      console.error(e);
      return [e.message, null]; // Returning the error message in case of failure
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
      return [null, await db.query(query, values)[0]];
    } catch (e) {
      console.error(e);
      return [e.message, null];
    }
  },

  /**
   * Update user information with conditions
   * @param {Partial<User>} data
   * @param {Condition<User>} by
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

      return [null, await db.query(query, values)[0]];
    } catch (e) {
      console.error(e);
      return [e.message, null];
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
      return [null, await db.query(query, [id])[0]];
    } catch (e) {
      console.error(e);
      return [e.message, null];
    }
  },

  /**
   * Read users from the database with optional filtering conditions
   * @param {Condition<User>} by - Conditions for filtering users (e.g., { name: { value: 'John', operateur: '=' } })
   * @returns {Promise<[(import("mysql2").QueryError | string | null ),(Array<User> | null)]>}
   */
  async read(by) {
    try {
      const query = `SELECT * FROM ${TablesNames.users} WHERE ${parse_condition(by)}`;

      const [rows] = await db.query(query);
      return [null, rows];
    } catch (e) {
      console.error(e);
      return [e.message, null];
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
      const query = `SELECT * FROM ${TablesNames.users} WHERE ${conditions.join(" AND ")}`;

      const [rows] = await db.query(query, values);
      return [null, rows]; // Return users matching the criteria
    } catch (e) {
      console.error(e);
      return [e.message, null]; // Return any error
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

      return [null, await db.query(query, values)[0]]; // No error, returning the result
    } catch (e) {
      console.error(e);
      return [e.message, null]; // Returning the error message in case of failure
    }
  },
  /**
   * @param {Condition<Departement>} by
   * @returns {Promise<[(import("mysql2").QueryError|string|null),(insertResult|null)]>}
   */
  async read(by) {
    try {
      if (Object.keys(by).length == 0) return ["all feald required", null];
      const query = `SELECT * FROM ${TablesNames.departement} WHERE ${parse_condition(by)}`;

      const [rows] = await db.query(query);
      return [null, rows];
    } catch (e) {
      console.error(e);
      return [e.message, null];
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

      return [null, await db.query(query, values)[0]];
    } catch (e) {
      return [e.message, null];
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

      return [null, await db.query(query, [id])[0]];
    } catch (e) {
      console.error(e);
      return [e.message, null];
    }
  },
  /**
   * @param {number} id
   * @returns {Promise<[(import("mysql2").QueryError | null | string),(Array<Group> | null)]>}
   */
  async getGroups(id) {
    try {
      if (!id) return ["id requierd", null];
      const query = `SELECT * FROM ${TablesNames.group} WHERE id = ? `;

      return [null, await db.query(query, [id])[0]];
    } catch (e) {
      return [e.message, null];
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
      INSERT INTO ${TablesNames.group} (${group_columns.join(", ")})
      VALUES (${group_columns.map(() => "?").join(", ")})
    `;
      const values = Object.values(group);

      return [null, await db.query(query, values)[0]];
    } catch (e) {
      console.error(e);
      return [e.message, null];
    }
  },

  /**
   * Retrieve groups based on conditions
   * @param {Condition<Group>} by
   * @returns {Promise<[(import("mysql2").QueryError|string|null),(Array<Group>|null)]>}
   */
  async read(by) {
    try {
      if (!by || Object.keys(by).length === 0) return ["Conditions are required", null];
      const query = `SELECT * FROM ${TablesNames.group} WHERE ${parse_condition(by)}`;

      const [rows] = await db.query(query);
      return [null, rows];
    } catch (e) {
      console.error(e);
      return [e.message, null];
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
      if (!id || Object.keys(updates).length === 0) return ["ID and update fields are required", null];
      const fields = [];
      const values = [];
      for (const [key, value] of Object.entries(updates)) {
        fields.push(`${key} = ?`);
        values.push(value);
      }
      values.push(id);

      const query = `
      UPDATE ${TablesNames.group}
      SET ${fields.join(", ")}
      WHERE id = ?
    `;

      return [null, await db.query(query, values)[0]];
    } catch (e) {
      console.error(e);
      return [e.message, null];
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
      DELETE FROM ${TablesNames.group}
      WHERE id = ?
    `;

      return [null, await db.query(query, [id])[0]];
    } catch (e) {
      console.error(e);
      return [e.message, null];
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

      return [null, await db.query(query, values)[0]];
    } catch (e) {
      console.error(e);
      return [e.message, null];
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

      return [null, await db.query(query, values)[0]];
    } catch (e) {
      console.error(e);
      return [e.message, null];
    }
  },

  /**
   * Read couriers from the database with optional filtering conditions
   * @param {Condition<Courier>} by - Conditions for filtering couriers
   * @returns {Promise<[(import("mysql2").QueryError | string | null ),(Array<Courier> | null)]>}
   */
  async read(by = {}) {
    try {
      const query = `SELECT * FROM ${TablesNames.courier} WHERE ${parse_condition(by)}`;

      const [rows] = await db.query(query);
      return [null, rows];
    } catch (e) {
      console.error(e);
      return [e.message, null];
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

      return [null, await db.query(query, [id])[0]];
    } catch (e) {
      console.error(e);
      return [e.message, null];
    }
  },
};

// ? sholde run as cron job each day & one time at app start up

module.exports.Notifications = {
  /**
   * @type {Record<string, Notification[]>}
   */
  NotificationsQueue: {},
  tomorrow: new Date(Date.now() + 86400000).toISOString().split("T")[0],
  today: new Date().toISOString().split("T")[0],
  /**
   *
   * @param {Notification} notification
   * @returns
   */
  async AddNotif(notification) {
    // Insert the notification into the database

    const [res] = await db.query("INSERT INTO notifications (description, dep_id, grp_id, date, notified) VALUES (?, ?, ?, ?, ?)", [
      notification.description,
      notification.dep_id,
      notification.grp_id,
      notification.date,
      false, // Default notified to false
    ]);
    notification.id = res.insertId;
    if (notification.date == this.tomorrow) this.NotificationsQueue[this.tomorrow] = [notification];
  },

  async Notify() {
    const notifications = this.NotificationsQueue[this.today] || [];

    for (const notif of notifications) {
      try {
        // Send email or notification logic here
        console.log(`Sending notification for: ${notif.description}`);

        await db.query("DELETE FROM notifications WHERE id = ?", [notif.id]);
      } catch (err) {
        console.error(`Failed to notify for: ${notif.description}`, err);
      }
    }

    // Remove today's notifications from memory if all are processed
    delete this.NotificationsQueue[this.today];
  },

  async Sync() {
    // Clear current memory store
    this.NotificationsQueue = {};

    const db = await mysql.createConnection({
      /* Your DB Config */
    });
    // Fetch all non-notified notifications from the database
    const [notifications] = await db.query("SELECT * FROM notifications WHERE notified = false");

    // Add notifications to memory only if they are for the next day
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDate = tomorrow.toISOString().split("T")[0];

    for (const notif of notifications) {
      if (notif.date === tomorrowDate) {
        if (!this.NotificationsQueue[tomorrowDate]) {
          this.NotificationsQueue[tomorrowDate] = [];
        }
        this.NotificationsQueue[tomorrowDate].push(notif);
      }
    }
  },
};
