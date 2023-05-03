import React from "react";
import "./Header.css";
import { auth } from "../../Firebase";
const Header = () => {
  return (
    <div className="header">
      <div>
        <a href="/">EmProductify</a>
      </div>
      <div>
        <p>
          {auth.currentUser.displayName ? auth.currentUser.displayName : `User`}
        </p>
      </div>
    </div>
  );
};

export default Header;
