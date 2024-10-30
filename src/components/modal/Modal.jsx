import React from 'react';
import ReactModal from 'react-modal';
import styles from './Modal.module.scss';

ReactModal.setAppElement('#root'); // Set the app element for accessibility

const Modal = ({ isOpen, onRequestClose, header, body, bodyClassName, clearButton, applyButton }) => {
  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className={styles.modal}
      overlayClassName={styles.overlay}
    >
      <div className={styles.header}>
        <h2>{header}</h2>
        <button className={styles.closeButton} onClick={onRequestClose}>
          &times;
        </button>
      </div>
      <div className={`${styles.body} ${bodyClassName? bodyClassName:""}`}>
        {body}
      </div>
      <div className={styles.footer}>
      {clearButton && (
          <button className={styles.clearButton} onClick={clearButton.onClick}>
            {clearButton.label}
          </button>
        )}

        {applyButton && (
          <button className={styles.applyButton} onClick={applyButton.onClick}>
            {applyButton.label}
          </button>
        )}
      </div>
    </ReactModal>
  );
};

export default Modal;