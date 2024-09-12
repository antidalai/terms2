chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("Received message in background script:", request); // Debugging line
    if (request.action === "fetchAPI") {
        const chatPrompt = request.chatPrompt;
        const prompt = request.prompt;

        fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer code`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [
                    { role: "system", content: chatPrompt },
                    { role: "user", content: prompt }
                ],
                max_tokens: 200
            })
        })
            .then(response => response.json())
            .then(data => {
                console.log("API response received:", data); // Debugging line
                if (data.choices && data.choices.length > 0) {
                    sendResponse({ success: true, content: data.choices[0].message.content.trim() });
                } else {
                    sendResponse({ success: false, error: 'No response from API.' });
                }
            })
            .catch(error => {
                console.error('Error:', error);
                sendResponse({ success: false, error: error.message });
            });

        // Return true to indicate that the response will be sent asynchronously
        return true;
    }
});
