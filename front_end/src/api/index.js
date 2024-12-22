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
