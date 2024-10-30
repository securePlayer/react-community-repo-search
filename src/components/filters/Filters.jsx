import { useEffect, useState } from "react";
import Checkbox from "../checkbox/Checkbox";
import MinMaxInput from "../minMaxInput.jsx/MinMaxInput";
import Modal from "../modal/Modal";
import TextInput from "../textInput/TextInput";
import styles from "./Filters.module.scss";
import useFilters from "./useFilters";
import SuggestionInput from "../suggestionInput/SuggestionInput";

export default function Filters({
    advanceFiltersInfo = [],
    filtersInfo = [],
    applyFilters = () => {},
    appliedFilters = {},
    isQuickFilterButtonVisible
}) {
    const { filters, setFilters } = useFilters(appliedFilters);
    const [modalIsOpen, setModalIsOpen] = useState(false);

    function updateFilters() {
        setFilters({
            updateFilters: appliedFilters,
        });
    }

    useEffect(() => {
        updateFilters();
    }, [JSON.stringify(appliedFilters)]);

    const openModal = () => {
        updateFilters();
        setModalIsOpen(true);
    };

    const closeModal = () => setModalIsOpen(false);

    const handleApply = () => {
        let ids = advanceFiltersInfo
            .concat(filtersInfo)
            .flatMap((obj) => {
                if (obj.type == "numberRange")
                    return ["min_" + obj.id, "max_" + obj.id];
                else return obj.id;
            })
            .filter((id, idx, arr) => arr.findIndex((id1) => id1 == id) == idx);
        let removedIds = ids.filter(
            (id) => !Object.keys(filters).find((id1) => id1 == id)
        );

        applyFilters({ updateFilters: filters, removeFilters: removedIds });
        closeModal();
    };

    const handleClear = () => {
        let list = {
            removeFilters: Object.keys(appliedFilters),
        };
        setFilters(list);
        applyFilters(list);
    };

    let totalAppliedFilters = Object.keys(appliedFilters).length;

    function getComponents(props) {
        let { id, type, options, label, placeholder, idx } = props;

        switch (type) {
            case "search":
                return (
                    <SuggestionInput
                        key={idx}
                        onSearch={(newValue) => {
                            let newFilters = {};
                            if (newValue == "" || newValue == undefined) {
                                newFilters.removeFilters = [id];
                            } else
                                newFilters.updateFilters = { [id]: newValue };

                            setFilters(newFilters);
                        }}
                        selectedOptions={filters?.[id]?.split(",")?.map((s) => {
                            let newString = s.trim();

                            return {
                                label: newString,
                                value: newString,
                            };
                        })}
                        placeholder={placeholder}
                        suggestions={options}
                    />
                );
            case "checkbox":
                return (
                    <Checkbox
                        key={idx}
                        label={label}
                        isChecked={filters?.[id] ? filters[id] : false}
                        onChange={(isChecked) => {
                            setFilters(
                                isChecked
                                    ? {
                                          updateFilters: {
                                              [id]: true,
                                          },
                                      }
                                    : {
                                          removeFilters: [id],
                                      }
                            );
                        }}
                    />
                );
            case "numberRange":
                return (
                    <div key={idx}>
                        <MinMaxInput
                            label={label}
                            minValue={filters?.[`min_${id}`]}
                            maxValue={filters?.[`max_${id}`]}
                            onInputChange={(type, value) => {
                                setFilters(
                                    value == ""
                                        ? {
                                              removeFilters: [`${type}_${id}`],
                                          }
                                        : {
                                              updateFilters: {
                                                  [`${type}_${id}`]: value,
                                              },
                                          }
                                );
                            }}
                        />
                    </div>
                );
            case "dropdown":
                return (
                    <TextInput
                        key={idx}
                        isMulti
                        options={options}
                        placeholder={placeholder}
                        selectedOptions={filters?.[id]}
                        onChange={(values) => {
                            let added = options.filter((obj) =>
                                values.find((obj1) => obj1.value == obj.value)
                            );
                            let removed = options.filter((obj) =>
                                added.find((obj1) => obj1.value == obj.value)
                            );

                            setFilters({
                                updateFilters: {
                                    [id]: added.map((obj) => obj.value),
                                },
                                removeFilters: removed.map((obj) => obj.value),
                            });
                        }}
                    />
                );
        }
    }
    let filterChildren = filtersInfo.map((props, idx) => {
        return getComponents({ ...props, idx });
    });

    let advanceFilterChildren = advanceFiltersInfo.map((props, idx) => {
        return getComponents({ ...props, idx, label: props.textLabel });
    });

    return (
        <div className={styles["container"]}>
            {/* Modal */}
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                header="Advance Filters"
                bodyClassName={styles["modal-body"]}
                body={advanceFilterChildren}
                clearButton={{ label: "Clear", onClick: handleClear }}
                applyButton={{ label: "Apply", onClick: handleApply }}
            />

            <div className={styles["filter-inputs"]}>
                {filterChildren}
                {advanceFilterChildren.length > 0 && (
                    <span
                        className={styles["advance-filter-trigger"]}
                        onClick={openModal}
                    >
                        +Advance Filters
                    </span>
                )}

                {isQuickFilterButtonVisible ? (
                    <>
                        <button
                            style={{ marginLeft: "20px" }}
                            onClick={handleClear}
                        >
                            Clear
                        </button>
                        <button onClick={handleApply}>Apply</button>
                    </>
                ) : (
                    ""
                )}
            </div>

            {Object.keys(appliedFilters).length > 0 &&
                (() => {
                    let chips = [];
                    let index = 0;
                    for (let id in appliedFilters) {
                        let obj = advanceFiltersInfo.find((obj) =>
                            id.includes(obj.id)
                        );
                        let labelType = id.startsWith("min_")
                            ? "Min"
                            : id.startsWith("max_")
                            ? "Max"
                            : "";

                        let label =
                            obj?.label && typeof obj.label == "string"
                                ? obj.label
                                : obj?.textLabel
                                ? obj.textLabel
                                : obj?.placeholder
                                ? obj.placeholder
                                : "";
                        chips.push(
                            <div
                                key={index}
                                className={styles.chips}
                                onClick={() => {
                                    let obj = {
                                        removeFilters: [id],
                                    };
                                    applyFilters(obj);
                                    setFilters(obj);
                                }}
                            >
                                {`${
                                    labelType ? labelType + " " : ""
                                }${label}: ${appliedFilters[id]} `}
                                <span style={{ fontWeight: "bold" }}>X</span>
                            </div>
                        );
                        index++;
                    }

                    return (
                        <div className={styles["chips-container"]}>{chips}</div>
                    );
                })()}
            {totalAppliedFilters > 0 && (
                <div>{`${totalAppliedFilters} Filters Applied`}</div>
            )}
        </div>
    );
}
