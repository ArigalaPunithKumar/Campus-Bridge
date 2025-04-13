// js/ai_assistant.js

/**
 * Calls the OpenRouter API with a structured prompt.
 * @param {Array<object>} messages - The message history/prompt structured for the chat API. Example: [{ role: "user", content: "Your prompt here" }]
 * @param {string} [model=DEFAULT_AI_MODEL] - The specific model to use on OpenRouter (defaults to the one in config.js).
 * @returns {Promise<string>} - A promise that resolves with the AI's response text.
 * @throws {Error} - Throws an error if the API call fails or the response is not okay.
 */
async function callOpenRouter(messages, model = DEFAULT_AI_MODEL) {
    // Check if the API key is available from config.js
    // Note: Ensure config.js is loaded BEFORE this script in your HTML.
    if (typeof OPENROUTER_API_KEY === 'undefined' || !OPENROUTER_API_KEY) {
        console.error("OpenRouter API key is missing or config.js is not loaded correctly.");
        throw new Error("OpenRouter API key is not configured.");
    }
    if (!messages || messages.length === 0) {
        throw new Error("Messages array cannot be empty.");
    }

    console.log(`Calling OpenRouter with model: ${model}`);
    // console.log("Sending messages:", JSON.stringify(messages, null, 2)); // Uncomment for debugging prompts

    try {
        const response = await fetch(OPENROUTER_API_URL, { // URL from config.js
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`, // Key from config.js
                'Content-Type': 'application/json',
                // Recommended headers by OpenRouter (using variables from config.js)
                'HTTP-Referer': typeof YOUR_SITE_URL !== 'undefined' ? YOUR_SITE_URL : '',
                'X-Title': typeof YOUR_APP_NAME !== 'undefined' ? YOUR_APP_NAME : ''
            },
            body: JSON.stringify({
                model: model,
                messages: messages,
                // Optional parameters (adjust as needed):
                // temperature: 0.7, // Controls randomness (0=deterministic, 1=more random)
                // max_tokens: 500, // Max length of the response
            })
        });

        if (!response.ok) {
            const errorBody = await response.text(); // Get error details if possible
            console.error("OpenRouter API Error Response:", errorBody);
            // Try to parse the error body for a more specific message
            let detail = errorBody;
            try {
                const errorJson = JSON.parse(errorBody);
                if (errorJson.error && errorJson.error.message) {
                    detail = errorJson.error.message;
                }
            } catch (parseError) { /* Ignore if it's not JSON */ }
            throw new Error(`API request failed: ${response.status} ${response.statusText}. Detail: ${detail}`);
        }

        const data = await response.json();

        // console.log("OpenRouter Raw Response:", data); // Uncomment for debugging

        if (data.choices && data.choices.length > 0 && data.choices[0].message && data.choices[0].message.content) {
            return data.choices[0].message.content.trim();
        } else {
            console.error("Unexpected response structure from OpenRouter:", data);
            throw new Error("Failed to parse response from AI model. Check console for details.");
        }

    } catch (error) {
        console.error('Error calling OpenRouter:', error);
        // Rethrow the error so the calling function (in student.js) can handle UI updates
        throw error;
    }
}

// Note: This function 'callOpenRouter' isn't automatically global.
// student.js will be able to use it because they will both be loaded
// into the same HTML page scope (dashboard.html).