import React, { useState, useEffect, useContext } from "react";
import { Button, Modal } from "antd";
import { GlobalStateContext } from "../Hooks/GlobalStateContext";
import { useParams } from "react-router-dom";
import { doc, collection, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../Firebase";
const BackgroundModal = () => {
  const { background, setBackground, visible, setVisible } =
    useContext(GlobalStateContext);

  const { workspaceId } = useParams();

  const handleButtonClick = async (newLink) => {
    const workspaceDocRef = doc(db, "workspaces", workspaceId);
    try {
      await updateDoc(workspaceDocRef, { background: newLink });
      console.log("Workspace background updated successfully!");
    } catch (error) {
      console.error("Error updating workspace background:", error);
    }
    setBackground(newLink);
  };

  return (
    <Modal
      title="Choose background"
      width="600px"
      visible={visible}
      onCancel={() => setVisible(false)}
      footer={null}
    >
      <div className="modal__content">
        <Button
          style={{
            width: "150px",
            display: "flex",
            margin: 10,
            alignItems: "center",
            justifyContent: "center",
            height: "150px",
          }}
          onClick={() =>
            handleButtonClick("https://wallpaperaccess.com/full/1271300.jpg")
          }
        >
          <img
            style={{ width: "140px", height: "140px" }}
            alt=""
            src="https://wallpaperaccess.com/full/1271300.jpg"
          />
        </Button>
        <Button
          style={{
            width: "150px",
            display: "flex",
            margin: 10,
            alignItems: "center",
            justifyContent: "center",
            height: "150px",
          }}
          onClick={() =>
            handleButtonClick(
              "https://images.hdqwalls.com/download/iron-man-the-avengers-yy-1920x1080.jpg"
            )
          }
        >
          <img
            style={{ width: "140px", height: "140px" }}
            alt=""
            src="https://images.hdqwalls.com/download/iron-man-the-avengers-yy-1920x1080.jpg"
          />
        </Button>
        <Button
          style={{
            width: "150px",
            display: "flex",
            margin: 10,
            alignItems: "center",
            justifyContent: "center",
            height: "150px",
          }}
          onClick={() =>
            handleButtonClick("https://wallpaperaccess.com/full/266770.jpg")
          }
        >
          <img
            style={{ width: "140px", height: "140px" }}
            alt=""
            src="https://wallpaperaccess.com/full/266770.jpg"
          />
        </Button>
        <Button
          style={{
            width: "150px",
            display: "flex",
            margin: 10,
            alignItems: "center",
            justifyContent: "center",
            height: "150px",
          }}
          onClick={() =>
            handleButtonClick(
              "https://images.unsplash.com/photo-1465447142348-e9952c393450?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dHJhZmZpY3xlbnwwfHwwfHx8MA%3D%3D&w=1000&q=80"
            )
          }
        >
          <img
            style={{ width: "140px", height: "140px" }}
            alt=""
            src="https://images.unsplash.com/photo-1465447142348-e9952c393450?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dHJhZmZpY3xlbnwwfHwwfHx8MA%3D%3D&w=1000&q=80"
          />
        </Button>
        <Button
          style={{
            width: "150px",
            display: "flex",
            margin: 10,
            alignItems: "center",
            justifyContent: "center",
            height: "150px",
          }}
          onClick={() =>
            handleButtonClick(
              "https://c1.wallpaperflare.com/preview/959/40/923/cloud-mountain-snow-trello.jpg"
            )
          }
        >
          <img
            style={{ width: "140px", height: "140px" }}
            alt=""
            src="https://c1.wallpaperflare.com/preview/959/40/923/cloud-mountain-snow-trello.jpg"
          />
        </Button>
        <Button
          style={{
            width: "150px",
            display: "flex",
            margin: 10,
            alignItems: "center",
            justifyContent: "center",
            height: "150px",
          }}
          onClick={() =>
            handleButtonClick(
              "https://mixkit.imgix.net/art/85/85-original.png-1000h.png"
            )
          }
        >
          <img
            style={{ width: "140px", height: "140px" }}
            alt=""
            src="https://mixkit.imgix.net/art/85/85-original.png-1000h.png"
          />
        </Button>
      </div>
    </Modal>
  );
};

export default BackgroundModal;
