import React, { useContext, useEffect, useState } from "react";
import { Button } from "reactstrap";
import { auth } from "../../Firebase";
import { useNavigate, useParams } from "react-router-dom";
import Header from "./Header";
import "./Home.css";
import Body from "./Body";
import Navbar from "./Navbar";
import { collection, onSnapshot } from "firebase/firestore";
import { GlobalStateContext } from "../Hooks/GlobalStateContext";
import { db } from "../../Firebase";
import Chat from "./Chat";

const Home = () => {
  const navigate = useNavigate();
  const logout = () => {
    auth.signOut();
    navigate("/login");
  };

  const { workspaceId } = useParams();

  const [workspaces, setWorkspaces] = useState([]);

  useEffect(() => {
    const workspaceRef = collection(db, "workspaces");

    const unsubscribe = onSnapshot(workspaceRef, (snapshot) => {
      const updatedWorkspaces = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter((workspace) => workspace.id === workspaceId);

      setWorkspaces(updatedWorkspaces);
    });

    return () => unsubscribe(); // Unsubscribe from the snapshot listener when component unmounts
  }, [workspaceId]);

  const { background, shift, setShift } = useContext(GlobalStateContext);

  return (
    <>
      {workspaces.map((doc, index) => (
        <div
          className="myDiv"
          style={{
            backgroundImage: `url(${
              doc && doc.background ? doc.background : background
            })`,
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
          }}
        >
          <Navbar />
          <div className="work_title">
            <Button className="title__work">
              <p>{doc.name}</p>
            </Button>
            <Button className="title__work">
              <p>Private</p>
            </Button>
          </div>
          <div className="dashboard">
            {/* <div className="sidebar">
          <FiMessageSquare
            className="sidebar__icon"
            onClick={() => setClicked(!clicked)}
          />
          <BiLogOutCircle onClick={logout} className="logoutButton" />
        </div> */}
            {shift ? (
              <div className="main__body">
                <div>
                  {/* <Header /> */}
                  {/* <Searchbar /> */}
                  <Body />
                </div>
              </div>
            ) : (
              <div className="main__body">
                <div>
                  <Chat />
                  {/* <Searchbar /> */}
                  {/* <Body /> */}
                </div>
              </div>
            )}
            {/* <button onClick={logout}>Logout</button> */}
          </div>
        </div>
      ))}
    </>
  );
};

export default Home;
