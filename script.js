const chatContainer = document.getElementById('chat-container');
const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const settingsBtn = document.getElementById('settings-btn');
const settingsPanel = document.getElementById('settings-panel');
const apiKeyInput = document.getElementById('api-key-input');
const aiNameInput = document.getElementById('ai-name-input');
const aiSloganInput = document.getElementById('ai-slogan-input');
const aiPersonaInput = document.getElementById('ai-persona-input');
const aiModelSelect = document.getElementById('ai-model-select');
const aiModelCustom = document.getElementById('ai-model-custom');
const customModelGroup = document.getElementById('custom-model-group');
const saveKeyBtn = document.getElementById('save-key-btn');
const cancelSettingsBtn = document.getElementById('cancel-settings-btn');
const closeSettingsBtn = document.getElementById('close-settings-btn');
const clearChatBtn = document.getElementById('clear-chat-btn');
const resetConfigBtn = document.getElementById('reset-config-btn');
const exportChatBtn = document.getElementById('export-chat-btn');
const headerTitle = document.getElementById('app-title');
const sloganDisplay = document.getElementById('ai-slogan-display');
const providerTabs = document.querySelectorAll('.provider-tab');

// Novos Modais
const devModal = document.getElementById('dev-modal');
const pixModal = document.getElementById('pix-modal');
const devLogoBtn = document.getElementById('dev-logo-btn');
const mainCoffeeBtn = document.getElementById('main-coffee-btn');
const settingsCoffeeBtn = document.getElementById('settings-coffee-btn');
const devCardCoffeeBtn = document.getElementById('dev-card-coffee-btn');
const copyPixBtn = document.getElementById('copy-pix-btn');
const modalCloses = document.querySelectorAll('.modal-close');

// Configurações de Modelos por Provedor
const MODELS_CONFIG = {
    openai: [
        { name: 'GPT-4o Mini', value: 'gpt-4o-mini' },
        { name: 'GPT-4o (Poderoso)', value: 'gpt-4o' },
        { name: 'o1-mini', value: 'o1-mini' },
        { name: 'Outro (Digitar)', value: 'manual' }
    ],
    openrouter: [
        { name: 'Gemini 2.0 (Grátis)', value: 'google/gemini-2.0-flash-exp:free' },
        { name: 'Mistral 7B (Grátis)', value: 'mistralai/mistral-7b-instruct:free' },
        { name: 'DeepSeek Chat', value: 'deepseek/deepseek-chat' },
        { name: 'Outro (Digitar)', value: 'manual' }
    ]
};

// Carrega as configurações do localStorage
let messageHistory = JSON.parse(localStorage.getItem('jwlIA_history')) || [];
let userApiKey = localStorage.getItem('jwlIA_api_key') || '';
let aiName = localStorage.getItem('jwlIA_name') || 'JwlIA';
let aiSlogan = localStorage.getItem('jwlIA_slogan') || '';
let aiPersona = localStorage.getItem('jwlIA_persona') || 'Você é JwlIA, uma assistente pessoal inteligente e prestativa.';
let aiProvider = localStorage.getItem('jwlIA_provider') || 'openai';
let aiModel = localStorage.getItem('jwlIA_model') || 'gpt-4o-mini';

// Inicializa os campos da UI
function initUI() {
    apiKeyInput.value = userApiKey;
    aiNameInput.value = aiName;
    aiSloganInput.value = aiSlogan;
    aiPersonaInput.value = aiPersona;

    headerTitle.innerText = aiName;
    sloganDisplay.innerText = aiSlogan;
    userInput.placeholder = `Conversar com ${aiName}...`;

    // Provider Tabs
    providerTabs.forEach(tab => {
        tab.classList.toggle('active', tab.dataset.id === aiProvider);
    });

    updateKeyLabel();
    updateModelSelect();
    renderWelcome();
}

function renderWelcome() {
    if (messageHistory.length === 0) {
        chatContainer.innerHTML = '';
        const welcome = document.createElement('div');
        welcome.className = 'welcome-message';
        welcome.innerHTML = `
            <div class="bot-avatar">${aiName.charAt(0).toUpperCase()}</div>
            <div class="message-bubble">Olá! Eu sou a ${aiName}. Como posso te ajudar hoje?</div>
        `;
        chatContainer.appendChild(welcome);
    }
}

function updateKeyLabel() {
    const label = document.getElementById('key-label');
    if (label) {
        label.innerText = `Chave da API (${aiProvider === 'openai' ? 'OpenAI' : 'OpenRouter'})`;
        apiKeyInput.placeholder = aiProvider === 'openai' ? 'sk-...' : 'sk-or-...';
    }
}

function updateModelSelect() {
    const models = MODELS_CONFIG[aiProvider] || [];
    aiModelSelect.innerHTML = '';

    models.forEach(m => {
        const opt = document.createElement('option');
        opt.value = m.value;
        opt.innerText = m.name;
        aiModelSelect.appendChild(opt);
    });

    const isStandard = models.some(m => m.value === aiModel);
    if (!isStandard && aiModel) {
        aiModelSelect.value = 'manual';
        aiModelCustom.value = aiModel;
        customModelGroup.style.display = 'block';
    } else {
        aiModelSelect.value = aiModel || models[0].value;
        customModelGroup.style.display = 'none';
        aiModelCustom.value = '';
    }
}

// Gestão de Modais
function openModal(modal) {
    modal.classList.remove('hidden');
}

function closeAllModals() {
    devModal.classList.add('hidden');
    pixModal.classList.add('hidden');
}

