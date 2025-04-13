// js/practice.js
// Logic for the dedicated coding practice page (practice.html)

// --- Globals for this page ---
let codeEditorInstance = null;
let isExecuting = false; // Prevent multiple simultaneous runs

// --- WARNING: INSECURE - API KEYS SHOULD NOT BE IN CLIENT-SIDE CODE ---
// In a real application, these calls should go through YOUR backend server,
// which then securely communicates with Judge0 and OpenRouter.
// --- Using your provided Judge0 Key ---
const JUDGE0_RAPIDAPI_KEY = "3cae548509msh4b1a1cabae6be57p1a00f2jsnbfb2593c5171"; // Your specific key
const JUDGE0_RAPIDAPI_HOST = "judge0-ce.p.rapidapi.com";
// --- The OpenRouter Key should be in ai_assistant.js ---
// --- END WARNING ---

// --- Initialization on Page Load ---
document.addEventListener('DOMContentLoaded', () => {
    console.log("Practice page loaded. Initializing full practice.js...");

    // 1. Check if CodeMirror library is loaded
    if (typeof CodeMirror === 'undefined') {
        console.error("CodeMirror library not found! Aborting initialization.");
        displayEditorError("Error: Code editor library failed to load. Please refresh the page or check script includes.");
        return;
    }

    // 2. Initialize CodeMirror Editor
    initializeCodeMirror();

    // 3. Setup Event Listeners for controls
    setupEventListeners();

    // 4. Optional: Get trackId from URL and display info
    displayTrackInfo();

    console.log("practice.js initialization complete.");

});

// --- Helper Functions ---

function displayEditorError(message) {
    const editorContainer = document.getElementById('code-editor-container');
    if(editorContainer) {
        editorContainer.innerHTML = `<p style='color: red; padding: 10px; border: 1px solid red;'>${message}</p>`;
    }
}

function initializeCodeMirror() {
    const editorContainer = document.getElementById('code-editor-container');
    if (!editorContainer) {
         console.error("Editor container element (#code-editor-container) not found!");
         // Optionally display an error message to the user in the UI
         alert("Critical Error: Cannot find the code editor container on the page.");
         return; // Stop initialization
    }

    try {
        codeEditorInstance = CodeMirror(editorContainer, {
            lineNumbers: true,
            mode: "python", // Default language mode
            theme: "material-darker", // Match the CSS theme link in practice.html
            value: "# Write your Python code here\nprint('Hello, Coder!')", // Default content
            indentUnit: 4,
            matchBrackets: true,
            autoCloseBrackets: true,
            lineWrapping: true,
            styleActiveLine: true // Highlights the current line
        });
        console.log("CodeMirror instance created successfully.");
        // Initial refresh might be needed sometimes for layout
        setTimeout(() => {
             if (codeEditorInstance) codeEditorInstance.refresh();
        }, 1);
    } catch (error) {
         console.error("Error initializing CodeMirror:", error);
         displayEditorError(`Error initializing CodeMirror: ${error.message}. Check console (F12) for details.`);
    }
}

function setupEventListeners() {
    const languageSelect = document.getElementById('language-select');
    const runCodeBtn = document.getElementById('run-code-btn');
    const getHintBtn = document.getElementById('get-hint-btn');
    const debugCodeBtn = document.getElementById('debug-code-btn');
    const reviewCodeBtn = document.getElementById('review-code-btn');

    if (languageSelect) {
        languageSelect.addEventListener('change', (e) => updateEditorLanguage(e.target.value));
        // Set initial language and placeholder based on dropdown default
        updateEditorLanguage(languageSelect.value);
    } else { console.warn("Language select dropdown not found."); }

    if (runCodeBtn) {
        runCodeBtn.addEventListener('click', handleRunCode);
    } else { console.warn("Run Code button not found."); }

    if (getHintBtn) {
        getHintBtn.addEventListener('click', handleGetHint);
    } else { console.warn("Get Hint button not found."); }

    if (debugCodeBtn) {
        debugCodeBtn.addEventListener('click', handleDebugCode);
    } else { console.warn("Debug Code button not found."); }

    if (reviewCodeBtn) {
        reviewCodeBtn.addEventListener('click', handleReviewCode);
    } else { console.warn("Review Code button not found."); }

     // Add listener for Enter key in stdin to potentially trigger Run Code (optional UX improvement)
     const stdinTextarea = document.getElementById('code-stdin');
     if (stdinTextarea) {
         stdinTextarea.addEventListener('keypress', (e) => {
             // Example: Run code if Ctrl+Enter is pressed in the stdin textarea
             if (e.key === 'Enter' && e.ctrlKey) {
                 console.log("Ctrl+Enter in stdin detected, running code...");
                 handleRunCode();
             }
         });
     }
}

