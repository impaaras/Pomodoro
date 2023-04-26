import React, { useEffect, useState } from "react";
import "./SearchBar.css";
import { MdTimer } from "react-icons/md";
import { AiOutlineCoffee } from "react-icons/ai";
import { TfiMenuAlt } from "react-icons/tfi";
import Modal from "./Modal";

const Searchbar = () => {
  return (
    <div className="search">
      <div className="searchBar">
        <TfiMenuAlt className="menu" />
        <p>All task</p>
        <input placeholder="search task..." />
      </div>
      <div className="search__side__button">
        <div className="time">
          <MdTimer className="timer" />
          <button>25.00</button>
          {/* <button onClick={reset}>Reset</button> */}
        </div>
        <div className="break">
          <AiOutlineCoffee className="coffee" />
          <button>Break</button>
          {/* {isBreak && <Modal message="It's break time!" />} */}
        </div>
      </div>
    </div>
  );
};

export default Searchbar;
