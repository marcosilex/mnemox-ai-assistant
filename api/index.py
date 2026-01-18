import os
from fastapi import FastAPI, HTTPException, Header
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import List, Optional
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# Servir arquivos estáticos da pasta 'assets'
# Como index.py está dentro de /api, voltamos um nível para achar /assets
base_path = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
assets_path = os.path.join(base_path, "assets")

if os.path.exists(assets_path):
    app.mount("/assets", StaticFiles(directory=assets_path), name="assets")

# Configuração da IA (Agnóstico)
def get_ai_client(header_key: str = None, req_model: str = None, req_url: str = None):
    # Usa a chave enviada pelo usuário via Header, ou cai na variável de ambiente do servidor
    api_key = header_key if header_key else os.getenv("AI_API_KEY", os.getenv("OPENAI_API_KEY"))
    
    # Prioriza o Provedor/URL enviado pelo teclado do usuário, senão usa o padrão
    base_url = req_url if req_url else os.getenv("AI_BASE_URL", "https://api.openai.com/v1")
    
    # Prioriza o Modelo enviado pelo teclado do usuário, senão usa o padrão
    model_name = req_model if req_model else os.getenv("AI_MODEL", "gpt-4o-mini")
    
    if not api_key:
        return None, None, None
    
    # Headers específicos para OpenRouter (Boa prática e necessário para alguns modelos)
    extra_headers = {}
    if "openrouter.ai" in base_url.lower():
        extra_headers = {
            "HTTP-Referer": "https://mnemox-ai.vercel.app", # Identifica a origem para o OpenRouter
            "X-Title": "Mnemox AI Assistant",
        }
        
    client = OpenAI(
        api_key=api_key,
        base_url=base_url,
        default_headers=extra_headers
    )
    return client, model_name, api_key

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[Message]
    system_instruction: Optional[str] = "Você é JwlIA, uma assistente pessoal inteligente e prestativa."
    ai_model: Optional[str] = None
    ai_base_url: Optional[str] = None

@app.post("/api/chat")
async def chat(request: ChatRequest, authorization: Optional[str] = Header(None)):
    header_key = None
    if authorization and authorization.startswith("Bearer "):
        header_key = authorization.replace("Bearer ", "")
    
    client, model_name, api_key = get_ai_client(header_key, request.ai_model, request.ai_base_url)
    
    if not api_key:
        raise HTTPException(
            status_code=401, 
            detail="API Key não encontrada. Configure no servidor ou insira sua própria chave nas configurações do chat."
        )
    
    try:
        # Prepara as mensagens incluindo instrução de sistema se houver
        messages = []
        if request.system_instruction:
            messages.append({"role": "system", "content": request.system_instruction})
        
        for msg in request.messages:
            messages.append({"role": msg.role, "content": msg.content})

        response = client.chat.completions.create(
            model=model_name,
            messages=messages
        )
        
        return {"response": response.choices[0].message.content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/")
async def read_index():
    return FileResponse(os.path.join(base_path, 'index.html'))

@app.get("/style.css")
async def read_style():
    return FileResponse(os.path.join(base_path, 'style.css'))

@app.get("/script.js")
async def read_script():
    return FileResponse(os.path.join(base_path, 'script.js'))

@app.get("/api/health")
async def health():
    return {"status": "ok", "provider": "Vercel Deployment"}
