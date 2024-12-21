import axios from "axios";
const BASE_URL = "http://localhost:4000";
const LoginApi = async (email, password) => {
  if (!email || !password) return ["email or password is empty", null];
  axios
    .post(`${BASE_URL}/login`, { email, password })
    .then((res) => {
      return [null, res.data];
    })
    .catch((err) => {
      return [err, null];
    });
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
