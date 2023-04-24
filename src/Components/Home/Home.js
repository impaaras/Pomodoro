import React from "react";
import { Button } from "reactstrap";
import { auth } from "../../Firebase";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const logout = () => {
    auth.signOut();
    navigate("/login");
  };

  return (
    <div>
      <h2>Home</h2>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default Home;
