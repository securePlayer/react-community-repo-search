import { useState } from "react";
import Modal from "../modal/Modal";
import styles from "./QuickView.module.scss";
import { FaCopy } from "react-icons/fa";
import functions from "../../helpers/functions";
import starIcon from "../../images/star-icon.png";
import forkIcon from "../../images/fork-icon.png";
import eyeIcon from "../../images/eye-icon.png";

export default function QuickView({ post = {} }) {
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const openModal = () => {
        setModalIsOpen(true);
    };

    const closeModal = () => setModalIsOpen(false);

    return (
        <div>
            {/* Modal */}
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                header={post.name}
                bodyClassName={styles["modal-body"]}
                body={
                    <div className={styles["body-container"]}>
                        <div className={styles["copy-url-container"]}>
                            {[
                                {
                                    text: "Clone Url",
                                    url: post.clone_url,
                                },
                                {
                                    text: "SSH Url",
                                    url: post.ssh_url,
                                },
                                {
                                    text: "SVN Url",
                                    url: post.svn_url,
                                },
                            ].map((obj, idx) => {
                                return (
                                    <div
                                        key={idx}
                                        onClick={() => {
                                            functions.copyToClipboard(obj.url);
                                        }}
                                    >
                                        <span>{obj.text}</span>
                                        <FaCopy />
                                    </div>
                                );
                            })}
                        </div>

                        <div className={styles["stats-container"]}>
                            {[
                                {
                                    icon: starIcon,
                                    count: post.stargazers_count,
                                },
                                {
                                    icon: eyeIcon,
                                    count: post.watchers_count,
                                },
                                {
                                    icon: forkIcon,
                                    count: post.forks_count,
                                },
                            ].map((obj, idx) => {
                                return (
                                    <div key={idx}>
                                        <img src={obj.icon} />
                                        <span>{obj.count}</span>
                                    </div>
                                );
                            })}
                        </div>

                        {[
                            {
                                label: "Language",
                                value: post.language,
                            },
                            {
                                label: "License",
                                value: post.license?.name,
                                url: post.license?.url,
                            },
                            {
                                label: "Description",
                                value: post.description,
                            },
                            {
                                label: "Creation Date",
                                value: post.created_at,
                            },
                            {
                                label: "Last Update Date",
                                value: post.updated_at,
                            },
                            {
                                label: "Last Push Date",
                                value: post.pushed_at,
                            },
                            {
                                label: "What It Has",
                                value: [
                                    {
                                        text: "Issues",
                                        isTrue: post.has_issues,
                                    },
                                    {
                                        text: "Projects",
                                        isTrue: post.has_projects,
                                    },
                                    {
                                        text: "Downloads",
                                        isTrue: post.has_downloads,
                                    },
                                    {
                                        text: "Wiki",
                                        isTrue: post.has_wiki,
                                    },
                                    {
                                        text: "Pages",
                                        isTrue: post.has_pages,
                                    },
                                    {
                                        text: "Discussions",
                                        isTrue: post.has_discussions,
                                    },
                                ]
                                    .map((obj) => (obj.isTrue ? obj.text : ""))
                                    .filter((s) => s)
                                    .join(", "),
                            },
                        ].map((obj, idx) => {
                            return (
                                <div key={idx}>
                                    <h5 style={{ margin: "15px 0 5px 0" }}>
                                        {obj.label}
                                    </h5>
                                    <span
                                        onClick={() => {
                                            if (obj.url && window)
                                                window.open(obj.url, "_blank");
                                        }}
                                        style={{
                                            ...(obj.url
                                                ? {
                                                      textDecoration:
                                                          "underline",
                                                      cursor: "pointer",
                                                  }
                                                : {}),
                                        }}
                                    >
                                        {obj.value}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                }
                clearButton={{ label: "Close", onClick: closeModal }}
            />

            <button style={{ cursor: "pointer" }} onClick={openModal}>
                Quick View
            </button>
        </div>
    );
}
