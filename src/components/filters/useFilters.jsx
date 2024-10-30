import { useState } from "react";

export default function useFilters({}) {
    const [filters, setFilters] = useState();

    function handleFiltering({ updateFilters = {}, removeFilters = [] }) {
        let newFilters = {
            ...filters,
            ...updateFilters,
        };

        if (removeFilters.length > 0) {
            for (let property of removeFilters) {
                if (newFilters?.[property]) {
                    delete newFilters[property];
                }
            }
        }

        setFilters(newFilters);
    }

    return {
        filters,
        setFilters: handleFiltering,
    };
}
