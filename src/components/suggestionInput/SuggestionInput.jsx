import React, { useEffect, useState } from "react";
import Select from "react-select";
import Fuse from "fuse.js";
import styles from "./SuggestionInput.module.scss";
import { FaSearch } from "react-icons/fa";

const SuggestionInput = ({
    selectedOptions: selectedOptions_props = [],
    suggestions = [],
    onSearch,
    placeholder,
    suggestionLimit,
}) => {
    const [inputValue, setInputValue] = useState("");
    const [selectedOptions, setSelectedOptions] = useState(selectedOptions_props);

    useEffect(() => {
        setSelectedOptions(selectedOptions_props);
    }, [JSON.stringify(selectedOptions_props)]);

    const handleInputChange = (newValue) => {
        setInputValue(newValue);
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            handleAddOption();
        }
    };

    const handleAddOption = () => {
        if (inputValue) {
            // Add the current input value as a new option
            const newOption = { label: inputValue, value: inputValue };
            setSelectedOptions((prev) => [...prev, newOption]);
            onSearch(
                [
                    ...selectedOptions.map((option) => option.value),
                    inputValue,
                ].join(", ")
            );
            setInputValue("");
        }
    };

    const handleChange = (options) => {
        setSelectedOptions(options || []);
        const values = options
            ? options.map((option) => option.value).join(", ")
            : "";
        setInputValue("");
        onSearch(values);
    };

    // Function to sort suggestions
    const sortSuggestions = (input) => {
        const fuse = new Fuse(suggestions, {
            keys: ["label"],
            threshold: 0.3, // Adjust this value for sensitivity
        });

        const results = fuse.search(input);
        const exactMatches = results.filter(
            (result) => result.item.label.toLowerCase() === input.toLowerCase()
        );
        const otherMatches = results.filter(
            (result) => result.item.label.toLowerCase() !== input.toLowerCase()
        );

        // Combine exact matches and other matches
        return [
            ...exactMatches.map((result) => result.item),
            ...otherMatches.map((result) => result.item),
        ];
    };

    const filteredSuggestions = sortSuggestions(inputValue).slice(
        0,
        suggestionLimit
    );

    return (
        <div className={styles.container}>
            <Select
                className={styles.select}
                options={[
                    { label: inputValue, value: inputValue },
                    ...filteredSuggestions,
                ]} // Include typed value as an option
                onChange={handleChange}
                onInputChange={handleInputChange}
                inputValue={inputValue}
                value={selectedOptions}
                placeholder={placeholder}
                isClearable
                isMulti // Enable multi-select
                menuIsOpen={inputValue.length > 0} // Show menu only when typing
                styles={{
                    input: (provided) => ({
                        ...provided,
                        width: "100%",
                    }),
                    menu: (provided) => ({
                        ...provided,
                        position: "absolute",
                        zIndex: 100,
                    }),
                    option: (provided) => ({
                        ...provided,
                        cursor: "pointer",
                    }),
                    control: (provided) => ({
                        ...provided,
                        paddingRight: "30px", // Space for search icon
                    }),
                }}
                components={{
                    DropdownIndicator: () => (
                        <div className={styles.icon}>
                            <FaSearch />
                        </div>
                    ),
                }}
                onKeyDown={handleKeyDown}
            />
        </div>
    );
};

export default SuggestionInput;
