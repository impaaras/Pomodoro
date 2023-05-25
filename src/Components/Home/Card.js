import React, { useEffect, useState } from "react";
import "./Card.css";
import { Draggable } from "react-beautiful-dnd";
import { addDoc, collection, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../Firebase";

const Card = ({
  text,
  cardId,
  source,
  destination,
  draggedCardId,
  id,
  workspaceId,
}) => {
  // useEffect(() => {
  //   if (!destination) {
  //     return;
  //   }
  // }, []);

  // function handleCardDrop(workspaceId, text, cardId) {
  //   if (text.trim() === "") {
  //     return;
  //   }

  //   const newCard = {
  //     text: text,
  //   };

  //   if (cardId) {
  //     const cardRef = doc(
  //       db,
  //       workspaceId,
  //       destination.toString(),
  //       "cards",
  //       cardId
  //     );

  //     deleteDoc(cardRef)
  //       .then(() => {
  //         console.log("Card deleted:", cardId);
  //         addNewCard(workspaceId, newCard);
  //       })
  //       .catch((error) => {
  //         console.error("Error deleting card:", error);
  //       });
  //   } else {
  //     addNewCard(workspaceId, newCard);
  //   }
  // }

  // function addNewCard(workspaceId, newCard) {
  //   addDoc(
  //     collection(db, workspaceId, destination.toString(), "cards"),
  //     newCard
  //   )
  //     .then(() => {
  //       console.log("New card added:", newCard);
  //     })
  //     .catch((error) => {
  //       console.error("Error adding card:", error);
  //     });
  // }

  // useEffect(() => {
  //   // if (!destination || !workspaceId || !source) {
  //   //   return;
  //   // }

  //   // handleCardDrop(workspaceId, text, draggedCardId);
  //   console.log(destination, source);
  // }, []);

  // function addCard(workspaceId, text) {
  //   if (text.trim() !== "") {
  //     const newCard = {
  //       text: text,
  //     };

  //     addDoc(collection(db, workspaceId, destination.toString(), "cards"), newCard)
  //       .then(() => {
  //         console.log("New card added:", newCard);
  //       })
  //       .catch((error) => {
  //         console.error("Error adding card:", error);
  //       });
  //   }
  // }

  // function deleteCard(workspaceId, cardId) {
  //   const cardRef = doc(
  //     db,
  //     workspaceId,
  //     source.toString(),
  //     "cards",
  //     draggedCardId
  //   );

  //   deleteDoc(cardRef)
  //     .then(() => {
  //       console.log("Card deleted:", cardId);
  //     })
  //     .catch((error) => {
  //       console.error("Error deleting card:", error);
  //     });
  // }

  return (
    <div className="card">
      <div></div>
      <div className="card__title">
        <p>{text}</p>
        {/* <p>Front page with all all content</p> */}
      </div>
      <div></div>
      <div></div>
    </div>
  );
};

export default Card;
