import axiosClient from "./axiosClient";

const commentApi = {
  create: (params) => {
    const url = "comments";
    return axiosClient.post(url, params);
  },
  delete: (id) => {
    const url = `comments/${id}`;
    return axiosClient.delete(url);
  },
  update: (id, params) => {
    const url = `comments/${id}`;
    return axiosClient.put(url, params);
  },
  fetchOne: (id) => {
    const url = `comments/${id}`;
    return axiosClient.get(url);
  },
};

export default commentApi;
