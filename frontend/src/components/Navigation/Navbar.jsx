import React from "react";
import PropTypes from "prop-types";
import PublicNavbar from "./Public/PublicNavbar";
import PrivateNavbar from "./Private/PrivateNavbar";
import AdminNavbar from "./Admin/AdminNavbar";
import { useSelector } from "react-redux";

function Navbar(props) {
  // Get user from store
  const userStore = useSelector((store) => store?.users);
  const { userAuth } = userStore;
  const isAdmin = userAuth?.isAdmin;

  return (
    <>
      {!userAuth ? (
        <PublicNavbar />
      ) : isAdmin ? (
        <AdminNavbar />
      ) : (
        <PrivateNavbar />
      )}
    </>
  );
}

Navbar.propTypes = {};

export default Navbar;