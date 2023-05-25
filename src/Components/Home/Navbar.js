import React, { useState, useEffect, useContext } from "react";
import "./Navbar.css";
import { TiArrowBackOutline } from "react-icons/ti";
import { Button, Modal, Input, Image } from "antd";
import { auth } from "../../Firebase";
import { FiMessageSquare } from "react-icons/fi";
import { MdTimer } from "react-icons/md";
import { BsPlusLg } from "react-icons/bs";

import { AiOutlineCoffee, AiFillSetting } from "react-icons/ai";
import { TfiMenuAlt } from "react-icons/tfi";
import BackgroundModal from "./BackgroundModal";
import { GlobalStateContext } from "../Hooks/GlobalStateContext";

const Navbar = () => {
  // const [time, setTime] = useState(
  //   parseInt(localStorage.getItem("time")) || 30
  // );
  // const [isActive, setIsActive] = useState(
  //   localStorage.getItem("isActive") === "true" || true
  // );
  // const [isBreak, setIsBreak] = useState(
  //   localStorage.getItem("isBreak") === "true" || false
  // );
  // const [showModal, setShowModal] = useState(
  //   localStorage.getItem("showModal") === "true" || false
  // );

  // function toggle() {
  //   setIsActive(!isActive);
  // }

  // function reset() {
  //   setIsActive(false);
  //   setTime(30);
  //   setIsBreak(false);
  //   setShowModal(false);
  // }

  // useEffect(() => {
  //   localStorage.setItem("isActive", isActive);
  //   localStorage.setItem("isBreak", isBreak);
  //   localStorage.setItem("showModal", showModal);
  //   localStorage.setItem("time", time);
  // }, [isActive, isBreak, showModal, time]);

  // useEffect(() => {
  //   let interval = null;
  //   let timeout = null;

  //   // If the timer is active and it reaches 0, set break to true and start the break timer
  //   if (isActive && time === 0) {
  //     setIsActive(false);
  //     setIsBreak(true);
  //     setShowModal(true);
  //     setTime(10);
  //     timeout = setTimeout(() => {
  //       setShowModal(false);
  //       setIsActive(true);
  //       setIsBreak(false);
  //       setTime(30);
  //     }, 10000);
  //   }

  //   // If the timer is not active and the break timer reaches 0, start the timer again
  //   if (!isActive && isBreak && time === 0) {
  //     setShowModal(false);
  //     setIsActive(true);
  //     setIsBreak(false);
  //     setTime(30);
  //   }

  //   // Start the timer when it is active
  //   if (isActive) {
  //     interval = setInterval(() => {
  //       setTime((time) => time - 1);
  //     }, 1000);
  //   } else {
  //     clearInterval(interval);
  //   }

  //   // Clear the interval and timeout when the component unmounts
  //   return () => {
  //     clearInterval(interval);
  //     clearTimeout(timeout);
  //   };
  // }, [isActive, isBreak, time]);

  // useEffect(() => {
  //   let timeout = null;
  //   if (showModal) {
  //     timeout = setTimeout(() => {
  //       setShowModal(false);
  //       setIsBreak(false);
  //       setTime(30);
  //       setIsActive(true);
  //     }, 10000);
  //   }
  //   return () => clearTimeout(timeout);
  // }, [showModal]);

  // const timerStyle = {
  //   color: isBreak ? "red" : isActive ? "red" : "white",
  // };

  // const iconStyle = {
  //   color: isBreak ? "red" : isActive ? "red" : "white",
  // };

  // const breakStyle = {
  //   color: isBreak ? "green" : "white",
  // };
  const { visible, setVisible } = useContext(GlobalStateContext);

  return (
    <div className="navbar">
      <div className="left__navbar">
        <Button className="button_exit">
          <TiArrowBackOutline className="exit__icon" />
        </Button>
        <Button className="button_exit">
          <FiMessageSquare className="exit__icon" />
        </Button>
        <div>
          <Input className="input__left" placeholder="search..." />
        </div>
      </div>
      <div className="logo">
        <p>EmProductify</p>
      </div>
      <div className="right__navbar">
        <div className="search__side__button">
          {/* <div className="time">
            <MdTimer className="timer" style={iconStyle} />
            <button onClick={toggle} style={timerStyle}>
              {Math.floor(time / 60)}:{("0" + (time % 60)).slice(-2)}
            </button>
          </div> */}
          <Button className="button_exit">
            <BsPlusLg className="exit__icon" />
          </Button>
          <Button
            className="button_exit"
            style={{ fontSize: "18px", color: "#FFF" }}
          >
            {auth.currentUser.displayName
              ? auth.currentUser.displayName
              : `User`}
          </Button>
          <Button className="button_exit" onClick={() => setVisible(true)}>
            <AiFillSetting className="exit__icon" />
          </Button>

          {/* <div className="break">
            <AiOutlineCoffee className="coffee" style={breakStyle} />
            <button style={breakStyle} disabled={isBreak}>
              {isBreak ? "BREAK" : "T"}
            </button>
            {isBreak && <Modal message="It's break time!" />}
          </div> */}
        </div>
      </div>
      {visible ? <BackgroundModal /> : null}
    </div>
  );
};

export default Navbar;
