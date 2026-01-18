const chatContainer = document.getElementById('chat-container');
const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const settingsBtn = document.getElementById('settings-btn');
const settingsPanel = document.getElementById('settings-panel');
const apiKeyInput = document.getElementById('api-key-input');
const aiNameInput = document.getElementById('ai-name-input');
const aiSloganInput = document.getElementById('ai-slogan-input');
const aiLogoInput = document.getElementById('ai-logo-input');
const aiPersonaInput = document.getElementById('ai-persona-input');
const aiModelSelect = document.getElementById('ai-model-select');
const aiModelCustom = document.getElementById('ai-model-custom');
const customModelGroup = document.getElementById('custom-model-group');
const saveKeyBtn = document.getElementById('save-key-btn');
const clearChatBtn = document.getElementById('clear-chat-btn');
const resetConfigBtn = document.getElementById('reset-config-btn');
const exportChatBtn = document.getElementById('export-chat-btn');
const headerTitle = document.querySelector('header h1');
const sloganDisplay = document.getElementById('ai-slogan-display');
const customLogo = document.getElementById('custom-logo');
const aiIcon = document.querySelector('.ai-icon');
const providerTabs = document.querySelectorAll('.provider-tab');

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
let aiLogoUrl = localStorage.getItem('jwlIA_logo_url') || '';

// Inicializa os campos da UI
function initUI() {
    apiKeyInput.value = userApiKey;
    aiNameInput.value = aiName;
    aiSloganInput.value = aiSlogan;
    aiLogoInput.value = aiLogoUrl;
    aiPersonaInput.value = aiPersona;

    headerTitle.innerText = aiName;
    sloganDisplay.innerText = aiSlogan;
    userInput.placeholder = `Conversar com ${aiName}...`;

    // Logo Update
    if (aiLogoUrl) {
        customLogo.src = aiLogoUrl;
        customLogo.classList.remove('hidden');
        aiIcon.classList.add('hidden');
    } else {
        customLogo.classList.add('hidden');
        aiIcon.classList.remove('hidden');
    }

    // Provider Tabs
    providerTabs.forEach(tab => {
        tab.classList.toggle('active', tab.dataset.id === aiProvider);
    });

    updateKeyLabel();
    updateModelSelect();
}

function updateKeyLabel() {
    const label = document.getElementById('key-label');
    label.innerText = `Chave da API (${aiProvider === 'openai' ? 'OpenAI' : 'OpenRouter'})`;
    apiKeyInput.placeholder = aiProvider === 'openai' ? 'sk-...' : 'sk-or-...';
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

    // Se o modelo salvo não estiver na lista (foi manual), coloca em "manual"
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

// Detectar se escolheu Manual
aiModelSelect.addEventListener('change', () => {
    customModelGroup.style.display = aiModelSelect.value === 'manual' ? 'block' : 'none';
});

// Alternar painel de configurações
settingsBtn.addEventListener('click', () => {
    settingsPanel.classList.toggle('hidden');
});

// Salvar todas as configurações
saveKeyBtn.addEventListener('click', () => {
    userApiKey = apiKeyInput.value.trim();
    aiName = aiNameInput.value.trim() || 'JwlIA';
    aiSlogan = aiSloganInput.value.trim();
    aiLogoUrl = aiLogoInput.value.trim();
    aiPersona = aiPersonaInput.value.trim() || 'Você é JwlIA, uma assistente pessoal inteligente e prestativa.';

    const selectedModel = aiModelSelect.value;
    aiModel = selectedModel === 'manual' ? aiModelCustom.value.trim() : selectedModel;

    localStorage.setItem('jwlIA_api_key', userApiKey);
    localStorage.setItem('jwlIA_name', aiName);
    localStorage.setItem('jwlIA_slogan', aiSlogan);
    localStorage.setItem('jwlIA_logo_url', aiLogoUrl);
    localStorage.setItem('jwlIA_persona', aiPersona);
    localStorage.setItem('jwlIA_provider', aiProvider);
    localStorage.setItem('jwlIA_model', aiModel);

    initUI();
    alert('Configurações salvas!');
    settingsPanel.classList.add('hidden');
});

// Redefinir Tudo
resetConfigBtn.addEventListener('click', () => {
    if (confirm('Deseja resetar TUDO (Chaves, Nome, Logo)? Isso apagará o histórico também.')) {
        localStorage.clear();
        window.location.reload();
    }
});

// Exportar Chat
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

// Limpar Chat
clearChatBtn.addEventListener('click', () => {
    if (confirm('Limpar histórico de mensagens?')) {
        messageHistory = [];
        localStorage.removeItem('jwlIA_history');
        location.reload();
    }
});

// Envio de Mensagem
function appendMessage(role, content) {
    const wrapper = document.createElement('div');
    wrapper.classList.add('message-wrapper', role === 'user' ? 'user-wrapper' : 'bot-wrapper');

    const bubble = document.createElement('div');
    bubble.classList.add('message-bubble');
    bubble.innerText = content;

    wrapper.appendChild(bubble);
    chatContainer.appendChild(wrapper);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Renderiza Histórico
if (messageHistory.length > 0) {
    const welcome = document.querySelector('.welcome-message');
    if (welcome) welcome.remove();
    messageHistory.forEach(m => appendMessage(m.role, m.content));
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
