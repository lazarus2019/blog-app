import getToken from "@/utils/getToken";
import axios from "axios";
import queryString from "query-string";

const axiosClient = axios.create({
  baseURL: "http://localhost:5000/api/",
  paramsSerializer: (params) => queryString.stringify({ params }),
});

// Interceptors
axiosClient.interceptors.request.use(
  (config) => {
    return {
      ...config,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`,
      },
    };
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
  (response) => {
    if (response && response.data) return response.data;
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosClient;
