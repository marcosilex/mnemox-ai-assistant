const chatContainer = document.getElementById('chat-container');
const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const settingsBtn = document.getElementById('settings-btn');
const settingsPanel = document.getElementById('settings-panel');
const apiKeyInput = document.getElementById('api-key-input');
const saveKeyBtn = document.getElementById('save-key-btn');

// Carrega o histórico e a chave do localStorage se existir
let messageHistory = JSON.parse(localStorage.getItem('jwlIA_history')) || [];
let userApiKey = localStorage.getItem('jwlIA_api_key') || '';

if (userApiKey) apiKeyInput.value = userApiKey;

// Alternar painel de configurações
settingsBtn.addEventListener('click', () => {
    settingsPanel.classList.toggle('hidden');
});

// Salvar chave de API
saveKeyBtn.addEventListener('click', () => {
    userApiKey = apiKeyInput.value.trim();
    localStorage.setItem('jwlIA_api_key', userApiKey);
    alert('Configurações salvas!');
    settingsPanel.classList.add('hidden');
});

function appendMessage(role, content, isHistory = false) {
    const wrapper = document.createElement('div');
    wrapper.classList.add('message-wrapper');
    wrapper.classList.add(role === 'user' ? 'user-wrapper' : 'bot-wrapper');

    const avatar = document.createElement('div');
    avatar.classList.add('bot-avatar');
    avatar.innerText = role === 'user' ? 'U' : 'J';
    if (role === 'user') avatar.style.background = 'rgba(255,255,255,0.1)';

    const bubble = document.createElement('div');
    bubble.classList.add('message-bubble');
    bubble.innerText = content;

    wrapper.appendChild(avatar);
    wrapper.appendChild(bubble);
    chatContainer.appendChild(wrapper);

    // Auto scroll apenas se estivermos enviando agora (não no load do histórico)
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Renderiza o histórico inicial
if (messageHistory.length > 0) {
    // Remove a mensagem de boas-vindas padrão se houver histórico
    const welcome = document.querySelector('.welcome-message');
    if (welcome) welcome.remove();

    messageHistory.forEach(msg => appendMessage(msg.role, msg.content, true));
}

function saveHistory() {
    localStorage.setItem('jwlIA_history', JSON.stringify(messageHistory));
}

chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = userInput.value.trim();
    if (!text) return;

    // Adiciona mensagem do usuário na tela e no histórico
    appendMessage('user', text);
    messageHistory.push({ role: 'user', content: text });
    saveHistory();
    userInput.value = '';

    // Indicador de digitação
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'typing';
    typingIndicator.innerText = 'JwlIA está pensando...';
    chatContainer.appendChild(typingIndicator);
    chatContainer.scrollTop = chatContainer.scrollHeight;

    try {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': userApiKey ? `Bearer ${userApiKey}` : ''
            },
            body: JSON.stringify({
                messages: messageHistory
            })
        });

        const data = await response.json();

        // Remove indicador de digitação
        if (typingIndicator.parentNode) chatContainer.removeChild(typingIndicator);

        if (data.response) {
            appendMessage('assistant', data.response);
            messageHistory.push({ role: 'assistant', content: data.response });
            saveHistory();
        } else {
            appendMessage('assistant', 'Ops, tive um probleminha. Verifique se sua chave da API está correta.');
        }
    } catch (error) {
        if (typingIndicator.parentNode) chatContainer.removeChild(typingIndicator);
        appendMessage('assistant', 'Erro de conexão com o servidor.');
        console.error(error);
    }
});
