import axiosClient from "./axiosClient";

const userApi = {
  register: (data) => {
    const url = "users/register";
    return axiosClient.post(url, data);
  },
  login: (data) => {
    const url = "users/login";
    return axiosClient.post(url, data);
  },
  verifyToken: () => {
    const url = "users/verify-token";
    return axiosClient.get(url);
  },
  verifyPermission: (id) => {
    const url = `users/verify-permission/${id}`;
    return axiosClient.get(url );
  },
};

export default userApi;
