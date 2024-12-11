const { db } = require("../database");

/**
 *@typedef {object} Schema
 * @property {string} value - Description of the column property.
 * @property {string} operateur - Description of the column property.
 * @typedef {Record<string, Schema>} All
 * @typedef {object} Condition
 * @property {(Condition|fullcondition)[]} and - Logical `AND` conditions
 * @property {(Condition|fullcondition)[]} or - Logical `OR` conditions
 * @typedef {(All & Condition)} fullcondition
 */
/**
 * @typedef {object} User
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

const TablesNames = { users: "users" };

module.exports.Users = {
  /**
   * Insert a new user into the database
   * @param {Object} param0
   * @param {string} param0.email
   * @param {string} param0.password
   * @param {string} param0.name
   * @param {string} param0.role
   * @param {number} param0.departement_id
   * @param {number} param0.group_id
   * @param {string} param0.created_at
   * @param {string} param0.updated_at
   * @returns {Promise<[(import("mysql2").QueryError | string | null ),(insertResult | null )]>}
   */
  async insert({ name, email, password, role, departement_id, group_id, created_at, updated_at }) {
    if (!name || !email || !password || !role || !departement_id) {
      return ["Fields are required", null];
    }

    const query = `
      INSERT INTO ${TablesNames.users} (name, email, password, role, departement_id, group_id, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [name, email, password, role, departement_id, group_id, created_at, updated_at];

    try {
      return [null, await db.query(query, values)[0]]; // No error, returning the result
    } catch (e) {
      console.error(e);
      return [e.message, null]; // Returning the error message in case of failure
    }
  },

  /**
   * Update user information in the database by ID
   * @param {Object} param0
   * @param {number} param0.id
   * @param {string} [param0.email]
   * @param {string} [param0.password]
   * @param {string} [param0.name]
   * @param {string} [param0.role]
   * @param {number} [param0.departement_id]
   * @param {number} [param0.group_id]
   * @param {string} [param0.updated_at]
   * @returns {Promise<[(import("mysql2").QueryError | string | null ),(updateResult | null )]>}
   */
  async updateByID({ id, email, password, name, role, departement_id, group_id, updated_at }) {
    if (!id) return ["User ID is required", null];

    let setFields = [];
    let values = [];

    if (email) {
      setFields.push("email = ?");
      values.push(email);
    }
    if (password) {
      setFields.push("password = ?");
      values.push(password);
    }
    if (name) {
      setFields.push("name = ?");
      values.push(name);
    }
    if (role) {
      setFields.push("role = ?");
      values.push(role);
    }
    if (departement_id) {
      setFields.push("departement_id = ?");
      values.push(departement_id);
    }
    if (group_id) {
      setFields.push("group_id = ?");
      values.push(group_id);
    }
    if (updated_at) {
      setFields.push("updated_at = ?");
      values.push(updated_at);
    }

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
   * @param {Object} param0
   * @param {string} [param0.email]
   * @param {string} [param0.password]
   * @param {string} [param0.name]
   * @param {string} [param0.role]
   * @param {number} [param0.departement_id]
   * @param {number} [param0.group_id]
   * @param {string} [param0.updated_at]
   * @param {Condition} [param0.by]
   * @returns {Promise<[(import("mysql2").QueryError | string | null ),(updateResult | null )]>}
   */
  async update({ email, password, name, role, departement_id, group_id, updated_at, by }) {
    let setFields = [];
    let values = [];

    if (email) {
      setFields.push("email = ?");
      values.push(email);
    }
    if (password) {
      setFields.push("password = ?");
      values.push(password);
    }
    if (name) {
      setFields.push("name = ?");
      values.push(name);
    }
    if (role) {
      setFields.push("role = ?");
      values.push(role);
    }
    if (departement_id) {
      setFields.push("departement_id = ?");
      values.push(departement_id);
    }
    if (group_id) {
      setFields.push("group_id = ?");
      values.push(group_id);
    }
    if (updated_at) {
      setFields.push("updated_at = ?");
      values.push(updated_at);
    }

    if (setFields.length === 0) {
      return ["No fields to update", null];
    }

    const query = `
      UPDATE ${TablesNames.users}  
      SET ${setFields.join(", ")} 
      ${parse_condition(by || {})}
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
   * @param {Condition} [param0.by] - Conditions for filtering users (e.g., { name: { value: 'John', operateur: '=' } })
   * @returns {Promise<[(import("mysql2").QueryError | string | null ),(Array<User> | null)]>}
   */
  async read({ by } = {}) {
    let query = `SELECT * FROM ${TablesNames.users}`;
    const values = [];

    if (by) {
      query += ` WHERE ${parse_condition(by)}`;
    }

    try {
      const [rows] = await db.query(query, values);
      return [null, rows];
    } catch (e) {
      console.error(e);
      return [e.message, null];
    }
  },
  // !  hadiiiii  ba9am9lbhach bader 🧐🧐🧐
  /**
   * Search for users based on search criteria
   * @param {Object} searchCriteria - The search criteria to match users
   * @returns {Promise<[(import("mysql2").QueryError | string | null ),Array<Object>]>}
   */

  async searchForUser(searchCriteria) {
    if (!searchCriteria || Object.keys(searchCriteria).length === 0) {
      return ["No search criteria provided", null];
    }

    // Start building the SELECT query
    let query = `SELECT * FROM ${TablesNames.users} WHERE `;
    const values = [];

    // Build the conditions based on the provided search criteria
    const conditions = Object.entries(searchCriteria).map(([key, value]) => {
      values.push(value);
      return `${key} = ?`;
    });

    // Join the conditions with 'AND'
    query += conditions.join(" AND ");

    try {
      const [rows] = await db.query(query, values);
      return [null, rows]; // Return users matching the criteria
    } catch (e) {
      console.error(e);
      return [e.message, null]; // Return any error
    }
  },
};

// ! b3d mn hna khdamin 3tihom ti9ar a iliass☠️☠️
/**
 * Helper function to parse conditions into SQL format
 * @param {Condition} condition
 * @returns {string} SQL string
 */
function parse_condition(condition) {
  const sql = [];
  for (const [key, val] of Object.entries(condition)) {
    if (key === "and" || key === "or") {
      sql.push(`(${val.map(parse_condition).join(" " + key + " ")})`);
    } else {
      sql.push(`${key} ${val.operateur} ${escapeChar(val.value + "")}`);
    }
  }
  return sql.join(" and ");
}
/**
 * Helper function to escape special characters in SQL queries
 * @param {string} string
 * @returns {string} Escaped string
 */
function escapeChar(string) {
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
    let res='';
    for(let i=0;i<string.length;i++){
      res+=badChars[string[i]]|| string[i]
    }
    return res
}