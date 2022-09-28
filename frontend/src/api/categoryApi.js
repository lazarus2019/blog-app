import axiosClient from "./axiosClient";

const categoryApi = {
  create: (data) => {
    const url = "category";
    return axiosClient.post(url, data);
  },
  update: (data) => {
    const url = "users/login";
    return axiosClient.put(url, data);
  },
};

export default categoryApi;
