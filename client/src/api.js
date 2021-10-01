import axios from 'axios';

export const fetchGet = async (url, token) => {
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

export const fetchPut = async (url, obj, token) => {
  try {
    const { data } = await axios.put(
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

export const fetchPost = async (url, obj, token) => {
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

export const fetchDelete = async (url, params, token) => {
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

export const fetchPostMultipart = async (url, obj, token) => {
  try {
    const { data } = await axios.post(url, obj, {
      headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` }
    });
    return data;
  } catch (e) {
    throw e.response.data;
  }
};
