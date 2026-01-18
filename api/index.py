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

# Configuração da IA (Agnóstico)
def get_ai_client(header_key: str = None):
    # Usa a chave enviada pelo usuário via Header, ou cai na variável de ambiente do servidor
    api_key = header_key if header_key else os.getenv("AI_API_KEY", os.getenv("OPENAI_API_KEY"))
    base_url = os.getenv("AI_BASE_URL", "https://api.openai.com/v1")
    model_name = os.getenv("AI_MODEL", "gpt-4o-mini")
    
    if not api_key:
        return None, None, None
        
    client = OpenAI(
        api_key=api_key,
        base_url=base_url
    )
    return client, model_name, api_key

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[Message]
    system_instruction: Optional[str] = "Você é JwlIA, uma assistente pessoal inteligente e prestativa."

@app.post("/api/chat")
async def chat(request: ChatRequest, authorization: Optional[str] = Header(None)):
    header_key = None
    if authorization and authorization.startswith("Bearer "):
        header_key = authorization.replace("Bearer ", "")
    
    client, model_name, api_key = get_ai_client(header_key)
    
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
    return FileResponse('index.html')

@app.get("/style.css")
async def read_style():
    return FileResponse('style.css')

@app.get("/script.js")
async def read_script():
    return FileResponse('script.js')

@app.get("/api/health")
async def health():
    return {"status": "ok", "provider": "Vercel Deployment"}
