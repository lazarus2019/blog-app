import axiosClient from "./axiosClient";

const categoryApi = {
  create: (params) => {
    const url = "category";
    return axiosClient.post(url, params);
  },
  fetchOne: (id) => {
    const url = `category/${id}`;
    return axiosClient.get(url);
  },
  fetchAll: () => {
    const url = "category";
    return axiosClient.get(url);
  },
  update: (id, params) => {
    const url = `category/${id}`;
    return axiosClient.put(url, params);
  },
  delete: (id) => {
    const url = `category/${id}`;
    return axiosClient.delete(url);
  },
};

export default categoryApi;
