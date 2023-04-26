import React from "react";
import "./Modal.css";
import Break from "../undraw_breakfast_psiw.png";
import { Image } from "antd";

function Modal({ message }) {
  return (
    <div className="modal">
      <div className="modal-content">
        <Image src={Break} className="image" />
        <p>{message}</p>
      </div>
    </div>
  );
}

export default Modal;
