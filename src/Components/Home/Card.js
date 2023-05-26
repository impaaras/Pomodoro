import React, { useEffect, useState } from "react";
import "./Card.css";
import { Draggable } from "react-beautiful-dnd";
import { addDoc, collection, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../Firebase";
import { Button } from "antd";

const Card = ({ text, id, del, workspaceId, destination, deleteCard }) => {
  // function deleteCard(workspaceId, id) {
  // if (destination) {
  //   deleteDoc(doc(db, workspaceId, del, "cards", id))
  //     .then(() => {
  //       console.log("Card deleted successfully");
  //     })
  //     .catch((error) => {
  //       console.error("Error deleting card:", error);
  //     });
  // }
  // }

  const [isclicked, setClicked] = useState(true);

  if (isclicked && destination) {
    console.log(destination);
    setClicked(false);
  }
  return (
    <div className="card">
      <div></div>
      <div className="card__title">
        <p>{text}</p>
        {/* <p>Front page with all all content</p> */}
      </div>
      {/* <button onClick={() => deleteCard(workspaceId, id)}>Delete</button> */}
      <div></div>
      <div></div>
    </div>
  );
};

export default Card;