function displayTrackInfo() {
     // Optional: Get trackId from URL
    const urlParams = new URLSearchParams(window.location.search);
    const trackId = urlParams.get('trackId');
    const trackNameSpan = document.getElementById('track-name');

    if (trackId && trackNameSpan) {
        console.log("Practice session started for track:", trackId);
        // You could potentially use this trackId to load specific context,
        // default language, or track progress later.
        // For now, just display the ID or a fetched name.
        // Example: Fetch track name from an API (if you have one)
        // fetchTrackDetails(trackId).then(name => trackNameSpan.textContent = name);
        // Simple display of ID:
        trackNameSpan.textContent = trackId.toUpperCase(); // Display the track ID nicely
    } else if (trackNameSpan) {
        trackNameSpan.textContent = "General Practice"; // Default if no trackId
    }
}

// --- Editor Functions ---
function updateEditorLanguage(lang) {
    if (!codeEditorInstance) {
        console.warn("Attempted to update language, but CodeMirror instance is not ready.");
        return;
    }

    let mode = "clike"; // Default for C, C++, Java
    let placeholderCode = `// Write your ${lang} code here\n`;

    switch (lang) {
        case 'python':
            mode = "python";
            placeholderCode = `# Write your Python code here\nprint("Hello from Python!")`;
            break;
        case 'java':
            mode = "text/x-java";
             placeholderCode = `// Write your Java code here\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello from Java!");\n    }\n}`;
            break;
        case 'cpp':
            mode = "text/x-c++src";
             placeholderCode = `// Write your C++ code here\n#include <iostream>\n\nint main() {\n    std::cout << "Hello from C++!" << std::endl;\n    return 0;\n}`;
            break;
        case 'c':
             mode = "text/x-csrc";
             placeholderCode = `// Write your C code here\n#include <stdio.h>\n\nint main() {\n    printf("Hello from C!\\n");\n    return 0;\n}`;
            break;
        case 'javascript':
            mode = "javascript";
             placeholderCode = `// Write your JavaScript code here (Node.js runtime)\nconsole.log("Hello from JavaScript!");`;
            break;
        // Add other languages if needed, ensure the corresponding mode JS is included in practice.html
    }

    console.log(`Setting editor mode to: ${mode} for language: ${lang}`);
    codeEditorInstance.setOption("mode", mode);

    // Set placeholder code only if the editor is empty or still contains a default placeholder
    const currentCode = codeEditorInstance.getValue().trim();
    const defaultPlaceholders = [
        "# Write your Python code here",
        "// Write your Java code here",
        "// Write your C++ code here",
        "// Write your C code here",
        "// Write your JavaScript code here",
        "# Welcome to the Practice Environment!" // Include temporary placeholder if removing temp script
    ];
    // Check if current code is empty or matches any known placeholder start
    if (!currentCode || defaultPlaceholders.some(p => currentCode.startsWith(p))) {
         codeEditorInstance.setValue(placeholderCode);
    }

    // Ensure the editor refreshes to apply mode changes immediately
    setTimeout(() => { if(codeEditorInstance) codeEditorInstance.refresh(); }, 1);
}


// --- Code Execution (Judge0 - Direct Client-Side - INSECURE) ---

