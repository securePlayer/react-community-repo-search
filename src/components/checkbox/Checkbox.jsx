import React, { useState } from 'react';
import styles from './Checkbox.module.scss';

export default function Checkbox({ isChecked, label, onChange }) {

  const handleCheckboxChange = () => {
    if (onChange) {
      onChange(!isChecked); 
    }
  };

  return (
    <label className={styles.checkboxContainer}>
      <input 
        type="checkbox" 
        checked={isChecked} 
        onChange={handleCheckboxChange} 
        className={styles.checkboxInput} 
      />
      <span className={styles.checkboxLabel}>{label}</span>
    </label>
  );
};