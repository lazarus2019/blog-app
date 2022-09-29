import authToken from "@/utils/authToken";
import { useLayoutEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

function PrivateRoute() {
  const navigate = useNavigate();
  useLayoutEffect(() => {
    const checkAuth = async () => {
      const isAuth = await authToken.isAuthenticated();

      if (isAuth) {
        return;
      } else {
        navigate("/login");
      }
    };
    checkAuth();
  }, []);

  return (
    <>
      <Outlet />
    </>
  );
}

export default PrivateRoute;
