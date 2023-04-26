import React, { useState } from "react";
import Card from "./Card";
import { BiDotsVerticalRounded } from "react-icons/bi";

import "./List.css";
const List = ({ listName }) => {
  const [cards, setCards] = useState([]);

  function addCard() {
    const newCard = { text: document.getElementById("newCardText").value };
    setCards([...cards, newCard]);
    document.getElementById("newCardText").value = "";
  }
  return (
    <div className="list">
      <div className="top__list">
        <p>{listName}</p>
        <BiDotsVerticalRounded className="list__icon" />
      </div>
      <div className="add__card">
        <input type="text" placeholder="Add a new card" id="newCardText" />
        <button onClick={addCard}>Add Card</button>
      </div>
      <div className="card__box">
        {cards.map((card, index) => (
          <Card key={index} text={card.text} />
        ))}
      </div>
    </div>
  );
};

export default List;
