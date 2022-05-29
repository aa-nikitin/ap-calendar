import axios from 'axios';

// const serverSite = 'https://calendar-kamorka.ru';
const serverSite = '';

export const fetchGet = async (url, token) => {
  try {
    const { data } = await axios.get(`${serverSite}${url}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return data;
  } catch (e) {
    throw e.response.data;
  }
};

export const fetchPut = async (url, obj, token) => {
  try {
    const { data } = await axios.put(
      `${serverSite}${url}`,
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

export const fetchPost = async (url, obj, token) => {
  try {
    const { data } = await axios.post(
      `${serverSite}${url}`,
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

export const fetchDelete = async (url, params, token) => {
  try {
    const { data } = await axios.delete(`${serverSite}${url}`, {
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

export const fetchPostMultipart = async (url, obj, token) => {
  try {
    const { data } = await axios.post(`${serverSite}${url}`, obj, {
      headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` }
    });
    return data;
  } catch (e) {
    throw e.response.data;
  }
};
