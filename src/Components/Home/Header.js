import React from "react";
import "./Header.css";
import { auth } from "../../Firebase";
import { Navigate } from "react-router-dom";
import { Button } from "antd";
const Header = () => {
  const logout = () => {
    auth.signOut();
    Navigate("/login");
  };
  return (
    <div className="header">
      <div>
        <a href="/">EmProductify</a>
      </div>
      <div
        style={{ display: "flex", flexDirection: "row", alignItems: "center" }}
      >
        <p style={{ margin: "0px" }}>
          {auth.currentUser.displayName ? auth.currentUser.displayName : `User`}
        </p>
        <Button
          style={{
            fontSize: "18px",
            color: "#FFF",
            background: "none",
            border: "none",
            marginBottom: "5px",
          }}
          onClick={logout}
        >
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Header;
