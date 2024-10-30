export default function handleListStructure({ items, filters, sort }) {
    // filter out the list
    items = items.filter((obj) => {
        for (let filter in filters) {
            let wordList = filters[filter].split(",");

            switch (filter) {
                case "search_name":
                    for (let word of wordList) {
                        word = word.trim();

                        if (!obj?.name?.toLowerCase().includes(word)) {
                            return false;
                        }
                    }                    
                    break;
                case "search_description":
                    for (let word of wordList) {
                        word = word.trim();

                        if (!obj?.description?.toLowerCase()?.includes(word)) {
                            return false;
                        }
                    }                    
                    break;
                case "max_forks_count":
                    if (obj.forks_count > filters[filter]) {
                        return false;
                    }
                    break;

                case "min_forks_count":
                    if (obj.forks_count < filters[filter]) {
                        return false;
                    }
                    break;
                case "max_stargazers_count":
                    if (obj.stargazers_count > filters[filter]) {
                        return false;
                    }
                    break;
                case "min_stargazers_count":
                    if (obj.stargazers_count < filters[filter]) {
                        return false;
                    }
                    break;
                case "max_watchers_count":
                    if (obj.watchers_count > filters[filter]) {
                        return false;
                    }
                    break;
                case "min_watchers_count":
                    if (obj.watchers_count < filters[filter]) {
                        return false;
                    }
                    break;
                case "max_open_issues":
                    if (obj.open_issues > filters[filter]) {
                        return false;
                    }
                    break;
                case "min_open_issues":
                    if (obj.open_issues < filters[filter]) {
                        return false;
                    }
                    break;
                case "languages":
                    if (
                        filters[filter]?.length > 0 &&
                        !filters[filter].find(
                            (language) => language == obj.language
                        )
                    ) {
                        return false;
                    }
                    break;
                case "licenses":
                    if (
                        filters[filter]?.length > 0 &&
                        !filters[filter].find(
                            (license) =>
                                license == obj?.license?.name ||
                                (license == "No License" && !obj?.license)
                        )
                    ) {
                        return false;
                    }
                    break;
                case "fork":
                    if (obj.fork != filters[filter]) {
                        return false;
                    }
                case "has_wiki":
                    if (obj.has_wiki != filters[filter]) {
                        return false;
                    }
                case "has_issues":
                    if (obj.has_issues != filters[filter]) {
                        return false;
                    }
                case "has_projects":
                    if (obj.has_projects != filters[filter]) {
                        return false;
                    }
                case "has_discussions":
                    if (obj.has_discussions != filters[filter]) {
                        return false;
                    }
                case "archived":
                    if (obj.archived != filters[filter]) {
                        return false;
                    }
            }
        }

        return true;
    });

    items.sort((a, b) => {
        let aVal = a[sort.type];
        let bVal = b[sort.type];

        if (typeof aVal == "string") aVal = aVal.toLowerCase();
        if (typeof bVal == "string") aVal = aVal.toLowerCase();

        if (aVal > bVal) return sort.isAscending ? 1 : -1;
        if (aVal < bVal) return sort.isAscending ? -1 : 1;
        return 0;
    });

    return items;
}
