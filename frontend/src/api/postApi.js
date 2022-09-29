import axiosClient from "./axiosClient";

const postApi = {
  create: (data) => {
    const url = "posts/";
    return axiosClient.post(url, data);
  },
};

export default postApi;
