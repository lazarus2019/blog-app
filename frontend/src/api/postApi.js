import axiosClient from "./axiosClient";

const postApi = {
  create: (data) => {
    const url = "posts/";
    return axiosClient.post(url, data);
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
};

export default postApi;
