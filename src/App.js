import { useState } from "react";
import Manual from "./pages/manual/Manual";
import Ai from "./pages/ai/Ai";
import styles from "./App.module.scss";

export default function App() {
    const [page, setPage] = useState("main");

    let component;
    switch (page) {
        case "main":
            component = (
                <div style={{ textAlign: "center" }}>
                    <h3>Which method would you like to choose?</h3>

                    <div className={styles["options"]}>
                        <div onClick={() => setPage("ai")}>Search by AI</div>
                        <div onClick={() => setPage("manual")}>
                            Search Manually
                        </div>
                    </div>
                </div>
            );
            break;
        case "manual":
            component = <Manual setPage={setPage} />;
            break;
        case "ai":
            component = <Ai setPage={setPage} />;
            break;
    }

    return (
        <div className={styles["container"]}>
            {/* Title */}
            <h1 style={{ textAlign: "center" }}>
                React JS Community Repositories
            </h1>

            <div className={styles["content"]}>{component}</div>
        </div>
    );
}
