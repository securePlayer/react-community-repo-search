import React, { useRef, useState } from "react";
import Select from "react-select";
import styles from "./MinMaxInput.module.scss";

const MinMaxInput = ({
    placeholderMin = "Min",
    placeholderMax = "Max",
    minValue = "",
    maxValue = "",
    onInputChange,
    label,
}) => {
    const handleChange = (e, type) => {
        const value = e.target.value;
        if (value === "" || /^[0-9]*$/.test(value)) {
            onInputChange(type, value);
        }
    };

    return (
        <div className={styles.rangeInputContainer}>
            {label && <div className={styles.label}>{label}</div>}
            <div className={styles.inputs}>
                <input
                    type="number"
                    placeholder={placeholderMin}
                    value={minValue}
                    onChange={(e) => handleChange(e, "min")}
                    className={styles.input}
                />
                <input
                    type="number"
                    placeholder={placeholderMax}
                    value={maxValue}
                    onChange={(e) => handleChange(e, "max")}
                    className={styles.input}
                />
            </div>
        </div>
    );
};

export default MinMaxInput;
