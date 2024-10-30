import { useEffect, useState } from "react";
import InputArea from "../../components/inputArea/InputArea";
import styles from "./Ai.module.scss";
import TextInput from "../../components/textInput/TextInput";
import { useDispatch, useSelector } from "react-redux";
import { fetchDataWithQuery as getRepos } from "../../redux/slices/repo.slice";
import { fetchDataWithQuery } from "../../redux/slices/ai.slice";

import functions from "../../helpers/functions";
import QuickView from "../../components/quickView/QuickView";

export default function Ai({ setPage }) {
    const [description, setDescription] = useState();
    const [isSingle, setIsSingle] = useState(true);
    const dispatch = useDispatch();

    let {
        items,
        loading,
        error,
    } = useSelector((state) => state.data);
    let {
        loading: aiLoading,
        error: aiError,
        aiResponse: aiResponse_reduxStore,
    } = useSelector((state) => state.ai);

    useEffect(() => {
        dispatch(getRepos({ param: { per_page: 100 } }));
    }, []);

    let aiResponse_json = [];
    if (aiResponse_reduxStore) {
        aiResponse_json = functions.extractJSON(aiResponse_reduxStore);

        if (!aiResponse_json)
            console.log("Gemini failed to generate in the correct format");
        else {
            // Making sure that the data is in array format.
            // Object format will be placed inside an array is not an array yet.
            if (!Array.isArray(aiResponse_json)) {
                aiResponse_json = [aiResponse_json];
            }
        }
    }

    return (
        <div className={styles.container}>
            <div
                className={styles["ai-search"]}
                onClick={() => setPage("manual")}
            >
                Try Manual Search
            </div>

            {/* Inputs */}
            <div className={styles["input-container"]}>
                {/* Repo Description */}
                <InputArea
                    onInputChange={(e) => {
                        setDescription(e.target.value);
                    }}
                    placeholder={
                        "Describe the repository that you are looking for."
                    }
                    value={description}
                />

                {/* Number of Results to Display */}
                <div className={styles["total-results-container"]}>
                    <div style={{ marginBottom: "10px" }}>Select your preferred search result size:</div>

                    <div className={styles["selections"]} style={{ marginBottom: "10px" }}>
                        <div
                            className={isSingle ? styles["selected"] : ""}
                            onClick={() => {
                                setIsSingle(true);
                            }}
                        >
                            Single - I want the best repository suitable for me!
                        </div>

                        <div
                            className={!isSingle ? styles["selected"] : ""}
                            onClick={() => {
                                setIsSingle(false);
                            }}
                        >
                            Multiple - I want top repositories suitable for me!
                        </div>
                    </div>
                </div>

                {/* Execute */}
                <button
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                        // give context of list of all repo details
                        let context = `List of All Github Repositories Info:
                     
                    ${JSON.stringify(
                        items.map((obj) => {
                            let necessaryInfo = {};
                            [
                                "name",
                                "full_name",
                                "private",
                                "description",
                                "fork",
                                "created_at",
                                "updated_at",
                                "pushed_at",
                                "git_url",
                                "ssh_url",
                                "clone_url",
                                "svn_url",
                                "size",
                                "stargazers_count",
                                "watchers_count",
                                "forks_count",
                                "language",
                                "has_issues",
                                "has_projects",
                                "has_downloads",
                                "has_wiki",
                                "has_pages",
                                "has_discussions",
                                "archived",
                                "disabled",
                                "open_issues_count",
                                "license",
                                "allow_forking",
                                "web_commit_signoff_required",
                                "visibility",
                                "default_branch",
                                "is_template",
                            ].map(
                                (propertyName) =>
                                    (necessaryInfo[propertyName] =
                                        obj?.[propertyName])
                            );

                            return necessaryInfo;
                        })
                    )}`;

                        // instruction
                        let singleRepoInstr = `help me find one most suitable repository for my needs that I'm looking for. Provide valid reasons to why the chosen repository is the best for my needs.`;
                        let multiRepoInstr = `help me find more than one but at most 5 most suitable repositories for my needs that I'm looking for. Provide valid reasons to why each chosen repositories are the most suitable for my needs.`;
                        let prompt = `Repository Description Im Looking For:
                    ${description}
                    
                    By only using the list of github repositories I listed in JSON above and based on my repository description I mentioned above, ${
                        isSingle ? singleRepoInstr : multiRepoInstr
                    } Respond only in the JSON format below: ${
                            isSingle
                                ? `{"repository_name": "", "reasons":["","",...]}`
                                : `[{"repository_name": "", "reasons":["","",...]},...]`
                        }`;
                        dispatch(fetchDataWithQuery({ prompt, context }));
                    }}
                >
                    Execute
                </button>
            </div>

            {/* Output */}
            {loading || aiLoading? (<div>Loading...</div>):(error || aiError? (<div>{error}</div>):"")}

            {aiResponse_json && aiResponse_json.length > 0 && (
                <div className={styles["output-container"]}>
                    {/* Header */}
                    <h2 className={styles["output-header"]}>Results</h2>

                    {/* List */}
                    {aiResponse_json.map((data, idx) => {
                        let name = data.repository_name;
                        let reasons = data.reasons ? data.reasons : [];
                        let repoData = items.find((obj) => obj.name == name);
                        let isOdd = idx % 2 !== 0;

                        return (
                            <div
                                className={styles["output-item-container"]}
                                style={{
                                    ...(isOdd ? { background: "#efefef" } : {}),
                                }}
                                key={idx}
                            >
                                <div
                                    className={
                                        styles["output-item-top-container"]
                                    }
                                >
                                    <div
                                        className={
                                            styles["output-item-name-container"]
                                        }
                                    >
                                        <div
                                            className={
                                                styles["output-name-label"]
                                            }
                                        >
                                            Name:
                                        </div>
                                        <div>{name}</div>
                                    </div>

                                    <QuickView post={repoData} />
                                </div>

                                <div
                                    className={
                                        styles["output-item-bottom-container"]
                                    }
                                >
                                    <div
                                        className={
                                            styles["output-reasons-label"]
                                        }
                                    >
                                        Reasons:
                                    </div>
                                    {reasons.map((reason, idx) => {
                                        return <div key={idx}>{reason}</div>;
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
