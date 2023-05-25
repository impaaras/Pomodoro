import React, { useContext, useEffect, useState } from "react";
import "./App.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { auth } from "./Firebase";
import Login from "./Components/Login/Login";
import Home from "./Components/Home/Home";
import Register from "./Components/Register/Register";
import PageNotFound from "./Components/PageNotFound";
import Workspace from "./Components/Workspace/Workspace";
import Board from "./Components/Workspace/Board";
import BackgroundModal from "./Components/Home/BackgroundModal";
import Navbar from "./Components/Home/Navbar";

function App() {
  const [isAuthenticate, setIsAuthenticate] = useState(false);

  useEffect(() => {
    console.log("is", isAuthenticate);
    auth.onAuthStateChanged((user) => {
      if (user) {
        setIsAuthenticate(true);
      } else {
        setIsAuthenticate(false);
      }
    });
  });

  const [backgroundImage, setBackgroundImage] = useState(null);

  const changeBackground = (image) => {
    setBackgroundImage(image);
  };

  if (!isAuthenticate) {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="*"
            isAuthenticate={isAuthenticate}
            element={<PageNotFound />}
          />
        </Routes>
      </Router>
    );
  } else {
    return (
      <div>
        <Router>
          <Routes>
            {/* <Route path="/" element={<Home />} /> */}
            <Route exact path="/" element={<Workspace />} />
            <Route exact path="/workspace/:workspaceId" element={<Home />} />
            <Route
              path="*"
              isAuthenticate={isAuthenticate}
              element={<PageNotFound />}
            />
          </Routes>
        </Router>
      </div>
    );
  }
}

export default App;
