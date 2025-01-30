import axios from "axios";
export const BASE_URL = "http://localhost:4000";
export const LoginApi = async (email, password) => {
  if (!email || !password) return ["email or password is empty", null];

  try {
    const response = await axios.post(`${BASE_URL}/login`, { email, password });
    return [null, response.data];
  } catch (error) {
    return [error, null];
  }
};
export const tokenAuthApi = async (Token = "") => {
  if (!Token) return ["token is empty", null];
  try {
    const response = await axios.post(
      `${BASE_URL}/login/token`,
      {},
      { headers: { Authorization: Token } }
    );
    return [null, response.data];
  } catch (error) {
    return [error, null];
  }
};
export const GetEvents = async (Token = "") => {
  if (!Token) return ["token is empty", null];
  const result = [null, null];

  await axios
    .get(
      `${BASE_URL}/courier/bettwen?startDate=${
        new Date().toISOString().split("T")[0]
      }`,
      {
        headers: {
          Authorization: Token,
        },
      }
    )
    .then((res) => {
      result[1] = res;
      console.log(res);
    })
    .catch((err) => {
      result[0] = err;
    });
  return result;
};
export const getDepartements = async (token) => {
  if (!token) return ["token is empty", null];
  const result = [null, null];
  await axios
    .get(`${BASE_URL}/departement/all`, { headers: { Authorization: token } })
    .then((res) => {
      result[1] = res.data;
    })
    .catch((err) => {
      result[0] = err;
    });
  return result;
};
export const getGroups = async (token) => {
  if (!token) return ["token is empty", null];
  const result = [null, null];
  await axios
    .get(`${BASE_URL}/groups/all`, { headers: { Authorization: token } })
    .then((res) => {
      result[1] = res.data;
    })
    .catch((err) => {
      result[0] = err;
    });
  return result;
};
export const AddCourier = async (formData, departements, groups) => {
  if (!formData) {
    return [
      "All parameters (token, title, description, deadline, critical, departements) are required",
      null,
    ];
  }
  const result = [null, null];
  try {
    formData.append(
      "assigneed_to",
      JSON.stringify({
        departements,
        groups,
      })
    );
    const response = await axios.post(`${BASE_URL}/courier/add`, formData, {
      headers: {
        Authorization: formData.get("token"),
        "Content-Type": "multipart/form-data",
      },
    });
    result[1] = response;
  } catch (err) {
    result[0] = err;
  }
  return result;
};

export const UpdateCourier = async (formData, departements, groups) => {
  console.log(formData, departements, groups);
  if (!formData.get("token")) {
    return ["token error", null];
  }

  const result = [null, null];
  try {
    formData.append(
      "assigneed_to",
      JSON.stringify({
        departements,
        groups,
      })
    );
    const response = await axios.post(
      `${BASE_URL}/courier/update/${formData.get("id")}`,
      formData,
      {
        headers: {
          Authorization: formData.get("token"),
          "Content-Type": "multipart/form-data",
        },
      }
    );
    result[1] = response;
  } catch (err) {
    result[0] = err;
  }

  return result;
};
export const AddDepartment = async (formData) => {
  if (!formData) {
    return [
      "All parameters (token, name, parent_departement_id) are required",
      null,
    ];
  }
  const result = [null, null];
  try {
    const response = await axios.post(`${BASE_URL}/departement/add`, formData, {
      headers: {
        Authorization: formData.token,
      },
    });
    result[1] = response;
  } catch (err) {
    result[0] = err;
  }
  return result;
};
export const DeleteDepartment = async (token, department_id) => {
  if (!token || !department_id) {
    return ["All parameters (token, department_id) are required", null];
  }

  const result = [null, null];
  try {
    const response = await axios.delete(
      `${BASE_URL}/departement/${department_id}`,
      {
        headers: {
          Authorization: token,
        },
      }
    );
    result[1] = response;
  } catch (err) {
    result[0] = err;
  }
  return result;
};
export const UpdateDepartementApi = async (
  token,
  department_id,
  updatedName
) => {
  if (!token || !department_id || !updatedName) {
    return [
      "All parameters (token, department_id, updatedName) are required",
      null,
    ];
  }

  const result = [null, null];
  try {
    const response = await axios.post(
      `${BASE_URL}/departement/update/${department_id}`,
      { updateBy: { name: updatedName } }, // Body de la requête
      {
        headers: {
          Authorization: token,
        },
      }
    );
    result[1] = response.data;
  } catch (err) {
    result[0] = err.response ? err.response.data : err.message;
  }

  return result;
};
export const AddGroupApi = async (formData) => {
  if (
    !formData ||
    !formData.token ||
    !formData.name ||
    !formData.department_id
  ) {
    return ["All parameters (token, name, departement_id) are required", null];
  }

  const result = [null, null];
  try {
    const response = await axios.post(
      `${BASE_URL}/groups/add`,
      { name: formData.name, departement_id: Number(formData.department_id) },
      {
        headers: {
          Authorization: formData.token,
        },
      }
    );
    result[1] = response.data;
  } catch (err) {
    result[0] = err.response?.data || err.message;
  }
  return result;
};
export const deleteGroupApi = async (id, token) => {
  if (!id) {
    return ["Group ID is required", null];
  }
  const result = [null, null];
  try {
    console.log("id", id);
    const response = await axios.delete(`${BASE_URL}/groups/${id}`, {
      headers: {
        Authorization: token,
      },
    });
    result[1] = response.data; // Stocker le succès
  } catch (err) {
    result[0] = err.response?.data || err.message; // Stocker l'erreur
  }
  return result;
};
export const UpdateGrouptApi = async (token, id, updatedName) => {
  if (!token || !id || !updatedName) {
    return [
      "All parameters (token, department_id, updatedName) are required",
      null,
    ];
  }
  const result = [null, null];
  try {
    const response = await axios.post(
      `${BASE_URL}/groups/update/${id}`,
      { updateBy: { name: updatedName } }, // Body de la requête
      {
        headers: {
          Authorization: token,
        },
      }
    );
    result[1] = response.data;
  } catch (err) {
    result[0] = err.response ? err.response.data : err.message;
  }

  return result;
};
