import userApi from "@/api/userApi";
import getToken from "./getToken";

const authToken = {
  isAuthenticated: async () => {
    const token = getToken();

    if (!token) return false;
    try {
      const res = await userApi.verifyToken();
      return res;
    } catch {
      return false;
    }
  },
  isPermission: async (id) => {
    const token = getToken();
    if (!token) return false;

    try {
      const res = await userApi.verifyPermission(id);
      return res;
    } catch {
      return false;
    }
  },
};

export default authToken;
