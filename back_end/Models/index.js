const { db } = require("../database");
//tables schema types

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

const TablesNames = { users: "users", departement: "departement" };

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
   * @param {Condition<User>} [param0.by]
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
   * @param {Condition<User>} by - Conditions for filtering users (e.g., { name: { value: 'John', operateur: '=' } })
   * @returns {Promise<[(import("mysql2").QueryError | string | null ),(Array<User> | null)]>}
   */
  async read(by = {}) {
    let query = `SELECT * FROM ${TablesNames.users} WHERE ${parse_condition(by)}`;
    try {
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
    let query = `SELECT * FROM ${TablesNames.users} WHERE ${conditions.join(" AND ")}`;

    try {
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
    if (Object.keys(departement).length == 0) return ["all feald required", null];
    const query = `
      INSERT INTO ${TablesNames.departement} (${Object.keys(departement).join(", ")})
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = Object.values(departement);

    try {
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
    if (Object.keys(by).length == 0) return ["all feald required", null];
    const query = `SELECT * FROM ${TablesNames.departement} WHERE ${parse_condition(by)}`;
    try {
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
    try {
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
    if (!id) return ["id requierd", null];
    const query = `
      DELETE FROM ${TablesNames.departement}
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
   * @param {number} id
   * @returns {Promise<[(import("mysql2").QueryError | null | string),(Array<Group> | null)]>}
   */
  async getGroups(id) {
    if (!id) return ["id requierd", null];
    const query = `SELECT * FROM ${TablesNames.groups} WHERE id = ? `;
    try {
      return [null, await db.query(query, [id])[0]];
    } catch (e) {
      return [e.message, null];
    }
  },
};

// ! li zdt db  

module.exports.Group = {
  /**
   * Insert a new group into the database
   * @param {Group} group
   * @returns {Promise<[(import("mysql2").QueryError|string|null),(insertResult|null)]>}
   */
  async insert(group) {
    if (Object.keys(group).length == 0) return ["All fields are required", null];
    const query = `
      INSERT INTO ${TablesNames.groups} (${Object.keys(group).join(", ")})
      VALUES (${Object.keys(group).map(() => "?").join(", ")})
    `;
    const values = Object.values(group);

    try {
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
    if (!by || Object.keys(by).length === 0) return ["Conditions are required", null];
    const query = `SELECT * FROM ${TablesNames.groups} WHERE ${parse_condition(by)}`;
    try {
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
    if (!id || Object.keys(updates).length === 0) return ["ID and update fields are required", null];
    const fields = [];
    const values = [];
    for (const [key, value] of Object.entries(updates)) {
      fields.push(`${key} = ?`);
      values.push(value);
    }
    values.push(id);

    const query = `
      UPDATE ${TablesNames.groups}
      SET ${fields.join(", ")}
      WHERE id = ?
    `;

    try {
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
    if (!id) return ["Group ID is required", null];
    const query = `
      DELETE FROM ${TablesNames.groups}
      WHERE id = ?
    `;

    try {
      return [null, await db.query(query, [id])[0]];
    } catch (e) {
      console.error(e);
      return [e.message, null];
    }
  },
};



/**
 * Helper function to parse conditions into SQL format
 * @param {Condition} condition
 * @returns {string} SQL string
 */
function parse_condition(condition) {
  if (!condition || Object.keys(condition).length == 0) return "1=1";
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
  let res = "";
  for (let i = 0; i < string.length; i++) {
    res += badChars[string[i]] || string[i];
  }
  return res;
}
module.exports.Couriers={
    /**
   * Insert a new courier into the database
   * @param {Object} param0
   * @param {string} param0.title
   * @param {string} param0.description
   * @param {string} param0.deadline
   * @param {boolean} param0.critical
   * @param {number} param0.create_by
   * @param {string} param0.created_at
   * @param {string} param0.updated_at
   * @returns {Promise<[(import("mysql2").QueryError | string | null ),(insertResult | null )]>}
   */

      async insert({ title, description, deadline, critical, create_by, created_at, updated_at }) {
        if (!title || !description || !deadline || create_by === undefined) {
          return ["Fields are required", null];
        }
        const query = `
          INSERT INTO ${TablesNames.courier} (title, description, deadline, critical, create_by, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [title, description, deadline, critical, create_by, created_at, updated_at];
    
        try {
          return [null, await db.query(query, values)[0]];
        } catch (e) {
          console.error(e);
          return [e.message, null];
        }
      },
    
      /**
       * Update courier information in the database by ID
       * @param {Object} param0
       * @param {number} param0.id
       * @param {string} [param0.title]
       * @param {string} [param0.description]
       * @param {string} [param0.deadline]
       * @param {boolean} [param0.critical]
       * @param {number} [param0.create_by]
       * @param {string} [param0.updated_at]
       * @returns {Promise<[(import("mysql2").QueryError | string | null ),(updateResult | null )]>}
       */
      async updateByID({ id, title, description, deadline, critical, create_by, updated_at }) {
        if (!id) return ["Courier ID is required", null];
    
        const setFields = [];
        const values = [];
    
        if (title) {
          setFields.push("title = ?");
          values.push(title);
        }
        if (description) {
          setFields.push("description = ?");
          values.push(description);
        }
        if (deadline) {
          setFields.push("deadline = ?");
          values.push(deadline);
        }
        if (critical !== undefined) {
          setFields.push("critical = ?");
          values.push(critical);
        }
        if (create_by !== undefined) {
          setFields.push("create_by = ?");
          values.push(create_by);
        }
        if (updated_at) {
          setFields.push("updated_at = ?");
          values.push(updated_at);
        }
    
        if (setFields.length === 0) {
          return ["No fields to update", null];
        }
    
        const query = `
          UPDATE ${TablesNames.courier}
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
       * Read couriers from the database with optional filtering conditions
       * @param {Condition<Courier>} by - Conditions for filtering couriers
       * @returns {Promise<[(import("mysql2").QueryError | string | null ),(Array<Courier> | null)]>}
       */
      async read(by = {}) {
        let query = `SELECT * FROM ${TablesNames.courier} WHERE ${parse_condition(by)}`;
        try {
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
        if (!id) return ["Courier ID is required", null];
    
        const query = `
          DELETE FROM ${TablesNames.courier}
          WHERE id = ?
        `;
        try {
          return [null, await db.query(query, [id])[0]];
        } catch (e) {
          console.error(e);
          return [e.message, null];
        }
      },
}