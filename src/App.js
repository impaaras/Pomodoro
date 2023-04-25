import React, { useEffect, useState } from "react";
import "./App.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { auth } from "./Firebase";
import Login from "./Components/Login/Login";
import Home from "./Components/Home/Home";
import Register from "./Components/Register/Register";
import PageNotFound from "./Components/PageNotFound";

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
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="*"
            isAuthenticate={isAuthenticate}
            element={<PageNotFound />}
          />
        </Routes>
      </Router>
    );
  }
}

export default App;
