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
export const UpdateCourier = async (id, token, title, description, state, critical) => {
  if (!id || !token || !title || !description || !state) {
    return ["All parameters (id, token, title, description, state) are required", null];
  }

  const result = [null, null];
  try {
    const response = await axios.post(
      `${BASE_URL}/courier/${id}`,
      { title, description, state, critical },
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
