/* eslint-disable dot-notation */
/* eslint-disable consistent-return */

import axios from 'axios';

// import Cookies from 'js-cookie';

const baseUrl = process.env.REACT_APP_BACKEND_URL;

export const postApi = async (path, data) => {
  // const lang = Cookies.get('lang');
  try {
    const response = await axios.post(baseUrl + path, data);

    if (response.data.token && response.data.token !== null) {
      localStorage.setItem('token', response?.data?.token);
    }

    if (response && response.status === 200) {
      // toast.success(response.data.message);
    }

    return response;
  } catch (error) {
    if (error.response) {
      console.log('error ', error);
      return error.response; // Return the error response
    }
  }
};

