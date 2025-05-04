import axios from 'axios';
import { constant } from '../constant';

export const postApi = async (path, data) => {
  console.log('path ===>', path, data);
  try {
    let result = await axios.post(constant.baseUrl + path, data, {
      headers: {
        token: localStorage.getItem('token') || sessionStorage.getItem('token')
      }
    });
    if (result) {
      return result;
    } else {
      return false;
    }
  } catch (e) {
    console.error(e);
    return e;
  }
};
export const patchApi = async (path, data) => {
  const tokens = localStorage.getItem('token') || sessionStorage.getItem('token');
  try {
    let result = await axios.patch(constant.baseUrl + path, data, {
      data: data?.roomNo,
      headers: {
        token: tokens
      }
    });
    return result;
  } catch (e) {
    console.error(e);
    return e;
  }
};

export const deleteApi = async (path, id) => {
  const tokens = localStorage.getItem('token') || sessionStorage.getItem('token');
  try {
    let result = await axios.patch(
      constant.baseUrl + path + id,
      {}, // Empty object as data
      {
        headers: {
          token: tokens
        }
      }
    );
    console.log('result', result);
    return result;
  } catch (e) {
    console.error(e);
    return e;
  }
};

export const deleteManyApi = async (path, data) => {
  try {
    let result = await axios.post(constant.baseUrl + path, data, {
      headers: {
        token: localStorage.getItem('token') || sessionStorage.getItem('token')
      }
    });
    if (result.data?.token && result.data?.token !== null) {
      localStorage.setItem('token', result.data?.token);
    }
    return result;
  } catch (e) {
    console.error(e);
    return e;
  }
};

export const getApi = async (path, id) => {
  try {
    if (id) {
      let result = await axios.get(constant.baseUrl + path + id, {
        headers: {
          token: localStorage.getItem('token') || sessionStorage.getItem('token')
        }
      });
      return result;
    } else {
      let result = await axios.get(constant.baseUrl + path, {
        headers: {
          token: localStorage.getItem('token') || sessionStorage.getItem('token')
        }
      });
      return result;
    }
  } catch (e) {
    console.error(e);
    return e;
  }
};
