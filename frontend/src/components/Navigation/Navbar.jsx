import React from "react";
import PropTypes from "prop-types";
import PublicNavbar from "./Public/PublicNavbar";
import PrivateNavbar from "./Private/PrivateNavbar";
import AdminNavbar from "./Admin/AdminNavbar";
import { useSelector } from "react-redux";
import AccountVerifyAlertWarning from "./Alert/AccountVerifyAlertWarning";
import AccountVerifyAlertSuccess from "./Alert/AccountVerifyAlertSuccess";

function Navbar(props) {
  // Get user from store
  const userStore = useSelector((store) => store?.user);
  const { userAuth, profile } = userStore;
  const isAdmin = userAuth?.isAdmin;

  //account verification
  const verifyStore = useSelector((state) => state?.verify);
  const { loading, appErr, serverErr, verifyToken } = verifyStore;

  return (
    <>
      {!userAuth ? (
        <PublicNavbar />
      ) : isAdmin ? (
        <AdminNavbar userAuth={userAuth} />
      ) : (
        <PrivateNavbar userAuth={userAuth} />
      )}
      {/* Display alerts */}
      {profile
        ? !profile?.isAccountVerified && <AccountVerifyAlertWarning />
        : null}
      {/* Display success msg */}
      {loading && <h2 className="text-center">Loading please wait...</h2>}
      {verifyToken && <AccountVerifyAlertSuccess />}
      {appErr || serverErr ? (
        <h2 className="text-center text-red-500">
          {serverErr} {appErr}
        </h2>
      ) : null}
    </>
  );
}

Navbar.propTypes = {};

export default Navbar;
