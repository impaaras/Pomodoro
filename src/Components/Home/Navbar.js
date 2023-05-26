import React, { useState, useEffect, useContext } from "react";
import "./Navbar.css";
import { TiArrowBackOutline } from "react-icons/ti";
import { Button, Modal, Input, Image } from "antd";
import { auth, db } from "../../Firebase";
import { FiMessageSquare } from "react-icons/fi";
import { MdTimer } from "react-icons/md";
import { BsPlusLg } from "react-icons/bs";

import { AiOutlineCoffee, AiFillSetting } from "react-icons/ai";
import { TfiMenuAlt } from "react-icons/tfi";
import BackgroundModal from "./BackgroundModal";
import { GlobalStateContext } from "../Hooks/GlobalStateContext";
import { useNavigate, useParams } from "react-router-dom";
import { GiTomato } from "react-icons/gi";
import ModalBreak from "./Modal";

import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

const Navbar = ({ author }) => {
  const { shift, setShift } = useContext(GlobalStateContext);

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
    color: isBreak ? "red" : isActive ? "red" : "inherit",
  };

  const iconStyle = {
    color: isBreak ? "red" : isActive ? "red" : "inherit",
  };

  const breakStyle = {
    color: isBreak ? "green" : "inherit",
  };

  const { visible, setVisible } = useContext(GlobalStateContext);

  const changeloc = useNavigate();

  const [add, setAdd] = useState(false);

  const [users, setUsers] = useState([]);

  useEffect(() => {
    console.log("helo", auth.currentUser.uid);
    const usersRef = collection(db, "users");

    const unsubscribe = onSnapshot(usersRef, (snapshot) => {
      const currentUser = auth.currentUser;
      const usersData = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter((user) => user.uid !== currentUser.uid); // Exclude the current user

      setUsers(usersData);
    });

    return () => {
      unsubscribe();
    };
  }, []);
  const { workspaceId } = useParams();

  // const handleInviteClick = async (memberId) => {
  //   try {
  //     const membersRef = collection(db, "workspaces", workspaceId, "members");
  //     const newMemberRef = doc(membersRef, memberId);

  //     await addDoc(newMemberRef, {
  //       accepted: false,
  //       createdAt: serverTimestamp(),
  //     });

  //     console.log("Member invitation sent successfully!");
  //   } catch (error) {
  //     console.error("Error sending member invitation:", error);
  //   }
  // };

  function handleInviteClick(memberId) {
    const data = {
      id: memberId,
      accepted: false,
      createdAt: serverTimestamp(),
    };

    addDoc(collection(db, "workspaces", workspaceId, "members"), data)
      .then(() => {
        console.log("Member invitation sent successfully!");
      })
      .catch((error) => {
        console.error("Error sending member invitation:", error);
      });
  }

  const [members, setMembers] = useState([]);

  useEffect(() => {
    const membersRef = collection(db, "workspaces", workspaceId, "members");

    const unsubscribe = onSnapshot(membersRef, (snapshot) => {
      const membersData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setMembers(membersData);
    });

    return () => {
      unsubscribe();
    };
  }, [workspaceId]);

  return (
    <div className="navbar">
      <Modal
        title="Invite people"
        width="400px"
        visible={add}
        onCancel={() => setAdd(false)}
        footer={null}
      >
        {users.map((user, index) => (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              flexDirection: "row",
              alignItems: "center",
            }}
            key={index}
          >
            <p style={{ margin: "5px", fontSize: "18px" }}>{user.name}</p>

            {members.some((member) => member.id === user.uid) ? (
              <Button style={{ backgroundColor: "lightblue", color: "white" }}>
                Added
              </Button>
            ) : (
              <Button onClick={() => handleInviteClick(user.uid)}>Add</Button>
            )}
          </div>
        ))}

        {/* <form className={`w-full`}>
          <h2 className="title__text">{title}</h2>
          <Input
            className={`mb-3`}
            placeholder="Title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
          <Button type="primary" onClick={handleCreateWorkspace}>
            Create
          </Button>
        </form> */}
      </Modal>
      <div className="left__navbar">
        <Button className="button_exit" onClick={() => changeloc("/")}>
          <TiArrowBackOutline className="exit__icon" />
        </Button>
        <Button className="button_exit" onClick={() => setShift(!shift)}>
          <FiMessageSquare className="exit__icon" />
        </Button>
        {/* <div>
          <Input className="input__left" placeholder="search..." />
        </div> */}
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

          {auth.currentUser.uid == author ? (
            <Button className="button_exit" onClick={() => setAdd(true)}>
              <BsPlusLg className="exit__icon" />
            </Button>
          ) : null}
          <Button className="button_exit">
            <p>
              {Math.floor(time / 60)}:{("0" + (time % 60)).slice(-2)}
            </p>
            <GiTomato onClick={toggle} className="tommato" />
          </Button>
          <Button className="button_exit" onClick={() => setVisible(true)}>
            <AiFillSetting className="exit__icon" />
          </Button>
          <Button
            className="button_exit"
            style={{
              fontSize: "18px",
              borderRadius: "100px",
              backgroundColor: "#526D82",
              color: "#FFF",
            }}
          >
            {auth.currentUser.displayName
              ? auth.currentUser.displayName.charAt(0).toUpperCase()
              : "U"}
          </Button>
        </div>
      </div>
      {/* {isBreak && <ModalBreak message="It's break time!" />} */}
      {/* {showModal ? <ModalBreak /> : null} */}
      {visible ? <BackgroundModal /> : null}
    </div>
  );
};

export default Navbar;
