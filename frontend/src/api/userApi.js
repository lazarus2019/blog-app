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
  profile: (id) => {
    const url = `users/profile/${id}`;
    return axiosClient.get(url);
  },
  update: (params) => {
    const url = "users/";
    return axiosClient.put(url, params);
  },
  follow: (params) => {
    const url = "users/follow";
    return axiosClient.put(url, params);
  },
  unFollow: (params) => {
    const url = "users/unFollow";
    return axiosClient.put(url, params);
  },
  uploadProfilePhoto: (params) => {
    const url = "users/profilephoto-upload";
    return axiosClient.put(url, params);
  },
  getList: () => {
    const url = "users";
    return axiosClient.get(url);
  },
  block: (id) => {
    const url = `users/block-user/${id}`;
    return axiosClient.put(url);
  },
  unBlock: (id) => {
    const url = `users/unblock-user/${id}`;
    return axiosClient.put(url);
  },
  verifyToken: () => {
    const url = "users/verify-token";
    return axiosClient.get(url);
  },
  verifyPermission: (id) => {
    const url = `users/verify-permission/${id}`;
    return axiosClient.get(url);
  },
};

export default userApi;
