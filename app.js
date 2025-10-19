const express = require('express');
const path = require('path');
require('dotenv').config();
const axios = require('axios');

const app = express();
const PORT = 3000;

// Configurações do Express
app.use(express.static(path.join(__dirname)));
app.use(express.json());

// Rota principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'app/index.html'));
});

// Rota do chatbot com suporte aos modos
app.post('/api/chat', async (req, res) => {
  const { message, modo = 'perfil_moderado' } = req.body;

  try {
    // Sistema de prompts para cada perfil
    const systemPrompts = {
      perfil_conservador: `
        Você agora está atendendo um cliente com perfil conservador. 
        Ele valoriza segurança, previsibilidade e baixo risco. 
        Se o cliente apenas cumprimentar ou fizer perguntas genéricas, responda de forma breve e natural, sem falar sobre investimentos. 
        Se ele fizer perguntas sobre investimentos, sugira apenas opções seguras, como CDB, Tesouro Direto e fundos de renda fixa.
        Não incentive investimentos arriscados. 
        Responda sempre de forma curta e direta, sem formatação (como tentar deixar o texto em negrito).
        `,

      perfil_moderado: `
        Você agora está atendendo um cliente com perfil moderado. 
        Ele aceita algum risco, mas quer equilíbrio entre segurança e rentabilidade. 
        Se o cliente apenas cumprimentar ou fizer perguntas genéricas, responda naturalmente e sem falar sobre investimentos.
        Se ele perguntar sobre investimentos, indique combinações equilibradas, como renda fixa, fundos multimercado e ações em menor proporção.
        Explique de forma simples e sem formatação o motivo das recomendações. 
        Responda sempre de forma curta e direta, sem formatação (como tentar deixar o texto em negrito).
        `,

      perfil_arriscado: `
        Você agora está atendendo um cliente com perfil arriscado. 
        Ele busca altos retornos e entende os riscos de perda. 
        Se o cliente apenas cumprimentar ou fizer perguntas genéricas, responda de forma breve e natural, sem mencionar investimentos.
        Se ele falar sobre investimentos, sugira opções de maior risco como ações, fundos de ações e criptomoedas, sempre lembrando que há risco de perda.
        Responda sempre de forma curta e direta, sem formatação (como tentar deixar o texto em negrito).
        `
    };


    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "meta-llama/llama-4-scout",
        messages: [
          { 
            role: "system", 
            content: systemPrompts[modo] || systemPrompts.perfil_moderado
          },
          { 
            role: "user", 
            content: message 
          }
        ],
        temperature: 0.5
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://example.com",
          "X-Title": "Agente Investimento"
        }
      }
    );

    // Formata a resposta com identificação do modo
    let resposta = response.data.choices[0].message.content;
    if (modo === 'perfil_conservador') resposta = `🔒 ${resposta}`;
    if (modo === 'perfil_moderado') resposta = `⚖️ ${resposta}`;
    if (modo === 'perfil_arriscado') resposta = `☣️ ${resposta}`;

    res.json({ reply: resposta });
    
  } catch (error) {
    console.error("Erro na API:", error.response?.data || error.message);
    res.status(500).json({ 
      error: "Oops! Algo deu errado. Tente novamente!",
      details: modo === 'perfil_arriscado' ? "Até meu código tá bugado, que surpresa..." : "Erro no servidor"
    });
  }
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log("Modos disponíveis: conservador, moderado, arriscado");
});