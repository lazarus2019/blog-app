import axiosClient from "./axiosClient";

const postApi = {
  create: (data) => {
    const url = "posts/";
    return axiosClient.post(url, data);
  },
  fetchAll: (category) => {
    const url = `posts?category=${category}`;
    return axiosClient.get(url);
  },
};

export default postApi;
