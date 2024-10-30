const sortOptions = [
    {
        label: "Name (Asc)",
        value: {
            type: "name",
            isAscending: true,
        },
    },
    {
        label: "Name (Desc)",
        value: {
            type: "name",
            isAscending: false,
        },
    },
    {
        label: "Star Count (Asc)",
        value: {
            type: "stargazers_count",
            isAscending: true,
        },
    },
    {
        label: "Star Count (Desc)",
        value: {
            type: "stargazers_count",
            isAscending: false,
        },
    },
    {
        label: "Fork Count (Asc)",
        value: {
            type: "forks_count",
            isAscending: true,
        },
    },
    {
        label: "Fork Count (Desc)",
        value: {
            type: "forks_count",
            isAscending: false,
        },
    },
    {
        label: "Watcher Count (Asc)",
        value: {
            type: "watchers_count",
            isAscending: true,
        },
    },
    {
        label: "Watcher Count (Desc)",
        value: {
            type: "watchers_count",
            isAscending: false,
        },
    },
];

export default {
    sortOptions,
};
