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

            fetch('http://localhost:4000/api', { // Changed URL to your local server
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt: prompt,
                    selectedValues: selectedValues
                })
            })
                .then(response => response.json())
                .then(data => {
                    if (data.choices && data.choices.length > 0) {
                        responseElement.textContent = data.choices[0].message.content.trim();
                        responseElement.classList.add('filled'); // dealing with the css from the responses
                        // ^ this is the one that is going to run basically all of the time
                    } else if (data.error) {
                        responseElement.textContent = 'Error: ' + data.error.message;
                        responseElement.classList.remove('filled');
                    } else {
                        responseElement.textContent = 'No response from API.';
                        responseElement.classList.remove('filled');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    responseElement.textContent = 'An error occurred.';
                    responseElement.classList.remove('filled');
                });
        });
    } else {
        console.error('One or more elements not found in the DOM');
    }
});
