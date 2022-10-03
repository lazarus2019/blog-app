import axiosClient from "./axiosClient";

const mailApi = {
  sendMail: (params) => {
    const url = "email";
    return axiosClient.post(url, params);
  },
};

export default mailApi;
