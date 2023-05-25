import React, { useEffect, useState } from "react";
import "./SearchBar.css";
import { MdTimer } from "react-icons/md";
import { AiOutlineCoffee } from "react-icons/ai";
import { TfiMenuAlt } from "react-icons/tfi";
import Modal from "./Modal";

// function usePersistedState(key, defaultValue) {
//   const [state, setState] = useState(() => {
//     const persistedState = localStorage.getItem(key);
//     return persistedState !== null ? JSON.parse(persistedState) : defaultValue;
//   });

//   useEffect(() => {
//     localStorage.setItem(key, JSON.stringify(state));
//   }, [key, state]);

//   return [state, setState];
// }

const Searchbar = () => {
  return (
    <div className="search">
      <div className="searchBar">
        <TfiMenuAlt className="menu" />
        <p>All task</p>
        <input placeholder="search task..." />
      </div>
    </div>
  );
};

export default Searchbar;
