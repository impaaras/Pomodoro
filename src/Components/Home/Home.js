import React from "react";
import { Button } from "reactstrap";
import { auth } from "../../Firebase";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import Searchbar from "./Searchbar";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();
  const logout = () => {
    auth.signOut();
    navigate("/login");
  };

  return (
    <div className="dashboard">
      <Header />
      <Searchbar />
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default Home;
