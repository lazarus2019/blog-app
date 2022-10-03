import authToken from "@/utils/authToken";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

function AdminRoute() {
  const navigate = useNavigate();
  useEffect(() => {
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
