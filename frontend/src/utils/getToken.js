import storageKeys from "@/constants";

const getToken = () => {
  return localStorage.getItem(storageKeys.USER)
    ? JSON.parse(localStorage.getItem(storageKeys.USER))?.token
    : null;
};

export default getToken;