async function handleRunCode() {
    if (isExecuting) {
        showOutputMessage("Code is already running. Please wait.", "status-processing");
        return;
    }
    if (!codeEditorInstance) {
        alert("Code editor is not initialized. Please refresh the page.");
        return;
    }

    const source_code = codeEditorInstance.getValue();
    const language = document.getElementById('language-select')?.value;
    const stdinValue = document.getElementById('code-stdin')?.value || '';
    const runButton = document.getElementById('run-code-btn'); // Get button to disable/enable

    if (!source_code.trim()) {
        alert("Please write some code to run.");
        return;
    }
    if (!language) {
        alert("Please select a language from the dropdown.");
        return;
    }
    // Check if the key is still the placeholder (it shouldn't be now, but good check)
    if (JUDGE0_RAPIDAPI_KEY === "YOUR_RAPIDAPI_JUDGE0_KEY" || !JUDGE0_RAPIDAPI_KEY) {
         alert("INTERNAL ERROR: Judge0 API Key is missing or is still the placeholder in practice.js.");
         showOutputMessage("Execution Error: API Key not configured.", "status-error");
         return;
    }


    // UI updates for running state
    showOutputMessage("Sending code to execution engine...", "status-processing");
    isExecuting = true;
    if(runButton) runButton.disabled = true; // Disable run button
    if(runButton) runButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Running...'; // Change button text/icon

    // Map frontend language names to Judge0 Language IDs
    // Ref: https://ce.judge0.com/languages
    const languageMap = {
        'python': 71, // Python 3.8.1
        'java': 62,   // Java OpenJDK 13.0.1
        'cpp': 54,    // C++ (GCC 9.2.0)
        'c': 50,      // C (GCC 9.2.0)
        'javascript': 63 // JavaScript (Node.js 12.14.0)
        // Add more mappings here if you added languages
    };
    const language_id = languageMap[language.toLowerCase()];

    if (!language_id) {
        showOutputMessage(`Error: Unsupported language selected: ${language}`, "status-error");
        resetExecutionState(runButton);
        return;
    }

     // --- Direct API Call using Fetch (INSECURE - Use a backend proxy in production) ---
    const options = {
        method: 'POST',
        headers: {
            'X-RapidAPI-Key': JUDGE0_RAPIDAPI_KEY, // *** YOUR KEY IS USED HERE ***
            'X-RapidAPI-Host': JUDGE0_RAPIDAPI_HOST,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            language_id: language_id,
            source_code: source_code,
            stdin: stdinValue,
            // You can add resource limits if needed (check Judge0 docs)
            // cpu_time_limit: 5, // seconds
            // memory_limit: 128000 // KB
        })
    };

    let submissionToken = null;
    try {
        // Use wait=false to get a token first for polling
        const postResponse = await fetch(`https://${JUDGE0_RAPIDAPI_HOST}/submissions?base64_encoded=false&wait=false&fields=*`, options);
        const postResult = await postResponse.json();

        // Improved error checking based on Judge0 response structure
        if (!postResponse.ok || postResult.status?.description === "Error" || postResult.error) {
            let errorDetail = postResult?.message || postResult?.error || postResult.status?.description || `Status ${postResponse.status}`;
            if (postResult?.compile_output) {
                 errorDetail = `Compilation Error:\n${postResult.compile_output}`;
            } else if (postResult?.stderr) {
                 errorDetail = `Runtime Error:\n${postResult.stderr}`;
            }
            throw new Error(`Submission failed: ${errorDetail}`);
        }

        if (!postResult.token) {
            // If no token but status is ok, something else went wrong
            console.error("Judge0 Submission OK but no token received:", postResult);
            throw new Error("Submission successful but failed to get execution token from Judge0.");
        }


        submissionToken = postResult.token;
        showOutputMessage(`Code submitted (token: ${submissionToken.substring(0,8)}...). Waiting for results...`, "status-processing");

        // Start polling for results
        pollForResult(submissionToken, runButton);

    } catch (error) {
        console.error("Error submitting code to Judge0:", error);
        showOutputMessage(`Submission Error:\n${error.message}`, "status-error");
        resetExecutionState(runButton);
    }

} // End of handleRunCode

