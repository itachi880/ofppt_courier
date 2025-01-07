import axios from "axios";
const BASE_URL = "http://localhost:4000";
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
    const response = await axios.post(`${BASE_URL}/login/token`, {}, { headers: { Authorization: Token } });
    return [null, response.data];
  } catch (error) {
    return [error, null];
  }
};
export const GetEvents = async (Token = "") => {
  if (!Token) return ["token is empty", null];
  const result = [null, null];
  await axios
    .get(`${BASE_URL}/courier/all`, {
      headers: {
        Authorization: Token,
      },
    })
    .then((res) => {
      result[1] = res;
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
    .get(`${BASE_URL}/departement/all`,{ headers: { Authorization: token } })
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
export const AddCourier = async (formData, departements) => {
  if (!formData) {
    return ["All parameters (token, title, description, deadline, critical, departements) are required", null];
  }
  const result = [null, null];
  try {
    const dep_grps = [];
    for (let i = 0; i < departements.length; i++) {
      dep_grps.push({ department_id: departements[i].id });
      for (let j = 0; j < departements[i].groups.length; j++) {
        dep_grps.push({ group_id: departements[i].groups[j].id });
      }
    }

    formData.append("assigneed_to", JSON.stringify(dep_grps));
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

export const UpdateCourier = async (id, token, title, description, state, deadline, critical, departement) => {
  if (!id || !token || !title || !description || !deadline || !state) {
    return ["All parameters (id, token, title, description, state) are required", null];
  }

  const result = [null, null];
  try {
    const response = await axios.post(
      `${BASE_URL}/courier/${id}`,
      { title, description, state, deadline, critical, departement },
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
export const AddDepartment = async (formData) => {
  if (!formData) {
    return ["All parameters (token, name, parent_departement_id) are required", null];
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
}
export const DeleteDepartment = async (token,department_id) => {
  if (!token || !department_id) {
    return ["All parameters (token, department_id) are required", null];
  }
  
  const result = [null, null];
  try {
    const response = await axios.delete(`${BASE_URL}/departement/${department_id}`, {
      headers: {
        Authorization: token,
      },
    });
    result[1] = response;
  } catch (err) {
    result[0] = err;
  }
  return result;
};
export const UpdateDepartementApi = async (token, department_id, updatedName) => {
  if (!token || !department_id || !updatedName) {
    return ["All parameters (token, department_id, updatedName) are required", null];
  }

  const result = [null, null];
  try {
    const response = await axios.post(
      `${BASE_URL}/departement/update/${department_id}`, 
      { updateBy:{name: updatedName} }, // Body de la requête
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

  if (!formData) {
    return ["All parameters (token, name) are required", null];
  }

  const result = [null, null];
  try {
    // Requête POST vers l'API pour ajouter un groupe
    const response = await axios.post(`${BASE_URL}/groups/add`, formData, {
      headers: {
        Authorization: formData.token,
      },
    });
    result[1] = response.data; // Stocker les données de la réponse
  } catch (err) {
    result[0] = err.response?.data || err.message; // Gestion des erreurs
  }
  return result;
};