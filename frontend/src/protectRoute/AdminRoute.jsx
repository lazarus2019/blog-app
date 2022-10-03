import authToken from "@/utils/authToken";
import { useLayoutEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

function AdminRoute() {
  const navigate = useNavigate();
  useLayoutEffect(() => {
    const checkAuth = async () => {
      const isAuth = await authToken.isAuthenticated();

      if (isAuth && isAuth.isAdmin) {
        return;
      } else {
        navigate("/");
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

export default AdminRoute;