async function pollForResult(token, runButton) {
    let attempts = 0;
    const maxAttempts = 25; // Poll for ~25 seconds max (adjust as needed)
    const pollInterval = 1000; // Poll every 1 second

    const poll = async () => {
        if (!isExecuting) { // Check if execution was cancelled or errored out
            console.log("Polling stopped because execution state is false.");
            return;
        }
        if (attempts >= maxAttempts) {
            showOutputMessage(`Polling Timeout:\nCould not get results within ${maxAttempts} seconds. Execution might have taken too long or failed silently.`, "status-error", 'orange'); // Use orange border for timeout
            resetExecutionState(runButton);
            return;
        }
        attempts++;
        // Keep the "waiting for results" message during polling, or update with attempt count
        // showOutputMessage(`Polling for results... (Attempt ${attempts}/${maxAttempts})`, "status-processing");

        const getOptions = {
            method: 'GET',
             headers: {
                 'X-RapidAPI-Key': JUDGE0_RAPIDAPI_KEY, // *** YOUR KEY IS USED HERE ***
                 'X-RapidAPI-Host': JUDGE0_RAPIDAPI_HOST
             }
        };

        try {
            // Fetch submission details using the token
            const getResponse = await fetch(`https://${JUDGE0_RAPIDAPI_HOST}/submissions/${token}?base64_encoded=false&fields=*`, getOptions);
            const result = await getResponse.json();

             if (!getResponse.ok) {
                // Judge0 might return errors during polling (e.g., token expired, rate limit)
                const errorDetail = result?.message || result?.error || `Polling Status ${getResponse.status}`;
                // Don't necessarily stop polling on first error, could be transient
                console.warn(`Polling attempt ${attempts} failed: ${errorDetail}. Retrying...`);
                 if (attempts < maxAttempts) { // Only retry if not timed out
                    setTimeout(poll, pollInterval);
                 } else {
                    throw new Error(`Polling failed after multiple attempts: ${errorDetail}`);
                 }
                return; // Skip processing this attempt
            }

            // Judge0 Status IDs: 1=In Queue, 2=Processing
            if (result.status?.id === 1 || result.status?.id === 2) {
                // Still running, poll again after the interval
                setTimeout(poll, pollInterval);
            } else {
                // Execution finished (or errored), process the final result
                console.log("Execution Result Received:", result);
                processJudge0Result(result); // Display the final result
                resetExecutionState(runButton); // Re-enable button etc.
            }
        } catch (error) {
             console.error("Error polling Judge0 results:", error);
             showOutputMessage(`Polling Error:\n${error.message}`, "status-error");
             resetExecutionState(runButton); // Stop polling and reset state on error
        }
    };

    // Start the first poll attempt
    setTimeout(poll, pollInterval);
}

