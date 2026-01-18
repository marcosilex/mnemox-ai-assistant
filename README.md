# ✨ JwlIA - Sua Assistente Pessoal Premium

JwlIA é uma inteligência artificial pessoal projetada para ser sua companheira de produtividade e conhecimento, com foco nas discussões do **Podcast do Marco e a Robozada**.

![Interface Preview](https://img.shields.io/badge/UI-Modern_Glassmorphism-blueviolet)
![Backend](https://img.shields.io/badge/Backend-FastAPI-009688)
![AI](https://img.shields.io/badge/IA-OpenAI_/_OpenRouter-orange)

O **JwlIA** é um assistente pessoal inteligente desenvolvido com FastAPI e a API da OpenAI (ou compatíveis). Este projeto nasceu durante a **Jornada Python da Hashtag Treinamentos** e foi evoluído para uma aplicação web moderna e responsiva.

---

### 🚀 Funcionalidades
- **Arquitetura Moderna:** Backend em Python (FastAPI) e Frontend minimalista.
- **BYOK (Bring Your Own Key):** Use sua própria chave de API diretamente na interface ou via variáveis de ambiente.
- **Privacidade:** Histórico de conversas salvo localmente no seu navegador (`localStorage`).
- **Design Premium:** Interface com Dark Mode, Glassmorphism e total responsividade mobile.
- **Multi-Provider:** Suporte para OpenAI, OpenRouter e outros provedores compatíveis.

---

### 🔐 Segurança e Privacidade (Open Source)
Este projeto foi construído seguindo o modelo **BYOK**. Você não precisa expor sua chave no código fonte:
1. Acesse as configurações no ícone ⚙️ no chat.
2. Insira sua chave (OpenAI/OpenRouter).
3. A chave fica salva **apenas no seu navegador** e nunca é armazenada em nosso banco de dados.

## 🛠️ Tecnologias Utilizadas

- **Frontend:** HTML5, CSS3 (Vanilla), JavaScript (ES6+).
- **Backend:** Python 3.9+, FastAPI, Uvicorn.
- **IA:** OpenAI SDK.

## 🚀 Como Rodar Localmente

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/marcosilex/jwlia-ai-assistant.git
   cd "Aula 4 - Criação de Chatbot com IA em Tempo Real"
   ```

2. **Configure o ambiente:**
   Renomeie o arquivo `.env.example` para `.env` e adicione sua `OPENAI_API_KEY`.

3. **Instale as dependências:**
   ```bash
   python -m pip install -r requirements.txt
   ```

4. **Inicie o servidor:**
   ```bash
   python -m uvicorn api.index:app --reload
   ```
   Acesse: `http://127.0.0.1:8000`

## ☁️ Deploy no Vercel

O projeto já contém o arquivo `vercel.json` e a estrutura de pastas `/api` e `/public` necessária para o deploy automático. Basta conectar seu repositório GitHub ao painel do Vercel e configurar a Environment Variable `OPENAI_API_KEY`.

---
*Desenvolvido durante a Jornada Python - Aula 4 e aprimorado com design premium.*
