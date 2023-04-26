import React, { useState } from "react";
import List from "./List";
import "./Body.css";
import Card from "./Card";
import { BiDotsVerticalRounded } from "react-icons/bi";

function ShowingList({ listName }) {
  const [cards, setCards] = useState([]);

  function addCard() {
    const newCard = {
      text: document.getElementById(`newCardText-${listName}`).value,
    };
    setCards([...cards, newCard]);
    document.getElementById(`newCardText-${listName}`).value = "";
  }

  return (
    <div className="list">
      <div className="top__list">
        <p>{listName}</p>
        <BiDotsVerticalRounded className="list__icon" />
      </div>
      <div className="add__card">
        <input
          type="text"
          placeholder="Add a new card"
          id={`newCardText-${listName}`}
        />
        <button onClick={addCard}>Add Card</button>
      </div>
      <div className="card__box">
        {cards.map((card, index) => (
          <Card key={index} text={card.text} />
        ))}
      </div>
    </div>
  );
}

const Body = () => {
  return (
    <div className="body">
      <ShowingList listName="Discussion" />
      <ShowingList listName="Assign" />
      <ShowingList listName="In working" />
      <ShowingList listName="Completed" />
    </div>
  );
};

export default Body;
