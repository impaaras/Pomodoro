import React from "react";
import { Button } from "reactstrap";
import { auth } from "../../Firebase";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import Searchbar from "./Searchbar";
import "./Home.css";
import Body from "./Body";
import { FiMessageSquare } from "react-icons/fi";
import { BiLogOutCircle } from "react-icons/bi";

const Home = () => {
  const navigate = useNavigate();
  const logout = () => {
    auth.signOut();
    navigate("/login");
  };

  return (
    <div className="dashboard">
      <div className="sidebar">
        <FiMessageSquare className="sidebar__icon" />
        <BiLogOutCircle onClick={logout} className="logoutButton" />
      </div>
      <div className="main__body">
        <div>
          <Header />
          <Searchbar />
          <Body />
        </div>
      </div>
      {/* <button onClick={logout}>Logout</button> */}
    </div>
  );
};

export default Home;
