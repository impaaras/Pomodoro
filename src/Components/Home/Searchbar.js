import React, { useEffect, useState } from "react";
import "./SearchBar.css";
import { MdTimer } from "react-icons/md";
import { AiOutlineCoffee } from "react-icons/ai";
import { TfiMenuAlt } from "react-icons/tfi";
import Modal from "./Modal";

// function usePersistedState(key, defaultValue) {
//   const [state, setState] = useState(() => {
//     const persistedState = localStorage.getItem(key);
//     return persistedState !== null ? JSON.parse(persistedState) : defaultValue;
//   });

//   useEffect(() => {
//     localStorage.setItem(key, JSON.stringify(state));
//   }, [key, state]);

//   return [state, setState];
// }

const Searchbar = () => {
  const [time, setTime] = useState(
    parseInt(localStorage.getItem("time")) || 30
  );
  const [isActive, setIsActive] = useState(
    localStorage.getItem("isActive") === "true" || true
  );
  const [isBreak, setIsBreak] = useState(
    localStorage.getItem("isBreak") === "true" || false
  );
  const [showModal, setShowModal] = useState(
    localStorage.getItem("showModal") === "true" || false
  );

  function toggle() {
    setIsActive(!isActive);
  }

  function reset() {
    setIsActive(false);
    setTime(30);
    setIsBreak(false);
    setShowModal(false);
  }

  useEffect(() => {
    localStorage.setItem("isActive", isActive);
    localStorage.setItem("isBreak", isBreak);
    localStorage.setItem("showModal", showModal);
    localStorage.setItem("time", time);
  }, [isActive, isBreak, showModal, time]);

  useEffect(() => {
    let interval = null;
    let timeout = null;

    // If the timer is active and it reaches 0, set break to true and start the break timer
    if (isActive && time === 0) {
      setIsActive(false);
      setIsBreak(true);
      setShowModal(true);
      setTime(10);
      timeout = setTimeout(() => {
        setShowModal(false);
        setIsActive(true);
        setIsBreak(false);
        setTime(30);
      }, 10000);
    }

    // If the timer is not active and the break timer reaches 0, start the timer again
    if (!isActive && isBreak && time === 0) {
      setShowModal(false);
      setIsActive(true);
      setIsBreak(false);
      setTime(30);
    }

    // Start the timer when it is active
    if (isActive) {
      interval = setInterval(() => {
        setTime((time) => time - 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }

    // Clear the interval and timeout when the component unmounts
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [isActive, isBreak, time]);

  useEffect(() => {
    let timeout = null;
    if (showModal) {
      timeout = setTimeout(() => {
        setShowModal(false);
        setIsBreak(false);
        setTime(30);
        setIsActive(true);
      }, 10000);
    }
    return () => clearTimeout(timeout);
  }, [showModal]);

  const timerStyle = {
    color: isBreak ? "red" : isActive ? "red" : "white",
  };

  const iconStyle = {
    color: isBreak ? "red" : isActive ? "red" : "white",
  };

  const breakStyle = {
    color: isBreak ? "green" : "white",
  };

  return (
    <div className="search">
      <div className="searchBar">
        <TfiMenuAlt className="menu" />
        <p>All task</p>
        <input placeholder="search task..." />
      </div>
      <div className="search__side__button">
        <div className="time">
          <MdTimer className="timer" style={iconStyle} />
          <button onClick={toggle} style={timerStyle}>
            {Math.floor(time / 60)}:{("0" + (time % 60)).slice(-2)}
          </button>
          {/* <button onClick={reset}>Reset</button> */}
        </div>
        <div className="break">
          <AiOutlineCoffee className="coffee" style={breakStyle} />
          <button style={breakStyle} disabled={isBreak}>
            {isBreak ? "BREAK" : "TAKE A BREAK"}
          </button>
          {isBreak && <Modal message="It's break time!" />}
        </div>
      </div>
    </div>
  );
};

export default Searchbar;
