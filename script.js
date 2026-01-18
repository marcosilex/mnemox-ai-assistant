// --- CONFIGURAÇÃO DE BRANDING (Para facilitar Open Source) ---
const DEV_CONFIG = {
    name: "MARCO ANANIAS",
    email: "marcosilex@gmail.com",
    pixKey: "marcosilex@gmail.com",
    role: "Desenvolvedor"
};

const chatContainer = document.getElementById('chat-container');
const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const settingsBtn = document.getElementById('settings-btn');
const helpBtn = document.getElementById('help-btn');
const settingsPanel = document.getElementById('settings-panel');
const apiKeyInput = document.getElementById('api-key-input');
const aiNameInput = document.getElementById('ai-name-input');
const aiSloganInput = document.getElementById('ai-slogan-input');
const aiModelInput = document.getElementById('ai-model-input');
const aiPersonaInput = document.getElementById('ai-persona-input');
const saveKeyBtn = document.getElementById('save-key-btn');
const cancelSettingsBtn = document.getElementById('cancel-settings-btn');
const closeSettingsBtn = document.getElementById('close-settings-btn');
const clearChatBtn = document.getElementById('clear-chat-btn');
const resetConfigBtn = document.getElementById('reset-config-btn');
const exportChatBtn = document.getElementById('export-chat-btn');
const exportPersonaBtn = document.getElementById('export-persona-btn');
const headerTitle = document.getElementById('app-title');
const settingsPanelTitle = document.getElementById('settings-panel-title');
const sloganDisplay = document.getElementById('ai-slogan-display');
const providerTabs = document.querySelectorAll('.provider-tab');

// Novos Modais
const devModal = document.getElementById('dev-modal');
const pixModal = document.getElementById('pix-modal');
const helpModal = document.getElementById('help-modal');
const devLogoBtn = document.getElementById('dev-logo-btn');
const mainCoffeeBtn = document.getElementById('main-coffee-btn');
const settingsCoffeeBtn = document.getElementById('settings-coffee-btn');
const devCardCoffeeBtn = document.getElementById('dev-card-coffee-btn');
const copyPixBtn = document.getElementById('copy-pix-btn');
const modalCloses = document.querySelectorAll('.modal-close, .modal-close-action');

// Carrega as configurações do localStorage (Migrado de jwlIA para mnemox)
let messageHistory = JSON.parse(localStorage.getItem('mnemox_history')) || JSON.parse(localStorage.getItem('jwlIA_history')) || [];
let userApiKey = localStorage.getItem('mnemox_api_key') || localStorage.getItem('jwlIA_api_key') || '';
let aiName = localStorage.getItem('mnemox_name') || localStorage.getItem('jwlIA_name') || 'Mnemox';
let aiSlogan = localStorage.getItem('mnemox_slogan') || localStorage.getItem('jwlIA_slogan') || '';
let aiPersona = localStorage.getItem('mnemox_persona') || localStorage.getItem('jwlIA_persona') || 'Você é Mnemox, uma assistente pessoal inteligente e prestativa dedicada à organização e produtividade.';
let aiProvider = localStorage.getItem('mnemox_provider') || localStorage.getItem('jwlIA_provider') || 'openai';
let aiModel = localStorage.getItem('mnemox_model') || localStorage.getItem('jwlIA_model') || 'gpt-4o-mini';

// Inicializa os campos da UI
function initUI() {
    apiKeyInput.value = userApiKey;
    aiNameInput.value = aiName;
    aiSloganInput.value = aiSlogan;
    aiModelInput.value = aiModel;
    aiPersonaInput.value = aiPersona;

    headerTitle.innerText = aiName;
    settingsPanelTitle.innerText = `✨ Configurações de ${aiName}`;
    sloganDisplay.innerText = aiSlogan;
    userInput.placeholder = `Conversar com ${aiName}...`;

    // Atualiza info do Dev parametrizada
    document.querySelector('.dev-profile h2').innerText = DEV_CONFIG.name;
    document.querySelector('.dev-contact strong').innerText = DEV_CONFIG.email;
    document.getElementById('pix-key').innerText = DEV_CONFIG.pixKey;

    // Provider Tabs
    providerTabs.forEach(tab => {
        tab.classList.toggle('active', tab.dataset.id === aiProvider);
    });

    updateKeyLabel();
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

// Gestão de Modais
function openModal(modal) {
    modal.classList.remove('hidden');
}

function closeAllModals() {
    devModal.classList.add('hidden');
    pixModal.classList.add('hidden');
    helpModal.classList.add('hidden');
}

devLogoBtn.addEventListener('click', () => openModal(devModal));
mainCoffeeBtn.addEventListener('click', () => openModal(pixModal));
settingsCoffeeBtn.addEventListener('click', () => openModal(pixModal));
helpBtn.addEventListener('click', () => openModal(helpModal));
devCardCoffeeBtn.addEventListener('click', () => {
    devModal.classList.add('hidden');
    openModal(pixModal);
});

modalCloses.forEach(btn => btn.addEventListener('click', closeAllModals));

// Fechar modal ao clicar fora do card
[devModal, pixModal, helpModal].forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeAllModals();
    });
});

// Copiar Pix
copyPixBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(DEV_CONFIG.pixKey).then(() => {
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
    });
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
    aiName = aiNameInput.value.trim() || 'Mnemox';
    aiSlogan = aiSloganInput.value.trim();
    aiModel = aiModelInput.value.trim() || 'gpt-4o-mini';
    aiPersona = aiPersonaInput.value.trim() || 'Você é Mnemox, uma assistente pessoal inteligente e prestativa.';

    localStorage.setItem('mnemox_api_key', userApiKey);
    localStorage.setItem('mnemox_name', aiName);
    localStorage.setItem('mnemox_slogan', aiSlogan);
    localStorage.setItem('mnemox_model', aiModel);
    localStorage.setItem('mnemox_persona', aiPersona);
    localStorage.setItem('mnemox_provider', aiProvider);

    initUI();
    alert('Configurações salvas!');
    settingsPanel.classList.add('hidden');
});

resetConfigBtn.addEventListener('click', () => {
    if (confirm('Deseja resetar TUDO (Chaves, Nome, Histórico)? Isso limpará as configurações salvos no navegador.')) {
        localStorage.clear();
        window.location.reload();
    }
});

function downloadTextFile(filename, text) {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

exportChatBtn.addEventListener('click', () => {
    if (messageHistory.length === 0) return alert('Chat vazio.');
    let text = `Chat com ${aiName}\n---\n`;
    messageHistory.forEach(m => text += `[${m.role === 'user' ? 'Você' : aiName}]: ${m.content}\n\n`);
    downloadTextFile(`conversa-${aiName.toLowerCase()}-${Date.now()}.txt`, text);
});

exportPersonaBtn.addEventListener('click', () => {
    if (!aiPersona) return alert('Persona não configurada.');
    const text = `Persona de ${aiName}\n---\n\n${aiPersona}`;
    downloadTextFile(`persona-${aiName.toLowerCase()}-${Date.now()}.txt`, text);
});

clearChatBtn.addEventListener('click', () => {
    if (confirm('Limpar histórico de mensagens?')) {
        messageHistory = [];
        localStorage.removeItem('mnemox_history');
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
            localStorage.setItem('mnemox_history', JSON.stringify(messageHistory));
        } else {
            appendMessage('assistant', 'Erro na API. Verifique sua chave.');
        }
    } catch (err) {
        if (typing) typing.remove();
        appendMessage('assistant', 'Erro de conexão.');
    }
});

initUI();
