import React from "react";
import "./Card.css";

const Card = ({ text }) => {
  return (
    <div className="card">
      <div></div>
      <div className="card__title">
        <h2>{text}</h2>
        <p>Front page with all all content</p>
      </div>
      <div></div>
      <div></div>
    </div>
  );
};

export default Card;
