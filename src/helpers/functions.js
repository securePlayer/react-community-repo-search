import axios from "axios";
const {
    GoogleGenerativeAI,
  } = require("@google/generative-ai");

export default {
    getMinMaxListNumberProperties,
    highlightString,
    copyToClipboard,
    fetchGitHubRepos,
    callGemini,
    extractJSON
};

function reverseString(str) {
    return str.split('') // Split the string into an array of characters
              .reverse() // Reverse the array
              .join(''); // Join the array back into a string
}

function extractJSON(str = "") {
    // remove newlines
    str = str.replace(/\n/g, "");

    let firstBracket = str.indexOf("[");
    let firstCurlyBracket = str.indexOf("{");
    let firstEndBracket = reverseString(str).indexOf("]");
    let firstEndCurlyBracket = reverseString(str).indexOf("}");

    let startPos = firstBracket < firstCurlyBracket? firstBracket:firstCurlyBracket;
    let endPos = str.length - (firstEndBracket < firstEndCurlyBracket? firstEndBracket:firstEndCurlyBracket);
    
    str = str.substring(startPos, endPos)

    try {
        return JSON.parse(str);
    } catch (e) {
        console.error("Invalid JSON:", str);
        return null; // or handle the error as needed
    };
}

async function callGemini({ prompt, context }) {
    const apiKey = "AIzaSyA_foK3GddlDl3IyiYmGV5VQC2YOJJqWjw";
    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
    });

    const generationConfig = {
        temperature: 1,
        topP: 0.95,
        topK: 64,
        maxOutputTokens: 8192,
        responseMimeType: "text/plain",
    };

    async function run() {
        const chatSession = model.startChat({
            generationConfig,

            history:  context? [
                    {
                        role: "user",
                        parts: [{ text: context }],
                    },
                    // {
                    //     role: "model",
                    //     parts: [{ text: "ok" }],
                    // },
                ]:[],
        });

        const result = await chatSession.sendMessage(prompt);
        return result;
    }

    let result = await run();
    result = result?.response?.text();
    return result;
}

async function fetchGitHubRepos(queryParams) {
    const GITHUB_TOKEN =
        "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";

    const config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `https://api.github.com/orgs/reactjs/repos`,
        params: queryParams?.param,
        headers: {
            Accept: "application/vnd.github+json",
            Authorization: `Bearer ${GITHUB_TOKEN}`,
            "X-GitHub-Api-Version": "2022-11-28",
        },
    };

    // Make the API request using Axios
    const response = await axios.request(config);
    return response.data;
}

function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard
            .writeText(text)
            .then(() => {
                console.log("Text copied to clipboard successfully!");
            })
            .catch((err) => {
                console.error("Failed to copy text: ", err);
            });
    } else {
        fallbackCopyToClipboard(text);
    }
}

function fallbackCopyToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;

    // Prevent scrolling to bottom of page in MS Edge.
    textArea.style.position = "fixed";
    document.body.appendChild(textArea);

    // Select the text
    textArea.select();
    document.execCommand("copy");

    document.body.removeChild(textArea);

    console.log("Text copied to clipboard successfully using fallback method!");
}

function highlightString(string, wordList) {
    wordList = wordList.filter((s, idx, arr) => arr.indexOf(s) == idx);

    let result = [string];
    for (let word of wordList) {
        // loop through the result to highlight the matching strings
        result = result.flatMap((ele, idx) => {
            if (typeof ele == "string") {
                if (ele.includes(word)) {
                    // split and replace
                    let chunks = ele.split(word);
                    let newEle = [];
                    chunks.map((chunk, innerIdx) => {
                        newEle.push(chunk);
                        if (innerIdx < chunks.length - 1) {
                            const date = new Date();
                            const timestamp = date.getTime();

                            newEle.push(
                                <span
                                    key={timestamp + "" + word}
                                    style={{
                                        background: "yellow",
                                    }}
                                >
                                    <strong>{word}</strong>
                                </span>
                            );
                        }
                    });
                    return newEle;
                }
                return ele;
            }
            return ele;
        });
    }
    return result;
}

function getMinMaxListNumberProperties(arr) {
    // getting the min and max value of each
    // number properties in an object of each element
    return arr.reduce((acc, obj) => {
        for (const key in obj) {
            // checking if the value is a number
            if (isNaN(Math.min(obj[key], parseFloat(obj[key])))) {
                continue;
            }

            if (!acc[key]) {
                // Initialize min and max for the property
                acc[key] = { min: obj[key], max: obj[key] };
            } else {
                // Update min and max
                acc[key].min = Math.min(acc[key].min, obj[key]);
                acc[key].max = Math.max(acc[key].max, obj[key]);
            }
        }
        return acc;
    }, {});
}
