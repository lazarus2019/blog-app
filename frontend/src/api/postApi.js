import axiosClient from "./axiosClient";

const postApi = {
  create: (params) => {
    const url = "posts/";
    return axiosClient.post(url, params);
  },
  fetchOne: (id) => {
    const url = `posts/${id}`;
    return axiosClient.get(url);
  },
  fetchAll: (category) => {
    const url = `posts?category=${category}`;
    return axiosClient.get(url);
  },
  toggleLike: (id) => {
    const url = "posts/likes";
    return axiosClient.put(url, id);
  },
  toggleDisLike: (id) => {
    const url = "posts/dislikes";
    return axiosClient.put(url, id);
  },
  update: (id, params) => {
    const url = `posts/${id}`;
    return axiosClient.put(url, params);
  },
  delete: (id) => {
    const url = `posts/${id}`;
    return axiosClient.delete(url);
  },
};

export default postApi;
