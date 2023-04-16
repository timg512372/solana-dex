import "./SwapBox.css"
import ReactModal from 'react-modal';
import React, { useState } from 'react';

ReactModal.setAppElement('#root'); // specify the root element of your app

const Modal = ({ isOpen, onRequestClose, title, children }) => {
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="modal"
      overlayClassName="overlay"
      closeTimeoutMS={200}
    >
      <div className="modal-header">
        <h3>{title}</h3>
        <button className="close-btn" onClick={onRequestClose}>
          <span>&times;</span>
        </button>
      </div>
      <div className="modal-body">{children}</div>
    </ReactModal>
  );
};

export default Modal;