function processJudge0Result(result) {
    let statusDescription = result.status?.description || 'Status Unknown';
    let outputText = `Status: ${statusDescription}\n`;
    let statusClass = 'status-unknown'; // Default CSS class
    let borderColor = '#ccc'; // Default border color

    // Add time and memory if available and valid numbers
     if (result.time !== null && typeof result.time === 'number') {
        outputText += `Time: ${result.time.toFixed(3)}s\n`; // More precision
    }
     if (result.memory !== null && typeof result.memory === 'number') {
        outputText += `Memory: ${(result.memory / 1024).toFixed(2)} MB\n`; // Convert KB to MB
    }
    outputText += "--------------------\n"; // Separator

    const statusId = result.status?.id;

    // Determine output/error and set styling based on Status ID
    if (statusId === 6) { // Compilation Error
        outputText += `Compile Error:\n${result.compile_output || '(No details provided)'}`;
        borderColor = 'orange';
        statusClass = 'status-compile-error';
    } else if (result.stderr) { // Check stderr first for runtime errors
         outputText += `Runtime Error (stderr):\n${result.stderr}`;
         borderColor = 'red';
         statusClass = 'status-runtime-error';
         // If stderr is present, status description might be misleading, stick to stderr
         statusDescription = "Runtime Error";
         outputText = `Status: ${statusDescription}\n` + outputText.substring(outputText.indexOf('\n')+1); // Update status line
    } else if (statusId === 3) { // Accepted
        outputText += `Output (stdout):\n${result.stdout !== null ? result.stdout : '(No output produced)'}`;
        borderColor = 'green';
        statusClass = 'status-accepted';
    } else if (statusId === 4) { // Wrong Answer
        outputText += `Output (stdout):\n${result.stdout !== null ? result.stdout : '(No output produced)'}`;
        // Note: This assumes "Wrong Answer" is determined elsewhere (e.g., comparing against expected output).
        // Judge0 itself just runs the code. For a simple run, treat it like Accepted if no errors.
        // For now, we'll style based on the *status* if it's explicitly WA.
        borderColor = 'red';
        statusClass = 'status-error'; // Generic error styling for WA
    } else if (statusId === 5) { // Time Limit Exceeded
        outputText += `(No output shown due to Time Limit Exceeded)`;
        borderColor = 'red';
        statusClass = 'status-error';
    } else if (statusId >= 7 && statusId <= 12) { // Memory Limit, Illegal Operation etc.
         outputText += `(Execution Failed: ${statusDescription})`;
         borderColor = 'red';
         statusClass = 'status-error';
    } else if (statusId === 13) { // Internal Error (Judge0 side)
         outputText += `Judge0 Internal Error:\n${result.message || result.stderr || '(No specific details)'}`;
          borderColor = 'red';
         statusClass = 'status-error';
    } else if (result.stdout !== null && typeof result.stdout !== 'undefined') { // Some other status, but has stdout
         outputText += `Output (stdout):\n${result.stdout}`;
         borderColor = '#cc0'; // Maybe yellow/warning for unknown status with output
         statusClass = 'status-unknown';
    }
    else { // Fallback for truly unknown states
        outputText += "(No specific output or error details received)";
        borderColor = '#ccc';
        statusClass = 'status-unknown';
    }

    // Display the final formatted text and apply styles
    showOutputMessage(outputText, statusClass, borderColor);
}

// Helper to update output area and style
function showOutputMessage(message, statusClass = 'status-unknown', borderColor = '#ccc') {
    const outputContent = document.getElementById('output-content');
    const outputArea = document.getElementById('output-area');
    if (outputContent) {
        // Replace null characters which can cause display issues
        const cleanMessage = message.replace(/\u0000/g, '');
        outputContent.textContent = cleanMessage;
        outputContent.className = statusClass; // Apply CSS class for text styling
    }
    if (outputArea) {
        outputArea.style.borderColor = borderColor; // Set border color
    }
}

// Helper to reset button and execution flag
function resetExecutionState(runButton) {
     isExecuting = false;
     if (runButton) {
         runButton.disabled = false;
         runButton.innerHTML = '<i class="fas fa-play"></i> Run Code'; // Reset button text/icon
     }
     console.log("Execution state reset.");
}


// --- AI Feature Handlers (Using OpenRouter via callOpenRouter from ai_assistant.js) ---

// Helper function to update AI feedback area
function showAiFeedback(message, isLoading = false) {
    const aiContent = document.getElementById('ai-content');
    if (!aiContent) {
        console.error("AI content area not found!");
        return;
    }
    if (isLoading) {
        aiContent.innerHTML = `<i><i class="fas fa-spinner fa-spin"></i> ${message}</i>`;
    } else {
        // Basic escaping and preserve line breaks for <pre> tag
        const formattedMessage = message.replace(/</g, "<").replace(/>/g, ">");
        // Wrap actual response in <pre> for better code formatting
        // Add check to avoid wrapping loading/error messages in <pre>
        if (!isLoading && !message.includes("Error:") && !message.includes("Getting ") && !message.includes("Debugging ") && !message.includes("Reviewing ")) {
             aiContent.innerHTML = `<pre>${formattedMessage}</pre>`;
        } else {
            aiContent.innerHTML = formattedMessage; // Display errors/loading messages directly
        }
    }
}


