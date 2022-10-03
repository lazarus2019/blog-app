import authToken from "@/utils/authToken";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

function PrivateRoute() {
  const navigate = useNavigate();
  useEffect(() => {
    const checkAuth = async () => {
      const isAuth = await authToken.isAuthenticated();

      if (isAuth) {
        return;
      } else {
        navigate("/login");
      }
    };
    checkAuth();
  }, [navigate]);

  return (
    <>
      <Outlet />
    </>
  );
}

export default PrivateRoute;
