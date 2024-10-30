import styles from "./Manual.module.scss";
import useFilters from "../../components/filters/useFilters";
import TextInput from "../../components/textInput/TextInput";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import starIcon from "../../images/star-icon.png";
import forkIcon from "../../images/fork-icon.png";
import eyeIcon from "../../images/eye-icon.png";
import InfiniteScrollListView from "../../components/list/List";
import SuggestionInput from "../../components/suggestionInput/SuggestionInput";
import Filters from "../../components/filters/Filters";
import filterComponents from "../../filterComponents";
import constants from "../../helpers/constants";
import handleListStructure from "../../handleListStructure";
import functions from "../../helpers/functions";
import QuickView from "../../components/quickView/QuickView";
import { fetchDataWithQuery } from "../../redux/slices/repo.slice";

function Manual({
    setPage
}) {
    let defaultSort = {
        type: "name",
        isAscending: true,
    };
    const [sort, setSort] = useState(defaultSort);
    const { setFilters, filters } = useFilters({});
    const dispatch = useDispatch();
    const items = useRef();

    useEffect(() => {
        dispatch(fetchDataWithQuery({ param: { per_page: 100 } }));
    }, []);

    let sortOptions = constants.sortOptions;

    let {
        items: items_reduxStore,
        loading,
        error,
        languages,
        licenses,
        limits,
    } = useSelector((state) => state.data);
    items.current = JSON.parse(JSON.stringify(items_reduxStore));
    items.current = handleListStructure({
        items: items.current,
        filters,
        sort,
    });

    let filterComponentList = filterComponents({
        items: items.current,
        limits,
        languages,
        starIcon,
        forkIcon,
        eyeIcon,
        licenses,
    });

    return (
        <div className={styles.container}>
            <div className={styles["ai-search"]} onClick={() => setPage("ai")}>Try Using AI Search</div>

            <div className={styles["actions-container"]}>
                {/* Filters */}
                <div className={styles["filters-container"]}>
                    {/* Search Input with Suggestions */}
                    <SuggestionInput
                        onSearch={(newValue) => {
                            let id = "search_name";
                            let newFilters = {};
                            if (newValue == "" || newValue == undefined) {
                                newFilters.removeFilters = [id];
                            } else
                                newFilters.updateFilters = { [id]: newValue };

                            setFilters(newFilters);
                        }}
                        selectedOptions={filters?.search_name
                            ?.split(",")
                            ?.map((s) => {
                                let newString = s.trim();

                                return {
                                    label: newString,
                                    value: newString,
                                };
                            })}
                        placeholder={"Search Name"}
                        suggestions={items.current.map((obj) => ({
                            label: obj.name,
                            value: obj.name,
                        }))}
                    />

                    <Filters
                        applyFilters={setFilters}
                        appliedFilters={filters}
                        // filtersInfo={filterComponentList.filter(
                        //     (obj) => obj.id == "search_name"
                        //     ||
                        //         obj.id == "stargazers_count" ||
                        //         obj.id == "forks_count" ||
                        //         obj.id == "watchers_count" ||
                        //         obj.id == "languages"
                        // )}
                        advanceFiltersInfo={filterComponentList}
                    />
                </div>

                <div className={styles["sort-container"]}>
                    {/* Label */}
                    <div style={{ marginRight: "10px", fontWeight: "bold" }}>
                        Sort:
                    </div>

                    {/* Selections */}
                    <TextInput
                        options={sortOptions}
                        selectedOptions={{
                            label: sortOptions.find(
                                (obj) =>
                                    obj.value.type == sort.type &&
                                    obj.value.isAscending == sort.isAscending
                            )?.label,
                            value: sort,
                        }}
                        controlStyles={{
                            width: "200px",
                        }}
                        onChange={(obj) => {
                            setSort(obj.value);
                        }}
                        isNotClearable
                    />
                </div>
            </div>

            {/* Info */}
            <span>{`${items.current.length} repositories`}</span>

            {/* List */}
            <div style={{ border: "1px solid darkgrey" }}>
                {loading? (<div>Loading...</div>):(error? (<div>{error}</div>):"")}

                <InfiniteScrollListView
                    parentData={items.current}
                    pageSize={10}
                    fetchPage={(offset = 0) => {
                        let pageSize = 10;
                        let endPos = offset + pageSize;

                        return {
                            pages: items.current.slice(0, endPos),
                            hasNextPage: endPos < items.current.length,
                        };
                    }}
                    height={"500px"}
                    postDisplay={(post) => (
                        <div className={styles["item-container"]}>
                            <div className={styles["item-info-container"]}>
                                <div
                                    className={styles["item-name"]}
                                    onClick={() =>
                                        window.open(post?.html_url, "_blank")
                                    }
                                >
                                    {(() => {
                                        if (
                                            post?.name &&
                                            filters?.search_name
                                        ) {
                                            let wordList = filters.search_name
                                                .split(",")
                                                .map((s) => s.trim());
                                            let result =
                                                functions.highlightString(
                                                    post.name,
                                                    wordList
                                                );

                                            return result;
                                        }
                                        return post?.name;
                                    })()}
                                </div>
                                <div>
                                    {(() => {
                                        if (
                                            post?.description &&
                                            filters?.search_description
                                        ) {
                                            let wordList =
                                                filters.search_description
                                                    .split(",")
                                                    .map((s) => s.trim());
                                            let result =
                                                functions.highlightString(
                                                    post.description,
                                                    wordList
                                                );

                                            return result;
                                        }
                                        return post?.description;
                                    })()}
                                </div>

                                <div className={styles["stats-container"]}>
                                    {[
                                        {
                                            value: post?.stargazers_count,
                                            icon: starIcon,
                                            url: post?.stargazers_url,
                                        },
                                        {
                                            value: post?.forks_count,
                                            icon: forkIcon,
                                            url: post?.forks_url,
                                        },
                                        {
                                            value: post?.watchers_count,
                                            icon: eyeIcon,
                                        },
                                    ].map((obj, idx) => {
                                        let url = obj.url;

                                        return (
                                            <span
                                                className={`${
                                                    styles["stats"]
                                                } ${
                                                    url
                                                        ? styles[
                                                              "clickable-stats"
                                                          ]
                                                        : ""
                                                }`}
                                                key={idx}
                                            >
                                                <img src={obj.icon} />
                                                {obj.value}
                                            </span>
                                        );
                                    })}
                                </div>
                            </div>

                            <div>
                                <QuickView
                                    post={post}
                                />
                            </div>
                        </div>
                    )}
                />
            </div>
        </div>
    );
}

export default Manual;
