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

export const fetchGetClients = async (token) => {
  try {
    const { data } = await axios.get(`/api/clients`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return data;
  } catch (e) {
    throw e.response.data;
  }
};

export const fetchGetClient = async (id, token) => {
  try {
    const { data } = await axios.get(`/api/client/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return data;
  } catch (e) {
    throw e.response.data;
  }
};

export const fetchChangeClient = async (id, obj, token) => {
  try {
    const { data } = await axios.put(
      `/api/client/${id}`,
      { ...obj },
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

export const fetchAddClient = async (obj, token) => {
  try {
    const { data } = await axios.post(
      `/api/client/`,
      { ...obj },
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

export const fetchDeleteClients = async (list, token) => {
  try {
    const { data } = await axios.delete(`/api/clients`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      data: { list }
    });
    return data;
  } catch (e) {
    throw e.response.data;
  }
};
