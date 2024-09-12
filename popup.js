document.addEventListener('DOMContentLoaded', () => {
    const submitButton = document.getElementById('submit');
    const promptInput = document.getElementById('prompt');
    const responseElement = document.getElementById('response');

    if (submitButton && promptInput && responseElement) {
        submitButton.addEventListener('click', () => {
            const prompt = promptInput.value;

            // Collect selected checkbox values
            const checkboxes = document.querySelectorAll('input[name="options"]:checked');
            const selectedValues = [];
            checkboxes.forEach((checkbox) => {
                selectedValues.push(checkbox.value);
            });

            let chatPrompt = 'Your job is to read and effectively summarize terms and conditions or terms of use documents that are given to you. Pay special attention to ' + selectedValues.join(', ') + '. Your answer should be simply worded and on multiple different lines in a bullet point format. ';

            fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer code'
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
                    if (data.choices && data.choices.length > 0) {
                        responseElement.textContent = data.choices[0].message.content.trim();
                        responseElement.classList.add('filled');
                    } else {
                        responseElement.textContent = 'No response from API.';
                        responseElement.classList.remove('filled');
                    }
                })
                .catch(error => console.error('Error:', error));
        });
    } else {
        console.error('One or more elements not found in the DOM');
    }
});
