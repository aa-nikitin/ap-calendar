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

export const fetchGetAll = async (url, token) => {
  try {
    const { data } = await axios.get(url, {
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

export const fetchChange = async (url, id, obj, token) => {
  try {
    const { data } = await axios.put(
      `${url}${id}`,
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
export const fetchChangeParams = async (url, obj, token) => {
  try {
    const { data } = await axios.put(
      `${url}`,
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

export const fetchAdd = async (url, obj, token) => {
  try {
    const { data } = await axios.post(
      url,
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

export const fetchUploadPhotosHall = async (url, obj, token) => {
  try {
    const { data } = await axios.post(url, obj, {
      headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` }
    });
    return data;
  } catch (e) {
    throw e.response.data;
  }
};

export const fetchDeleteByParams = async (url, params, token) => {
  try {
    const { data } = await axios.delete(url, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      data: { params }
    });
    return data;
  } catch (e) {
    throw e.response.data;
  }
};

export const fetchDeleteHalls = async (id, token) => {
  try {
    const { data } = await axios.delete(`/api/hall/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return data;
  } catch (e) {
    throw e.response.data;
  }
};
