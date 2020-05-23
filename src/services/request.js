import axios from "axios";
import { url } from "constants.js";

const client = axios.create({
  baseURL: url,
});

/**
 * Request Wrapper with default success/error actions
 */
const request = function (options) {
  const onSuccess = function (response) {
    // console.debug("Request Successful!", response);
    return response.data;
  };

  const onError = function (error) {
    // console.error('Request Failed:', error.config);

    // // log response data if it exists
    // if (error.response) {
    //   console.error('Status:',  error.response.status);
    //   console.error('Data:',    error.response.data);
    //   console.error('Headers:', error.response.headers);

    // } else {
    //   console.error('Error Message:', error.message);
    // }

    return Promise.reject(error.response || error.message);
  };

  // add the api_key to each request
  options.params = { ...options.params, api_key: "ce3902772ae4b70c973b6a9f54f844fd" };

  return client(options).then(onSuccess).catch(onError);
};

export default request;
