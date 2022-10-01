import authToken from "@/utils/authToken";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";

function usePostPermission({ userId = {} }) {
  const [isPermission, setIsPermission] = useState(false);

  useEffect(() => {
    (async () => {
      const result = await authToken.isPermission(userId);
      setIsPermission(result?.isPermission);
    })();
  }, [userId]);

  return isPermission;
}

usePostPermission.propTypes = {
  userId: PropTypes.object.isRequired,
};

export default usePostPermission;
