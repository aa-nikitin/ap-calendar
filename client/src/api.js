import axios from 'axios';

export const fetchLogin = async (login, pass) => {
  try {
    const { data } = await axios.post(`/api/login`, {
      login: login,
      password: pass
    });
    return data;
  } catch (e) {
    throw e.response.data;
  }
};

export const fetchLoginFromToken = async (token) => {
  try {
    const { data } = await axios.post(
      `/api/authFromToken`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    return data;
  } catch (e) {
    throw e.response.data;
  }
};
