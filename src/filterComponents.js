export default function filterComponents({
    items,
    limits, languages, licenses,
    starIcon, forkIcon, eyeIcon
}) {
    return [
        {
            id: "search_name",
            type: "search",
            placeholder: "Search Name",
            options: items.map((obj) => ({
                label: obj.name,
                value: obj.name,
            }))
        },
        {
            id: "search_description",
            type: "search",
            placeholder: "Search Description",
        },
        {
            id: "stargazers_count",
            type: "numberRange",
            min: limits["stargazers_count"]?.min,
            max: limits["stargazers_count"]?.max,
            label: <img src={starIcon} />,
            textLabel: "Total Stars"
        },
        {
            id: "forks_count",
            type: "numberRange",
            min: limits["forks_count"]?.min,
            max: limits["forks_count"]?.max,
            label: <img src={forkIcon} />,
            textLabel: "Total Forks"
        },
        {
            id: "watchers_count",
            type: "numberRange",
            min: limits["watchers_count"]?.min,
            max: limits["watchers_count"]?.max,
            label: <img src={eyeIcon} />,
            textLabel: "Total Watchers"
        },
        {
            id: "open_issues",
            type: "numberRange",
            min: limits["open_issues"]?.min,
            max: limits["open_issues"]?.max,
            textLabel: "Open Issues",
        },
        {
            id: "languages",
            type: "dropdown",
            placeholder: "Select Languages",
            options: languages?.map((lang) => ({
                label: lang,
                value: lang,
            })),
        },
        {
            id: "licenses",
            type: "dropdown",
            placeholder: "Select Licenses",
            options: licenses?.map((name) => ({
                label: name,
                value: name,
            })),
        },
        {
            id: "fork",
            type: "checkbox",
            textLabel: "Fork",
        },
        {
            id: "has_wiki",
            type: "checkbox",
            textLabel: "Has Wiki",
        },
        {
            id: "has_issues",
            type: "checkbox",
            textLabel: "Has Issues",
        },

        {
            id: "has_projects",
            type: "checkbox",
            textLabel: "Has Projects",
        },
        {
            id: "has_discussions",
            type: "checkbox",
            textLabel: "Has Discussions",
        },
        {
            id: "archived",
            type: "checkbox",
            textLabel: "is Archived",
        },
    ]
}