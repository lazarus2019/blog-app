import axiosClient from "./axiosClient";

const verifyApi = {
  generateVerifyAccount: () => {
    const url = "users/generate-verify-email-token";
    return axiosClient.post(url);
  },
  verifyAccount: (params) => {
    const url = "users/verify-account";
    return axiosClient.put(url, params);
  },
  generateForgetPassword: (params) => {
    const url = "users/forget-password-token";
    return axiosClient.post(url, params);
  },
  verifyForgetPassword: (params) => {
    const url = "users/reset-password";
    return axiosClient.put(url, params);
  },
};

export default verifyApi;
