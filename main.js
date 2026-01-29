
const promptInput = document.getElementById('prompt-input');
const sendButton = document.getElementById('send-button');
const chatContainer = document.getElementById('chat-container');

const sendMessage = () => {
    const prompt = promptInput.value;
    if (prompt.trim() === '') return;

    // Create and display user message
    const userMessage = document.createElement('div');
    userMessage.classList.add('message', 'user-message');
    userMessage.textContent = prompt;
    chatContainer.appendChild(userMessage);

    // Clear input
    promptInput.value = '';

    // Simulate model response (for now)
    const modelMessage = document.createElement('div');
    modelMessage.classList.add('message', 'model-message');
    modelMessage.textContent = 'This is a placeholder response from the model.';
    chatContainer.appendChild(modelMessage);

    // Scroll to the bottom
    chatContainer.scrollTop = chatContainer.scrollHeight;
};

sendButton.addEventListener('click', sendMessage);

promptInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault(); // Prevent new line on Enter
        sendMessage();
    }
});
