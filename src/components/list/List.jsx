import styles from "./List.module.scss";
import React, { useEffect, useRef, useState } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";

const InfiniteScrollListView = ({
    postDisplay = () => {},
    fetchPage = () => {},
    height,
    pageSize = 10,
    parentData
}) => {
    const [data, setData] = useState({ pages: [], hasNextPage: true });
    const [isFetching, setIsFetching] = useState(false);
    const parentRef = useRef(null);

    // Function to fetch data
    const loadData = async (offset) => {
        setIsFetching(true);
        try {
            const result = await fetchPage(offset);

            setData(result);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsFetching(false);
        }
    };

    // Initial data load
    useEffect(() => {
        loadData(0); // Load the first page if no initial data
    }, [parentData]);

    const allRows = data.pages;

    const rowVirtualizer = useVirtualizer({
        count: data.hasNextPage ? allRows.length + 1 : allRows.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 100,
        overscan: 5,
    });

    // Infinite scroll logic
    const handleScroll = () => {
        const scrollElement = parentRef.current;
        if (
            scrollElement.scrollTop + scrollElement.clientHeight >=
            scrollElement.scrollHeight - 10 && // Adjust threshold as needed
            data.hasNextPage &&
            !isFetching
        ) {
            loadData(allRows.length); // Fetch next page using current length as offset
        }
    };

    useEffect(() => {
        const scrollElement = parentRef.current;
        scrollElement.addEventListener('scroll', handleScroll);

        return () => {
            scrollElement.removeEventListener('scroll', handleScroll);
        };
    }, [data.hasNextPage, isFetching, allRows.length]);

    return (
        <div className={styles.container}>
            {isFetching && allRows.length === 0 ? (
                <p>Loading...</p>
            ) : (
                <div ref={parentRef} style={{ height, overflow: "auto" }}>
                    <div
                        style={{
                            height: `${rowVirtualizer.getTotalSize()}px`,
                            position: "relative",
                        }}
                    >
                        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                            const isLoaderRow =
                                virtualRow.index > allRows.length - 1;
                            const post = allRows[virtualRow.index];

                            return (
                                <div
                                    key={virtualRow.index}
                                    style={{
                                        position: "absolute",
                                        top: 0,
                                        left: 0,
                                        width: "100%",
                                        height: `${virtualRow.size}px`,
                                        transform: `translateY(${virtualRow.start}px)`,
                                        backgroundColor:
                                            virtualRow.index % 2
                                                ? "#f0f0f0"
                                                : "#ffffff",
                                    }}
                                >
                                    {isLoaderRow
                                        ? data.hasNextPage
                                            ? "Loading more..."
                                            : "Nothing more to load"
                                        : postDisplay(post)}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
            {isFetching && allRows.length > 0 ? <div>Loading...</div> : null}
        </div>
    );
};

export default InfiniteScrollListView;