async function handleGetHint() {
    if (typeof callOpenRouter === 'undefined') {
       showAiFeedback(`<strong class="error-message">❌ Error: AI assistant function (callOpenRouter) not found. Check if ai_assistant.js is loaded correctly before practice.js.</strong>`);
       return;
    }
    showAiFeedback("Getting hint from AI... Please wait.", true);

    try {
        // Simple prompt as we don't have specific problem context easily available here
        const messages = [
            {
                role: "system",
                content: "You are a helpful programming assistant. Provide a concise, general hint for common programming challenges or algorithmic thinking. Avoid giving full solutions or large code blocks."
            },
            {
                role: "user",
                content: "I'm working on a coding problem and feeling stuck. Can you give me a general conceptual hint or suggest an algorithmic approach I might need to consider for typical practice problems? Keep it brief and high-level."
            }
        ];

        const hint = await callOpenRouter(messages);
        // Prepend the title outside the <pre> tag for better structure
        showAiFeedback(`<strong>💡 AI Hint:</strong>\n${hint}`);

    } catch (error) {
        console.error("Hint Error:", error);
        showAiFeedback(`<strong class="error-message">❌ Error getting hint:</strong> ${error.message}. Check console/network tab for details.`);
    }
}

async function handleDebugCode() {
    if (!codeEditorInstance) { alert("Code editor is not ready."); return; }
     if (typeof callOpenRouter === 'undefined') {
       showAiFeedback(`<strong class="error-message">❌ Error: AI assistant function (callOpenRouter) not found.</strong>`);
       return;
    }

    const code = codeEditorInstance.getValue();
    const language = document.getElementById('language-select')?.value || 'code'; // Get selected language

    if (!code || !code.trim()) {
        alert("Please write some code in the editor to debug.");
        return;
    }

    showAiFeedback(`Debugging ${language} code with AI... This might take a moment.`, true);

    try {
        const messages = [
             {
                role: "system",
                content: `You are a code debugging assistant. Analyze the provided ${language} code snippet. Identify potential bugs, logic errors, or runtime issues. Explain each issue clearly and concisely. Suggest specific fixes or areas to check. Use markdown for code blocks if suggesting corrections.`
            },
            {
                role: "user",
                content: `Please debug the following ${language} code. List potential bugs, explain why they are bugs, and suggest corrections:\n\n\`\`\`${language}\n${code}\n\`\`\`\n`
            }
        ];

        const debugSuggestions = await callOpenRouter(messages);
         // Prepend the title outside the <pre> tag
        showAiFeedback(`<strong>🐞 AI Debugging Suggestions:</strong>\n${debugSuggestions}`);

    } catch (error) {
        console.error("Debug Error:", error);
        showAiFeedback(`<strong class="error-message">❌ Error debugging code:</strong> ${error.message}. Check console/network tab for details.`);
    }
}

async function handleReviewCode() {
     if (!codeEditorInstance) { alert("Code editor is not ready."); return; }
    if (typeof callOpenRouter === 'undefined') {
       showAiFeedback(`<strong class="error-message">❌ Error: AI assistant function (callOpenRouter) not found.</strong>`);
       return;
    }

    const code = codeEditorInstance.getValue();
    const language = document.getElementById('language-select')?.value || 'code'; // Get selected language

    if (!code || !code.trim()) {
        alert("Please write some code in the editor to review.");
        return;
    }

    showAiFeedback(`Reviewing ${language} code quality with AI... Please wait.`, true);

    try {
         const messages = [
             {
                role: "system",
                content: `You are a code review assistant. Analyze the provided ${language} code snippet for code quality, style (e.g., naming conventions, formatting consistency), potential improvements, and adherence to common best practices for ${language}. Provide actionable feedback using markdown formatting.`
            },
            {
                role: "user",
                content: `Please review the following ${language} code for quality, style, best practices, and potential improvements:\n\n\`\`\`${language}\n${code}\n\`\`\`\n`
            }
        ];

        const reviewFeedback = await callOpenRouter(messages);
         // Prepend the title outside the <pre> tag
        showAiFeedback(`<strong>✨ AI Code Review Feedback:</strong>\n${reviewFeedback}`);

    } catch (error) {
        console.error("Review Error:", error);
        showAiFeedback(`<strong class="error-message">❌ Error reviewing code:</strong> ${error.message}. Check console/network tab for details.`);
    }
}