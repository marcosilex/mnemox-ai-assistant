const chatContainer = document.getElementById('chat-container');
const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const settingsBtn = document.getElementById('settings-btn');
const settingsPanel = document.getElementById('settings-panel');
const apiKeyInput = document.getElementById('api-key-input');
const aiNameInput = document.getElementById('ai-name-input');
const aiPersonaInput = document.getElementById('ai-persona-input');
const aiProviderSelect = document.getElementById('ai-provider-select');
const aiModelSelect = document.getElementById('ai-model-select');
const saveKeyBtn = document.getElementById('save-key-btn');
const clearChatBtn = document.getElementById('clear-chat-btn');
const resetConfigBtn = document.getElementById('reset-config-btn');
const exportChatBtn = document.getElementById('export-chat-btn');
const headerTitle = document.querySelector('header h1');

// Carrega as configurações do localStorage
let messageHistory = JSON.parse(localStorage.getItem('jwlIA_history')) || [];
let userApiKey = localStorage.getItem('jwlIA_api_key') || '';
let aiName = localStorage.getItem('jwlIA_name') || 'JwlIA';
let aiPersona = localStorage.getItem('jwlIA_persona') || 'Você é JwlIA, uma assistente pessoal inteligente e prestativa.';
let aiProvider = localStorage.getItem('jwlIA_provider') || 'https://api.openai.com/v1';
let aiModel = localStorage.getItem('jwlIA_model') || 'gpt-4o-mini';

// Inicializa os campos da UI
function initUI() {
    if (userApiKey) apiKeyInput.value = userApiKey;
    aiNameInput.value = aiName;
    aiPersonaInput.value = aiPersona;
    aiProviderSelect.value = aiProvider;
    aiModelSelect.value = aiModel;
    headerTitle.innerText = aiName;
    userInput.placeholder = `Conversar com ${aiName}...`;

    const initialWelcome = document.querySelector('.welcome-message .message-bubble p');
    if (initialWelcome && messageHistory.length === 0) {
        initialWelcome.innerText = `Olá! Eu sou a ${aiName}. Como posso te ajudar hoje?`;
    }
}

initUI();

// Alternar painel de configurações
settingsBtn.addEventListener('click', () => {
    settingsPanel.classList.toggle('hidden');
});

// Salvar todas as configurações
saveKeyBtn.addEventListener('click', () => {
    userApiKey = apiKeyInput.value.trim();
    aiName = aiNameInput.value.trim() || 'JwlIA';
    aiPersona = aiPersonaInput.value.trim() || 'Você é JwlIA, uma assistente pessoal inteligente e prestativa.';
    aiProvider = aiProviderSelect.value;
    aiModel = aiModelSelect.value;

    localStorage.setItem('jwlIA_api_key', userApiKey);
    localStorage.setItem('jwlIA_name', aiName);
    localStorage.setItem('jwlIA_persona', aiPersona);
    localStorage.setItem('jwlIA_provider', aiProvider);
    localStorage.setItem('jwlIA_model', aiModel);

    initUI();
    alert('Configurações salvas com sucesso!');
    settingsPanel.classList.add('hidden');
});

// Redefinir Tudo (Reset de Fábrica)
resetConfigBtn.addEventListener('click', () => {
    if (confirm('Deseja resetar todas as configurações (Chave, Nome, Tema)? Isso não apaga o chat.')) {
        const keys = ['jwlIA_api_key', 'jwlIA_name', 'jwlIA_persona', 'jwlIA_provider', 'jwlIA_model'];
        keys.forEach(k => localStorage.removeItem(k));
        window.location.reload();
    }
});

// Exportar Chat em TXT
exportChatBtn.addEventListener('click', () => {
    if (messageHistory.length === 0) return alert('Não há mensagens para exportar.');

    let content = `Histórico de Conversa - ${aiName}\nData: ${new Date().toLocaleString()}\n\n`;
    messageHistory.forEach(msg => {
        const label = msg.role === 'user' ? 'Você' : aiName;
        content += `[${label}]: ${msg.content}\n\n`;
    });

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `conversa-${aiName.toLowerCase()}-${new Date().getTime()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
});

// Limpar Histórico de Chat
clearChatBtn.addEventListener('click', () => {
    if (confirm('Tem certeza que deseja apagar todo o histórico de mensagens?')) {
        messageHistory = [];
        localStorage.removeItem('jwlIA_history');

        // Limpa o container visualmente (mantendo apenas o boas-vindas)
        chatContainer.innerHTML = '';
        const welcome = document.createElement('div');
        welcome.className = 'welcome-message';
        welcome.innerHTML = `
            <div class="bot-avatar">J</div>
            <div class="message-bubble">Olá! Eu sou a ${aiName}. Como posso te ajudar hoje?</div>
        `;
        chatContainer.appendChild(welcome);

        alert('Histórico apagado!');
        settingsPanel.classList.add('hidden');
    }
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
                messages: messageHistory,
                system_instruction: aiPersona,
                ai_model: aiModel,
                ai_base_url: aiProvider
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
