# titulostream
# input do chat ( campo de mensagem
# a cada mensagem enviada pelo usuario
# mostrar mensagem na tela
# enviar mensagem para uma IA responder
# mostrar resposta da IA na tela

# Streamlit  Vamos usar o Streamlit para criar a interface web com Python

import streamlit as st
from openai import OpenAI

modelo_ia = OpenAI(
    api_key="SUA_CHAVE_AQUI"
)

st.write("## Conversando com JwlIA, minha IA favorita")
st.write(" ## Podcast do Marco e a Robozada!")

if not "lista_mensagens" in st.session_state:
    st.session_state["lista_mensagens"] = []

texto_usuario = st.chat_input("Digite sua mensagem para a JwlIA:")

for mensagem in st.session_state["lista_mensagens"]:
    role = mensagem["role"]
    content = mensagem["content"]
    st.chat_message(role).write(content)

if texto_usuario:
    st.chat_message("user").write(texto_usuario)
    mensagem_usuario = {"role": "user", "content": texto_usuario}
    st.session_state["lista_mensagens"].append(mensagem_usuario)

    resposta_ia = modelo_ia.chat.completions.create(
        messages=st.session_state["lista_mensagens"], model="gpt-4.1-nano"
    )

    texto_resposta_ia = resposta_ia.choices[0].message.content

    st.chat_message("assistant").write(texto_resposta_ia)
    mensagem_ia = {"role": "assistant", "content": texto_resposta_ia}
    st.session_state["lista_mensagens"].append(mensagem_ia)
