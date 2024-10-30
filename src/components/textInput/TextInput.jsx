import Select from "react-select";
import styles from "./TextInput.module.scss";
import { useEffect, useState } from "react";
import { components } from "react-select";

export default function TextInput({
    options = [],
    onChange = () => {},
    onInputChange = () => {},
    placeholder,
    customFilter,
    type,
    isMulti,
    isLoading, isNotClearable,
    selectedOptions = [],
    controlStyles = {}
}) {
    const NumericInput = (props) => {
        const handleKeyDown = (event) => {
            const { key } = event;
            // Allow: backspace, delete, tab, escape, enter and arrow keys
            if (
                key === "Backspace" ||
                key === "Delete" ||
                key === "Tab" ||
                key === "Escape" ||
                key === "Enter" ||
                // Allow: Ctrl+A
                (key === "a" && event.ctrlKey === true) ||
                // Allow: Ctrl+C
                (key === "c" && event.ctrlKey === true) ||
                // Allow: Ctrl+V
                (key === "v" && event.ctrlKey === true) ||
                // Allow: Ctrl+X
                (key === "x" && event.ctrlKey === true)
            ) {
                return;
            }

            // Ensure that it is a number and stop the keypress
            if ((key < "0" || key > "9") && key !== ".") {
                event.preventDefault();
            }
        };

        return (
            <div>
                <components.Input
                    {...props}
                    onKeyDown={handleKeyDown}
                    type="text" // Use text type for better control
                />
            </div>
        );
    };

    return (
        <div className={styles.container}>
            <Select
                components={{
                    ...(type == "number" ? { Input: NumericInput } : {}),
                }}
                className={styles.input}
                value={isMulti? selectedOptions.map(value => ({
                    label: value,
                    value
                })):selectedOptions}
                onInputChange={(value) => {
                    onInputChange(value);
                }}
                onChange={(value) => {
                    onChange(value);
                }}
                filterOption={(option, inputValue) => {
                    if (customFilter) {
                        customFilter(option, inputValue);
                    } else {
                        // Convert both option and input to lowercase for case-insensitive comparison
                        const lowerCaseInput = inputValue.toLowerCase();
                        const lowerCaseLabel = option.label.toLowerCase();

                        // Check if the option label includes the input value
                        return lowerCaseLabel.includes(lowerCaseInput);
                    }
                }}
                styles={{
                    control: (provided) => ({
                        ...provided,
                        ...(controlStyles? controlStyles:{}),
                    }),
                }}
                placeholder={placeholder}
                isLoading={isLoading}
                isClearable={!isNotClearable}
                in
                isSearchable
                isMulti={isMulti}
                options={options}
            />
        </div>
    );
}