devLogoBtn.addEventListener('click', () => openModal(devModal));
mainCoffeeBtn.addEventListener('click', () => openModal(pixModal));
settingsCoffeeBtn.addEventListener('click', () => openModal(pixModal));
devCardCoffeeBtn.addEventListener('click', () => {
    devModal.classList.add('hidden');
    openModal(pixModal);
});

modalCloses.forEach(btn => btn.addEventListener('click', closeAllModals));

// Fechar modal ao clicar fora do card
[devModal, pixModal].forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeAllModals();
    });
});

// Copiar Pix
copyPixBtn.addEventListener('click', () => {
    const pixKey = "marcosilex@gmail.com";
    navigator.clipboard.writeText(pixKey).then(() => {
        const originalText = copyPixBtn.innerText;
        copyPixBtn.innerText = "✅ Código Copiado!";
        setTimeout(() => copyPixBtn.innerText = originalText, 2000);
    });
});

// Event Listeners para Tabs
providerTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        aiProvider = tab.dataset.id;
        providerTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        updateKeyLabel();
        updateModelSelect();
    });
});

aiModelSelect.addEventListener('change', () => {
    customModelGroup.style.display = aiModelSelect.value === 'manual' ? 'block' : 'none';
});

settingsBtn.addEventListener('click', () => {
    settingsPanel.classList.toggle('hidden');
});

function closeSettings() {
    initUI();
    settingsPanel.classList.add('hidden');
}

closeSettingsBtn.addEventListener('click', closeSettings);
cancelSettingsBtn.addEventListener('click', closeSettings);

saveKeyBtn.addEventListener('click', () => {
    userApiKey = apiKeyInput.value.trim();
    aiName = aiNameInput.value.trim() || 'JwlIA';
    aiSlogan = aiSloganInput.value.trim();
    aiPersona = aiPersonaInput.value.trim() || 'Você é JwlIA, uma assistente pessoal inteligente e prestativa.';

    const selectedModel = aiModelSelect.value;
    aiModel = selectedModel === 'manual' ? aiModelCustom.value.trim() : selectedModel;

    localStorage.setItem('jwlIA_api_key', userApiKey);
    localStorage.setItem('jwlIA_name', aiName);
    localStorage.setItem('jwlIA_slogan', aiSlogan);
    localStorage.setItem('jwlIA_persona', aiPersona);
    localStorage.setItem('jwlIA_provider', aiProvider);
    localStorage.setItem('jwlIA_model', aiModel);

    initUI();
    alert('Configurações salvas!');
    settingsPanel.classList.add('hidden');
});

resetConfigBtn.addEventListener('click', () => {
    if (confirm('Deseja resetar TUDO (Chaves, Nome, Histórico)?')) {
        localStorage.clear();
        window.location.reload();
    }
});

exportChatBtn.addEventListener('click', () => {
    if (messageHistory.length === 0) return alert('Chat vazio.');
    let text = `Chat com ${aiName}\n---\n`;
    messageHistory.forEach(m => text += `[${m.role === 'user' ? 'Você' : aiName}]: ${m.content}\n\n`);
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `conversa-${aiName.toLowerCase()}-${Date.now()}.txt`;
    a.click();
});

clearChatBtn.addEventListener('click', () => {
    if (confirm('Limpar histórico de mensagens?')) {
        messageHistory = [];
        localStorage.removeItem('jwlIA_history');
        renderWelcome();
        settingsPanel.classList.add('hidden');
    }
});

function appendMessage(role, content) {
    const wrapper = document.createElement('div');
    wrapper.classList.add('message-wrapper', role === 'user' ? 'user-wrapper' : 'bot-wrapper');

    // Avatar dinâmico
    if (role === 'assistant') {
        const avatar = document.createElement('div');
        avatar.className = 'bot-avatar';
        avatar.innerText = aiName.charAt(0).toUpperCase();
        wrapper.appendChild(avatar);
    }

    const bubble = document.createElement('div');
    bubble.classList.add('message-bubble');
    bubble.innerText = content;

    wrapper.appendChild(bubble);
    chatContainer.appendChild(wrapper);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Histórico Inicial
if (messageHistory.length > 0) {
    chatContainer.innerHTML = '';
    messageHistory.forEach(m => appendMessage(m.role, m.content));
} else {
    renderWelcome();
}

chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const text = userInput.value.trim();
    if (!text) return;

    appendMessage('user', text);
    messageHistory.push({ role: 'user', content: text });
    userInput.value = '';

    const typing = document.createElement('div');
    typing.className = 'typing';
    typing.innerText = `${aiName} está pensando...`;
    chatContainer.appendChild(typing);
    chatContainer.scrollTop = chatContainer.scrollHeight;

    try {
        const body = {
            messages: messageHistory,
            system_instruction: aiPersona,
            ai_model: aiModel,
            ai_base_url: aiProvider === 'openai' ? 'https://api.openai.com/v1' : 'https://openrouter.ai/api/v1'
        };

        const res = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': userApiKey ? `Bearer ${userApiKey}` : ''
            },
            body: JSON.stringify(body)
        });

        const data = await res.json();
        typing.remove();

        if (data.response) {
            appendMessage('assistant', data.response);
            messageHistory.push({ role: 'assistant', content: data.response });
            localStorage.setItem('jwlIA_history', JSON.stringify(messageHistory));
        } else {
            appendMessage('assistant', 'Erro na API. Verifique sua chave.');
        }
    } catch (err) {
        if (typing) typing.remove();
        appendMessage('assistant', 'Erro de conexão.');
    }
});

initUI();
