var contador_mensagens = 0;
var modoAtual = 'perfil_conservador';

let etapaInvestimento = 0;
let dadosInvestimento = {
    valor_inicial: null,
    valor_mensal: null,
    duracao: null,
    objetivo: null,
    relacao: null,
    perfil_investimento: null
};
let emColeta = false;
let historico = [];


function alterarModo(modo){
  modoAtual = modo;
  console.log(`Modo alterado para: ${modo}`);
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('modo1').checked = true;
    document.querySelectorAll('input[name="modo_chat"]').forEach(radio => {
        radio.addEventListener('change', function() {
            alterarModo(this.value);
        });
    });
});

function extrairDados(texto) {
  // Extrair números (valor inicial, mensal e duração)
  const numeros = texto.match(/\d+(?:[\.,]\d+)?/g);
  if (numeros) {
    const valor = parseFloat(numeros[0].replace(',', '.'));
    if (dadosInvestimento.valor_inicial === null) {
      dadosInvestimento.valor_inicial = valor;
      console.log("✅ Valor inicial definido:", dadosInvestimento.valor_inicial);
    } else if (dadosInvestimento.valor_mensal === null) {
      dadosInvestimento.valor_mensal = valor;
      console.log("✅ Valor mensal definido:", dadosInvestimento.valor_mensal);
    } else if (dadosInvestimento.duracao === null) {
      dadosInvestimento.duracao = Math.max(1, valor); // mínimo 1 ano
      console.log("✅ Duração definida:", dadosInvestimento.duracao);
    }
  }

  // Objetivo
  if (!dadosInvestimento.objetivo) {
    if (/patrimôni|patrimonio/i.test(texto)) dadosInvestimento.objetivo = "Aumentar patrimônio";
    else if (/seguranç|seguranca/i.test(texto)) dadosInvestimento.objetivo = "Segurança financeira";
    else if (/irpf/i.test(texto)) dadosInvestimento.objetivo = "Economizar com IRPF";
    else if (/viagem|outros|outro|compra|objetivo/i.test(texto)) dadosInvestimento.objetivo = "Outros";

    if (dadosInvestimento.objetivo) {
      console.log("✅ Objetivo definido:", dadosInvestimento.objetivo);
    }
  }

  // Relação com investimento
  if (!dadosInvestimento.relacao) {
    if (/nunca invest/i.test(texto) && /não entendo|nao entendo|nada/i.test(texto))
      dadosInvestimento.relacao = "Nunca investiu e não entende nada";
    else if (/nunca invest/i.test(texto))
      dadosInvestimento.relacao = "Nunca investiu e entende pouco";
    else if (/algumas vezes/i.test(texto))
      dadosInvestimento.relacao = "Já investiu algumas vezes e entende um pouco";
    else if (/estou investindo|invisto/i.test(texto) && /pouco/i.test(texto))
      dadosInvestimento.relacao = "Está investindo e entende pouco";
    else if (/invisto sempre|experiência|experiencia/i.test(texto))
      dadosInvestimento.relacao = "Investe sempre e tem experiência";

    if (dadosInvestimento.relacao) {
      console.log("✅ Relação definida:", dadosInvestimento.relacao);
    }
  }

  console.log("📊 Estado atual dos dados:", dadosInvestimento);
}

function gerarPromptInvestimento(textoUsuario) {
  const contexto = historico.map(m => `${m.role}: ${m.content}`).join("\n");

  // Detecta quais campos estão faltando
  const faltando = [];
  if (dadosInvestimento.valor_inicial === null) faltando.push("valor inicial");
  if (dadosInvestimento.valor_mensal === null) faltando.push("valor mensal");
  if (dadosInvestimento.duracao === null) faltando.push("duração");
  if (dadosInvestimento.objetivo === null) faltando.push("objetivo");
  if (dadosInvestimento.relacao === null) faltando.push("relação com investimento");

  const faltandoTexto = faltando.join(", ");

  return `
    Você é um assistente do banco BTG Pactual.
    O usuário está fornecendo informações sobre um investimento que quer fazer.
    Seu objetivo é entender o que ele já respondeu e perguntar apenas o que falta, de forma natural e direta.

    As informações que você precisa coletar são:
    1. Valor inicial
    2. Valor mensal
    3. Duração (em anos, mínimo 1)
    4. Objetivo (Aumentar patrimônio, segurança financeira, economizar com IRPF, outros)
    5. Relação com investimento (Nunca investiu e não entende nada, Nunca investiu e entende pouco, já investiu algumas vezes e entende um pouco, está investindo e entende pouco, investe sempre e tem experiência)

    Dados já coletados:
    Valor inicial: ${dadosInvestimento.valor_inicial ?? "não informado"}
    Valor mensal: ${dadosInvestimento.valor_mensal ?? "não informado"}
    Duração: ${dadosInvestimento.duracao ?? "não informado"}
    Objetivo: ${dadosInvestimento.objetivo ?? "não informado"}
    Relação com investimento: ${dadosInvestimento.relacao ?? "não informado"}

    Mensagem do usuário: "${textoUsuario}"

    Contexto da conversa:
    ${contexto}

    Ainda faltam as seguintes informações: ${faltandoTexto || "nenhuma"}.

    ${
      dadosInvestimento.objetivo === null
        ? "Por favor, peça ao usuário que diga claramente o objetivo do investimento (indiretamente dando exemplos de segurança financeira, aumentar patrimônio, IRPF etc - sem usar estes termos) antes de prosseguir com qualquer recomendação."
        : "Se todos os dados já tiverem sido coletados, apenas faça um resumo objetivo das informações e siga para as sugestões de investimento."
    }
  `;
}

function coletaCompleta() {
  return (
    dadosInvestimento.valor_inicial !== null &&
    dadosInvestimento.valor_mensal !== null &&
    dadosInvestimento.duracao !== null &&
    dadosInvestimento.objetivo !== null &&
    dadosInvestimento.relacao !== null
  );
}

async function interpretarComIA(textoUsuario) {
  // Prompt que será enviado ao seu endpoint de chat. Pede-se apenas JSON sem explicações.
  const prompt = `
    Você é um analisador de mensagens em português. Receberá uma mensagem de usuário e deve RESPONDER
    EXCLUSIVAMENTE com um JSON válido (sem texto, sem explicações) com as seguintes chaves:
    - valor_inicial: número (float) ou null
    - valor_mensal: número (float) ou null
    - duracao: inteiro (anos) ou null
    - objetivo: uma das strings {"Aumentar patrimônio","Segurança financeira","Economizar com IRPF","Outros"} ou null
    - relacao: uma das strings {"Nunca investiu e não entende nada","Nunca investiu e entende pouco",
      "Já investiu algumas vezes e entende um pouco","Está investindo e entende pouco",
      "Investe sempre e tem experiência"} ou null

    Regras:
    1) Interprete números escritos por extenso (ex: "dez mil", "dois mil e quinhentos") e formatos com "mil", "k", "R$" etc.
    2) Normalizar para número puro (ex: "R$ 2.500,00" => 2500).
    3) Duração deve ser em anos. Se usuário disser "6 meses", converta para 0.5 (ou retorne o número de anos). Preferência por anos - se menos de 1 ano, retornar decimal (ex: 0.5).
    4) Se não houver informação para alguma chave, retornar null para ela.
    5) Retorne apenas o JSON (objeto), nada mais.

    Mensagem do usuário: """${textoUsuario}"""
  `;

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: prompt,
        modo: modoAtual,
        // se quiser sinalizar ao backend que é parse-only, inclua uma flag
        parse_only: true
      }),
    });

    const data = await response.json();

    // data.reply deve conter o JSON (mas pode vir com texto). Tentamos extrair o primeiro objeto JSON encontrado.
    const textoResposta = (data.reply || '').trim();

    // tenta extrair um bloco JSON do texto de resposta
    const match = textoResposta.match(/\{[\s\S]*\}/);
    if (!match) {
      console.warn("IA não retornou JSON detectável. Resposta inteira:", textoResposta);
      return null;
    }

    const jsonStr = match[0];
    const parsed = JSON.parse(jsonStr);

    // valida e normaliza tipos mínimos
    const resultado = {
      valor_inicial: parsed.valor_inicial != null ? Number(parsed.valor_inicial) : null,
      valor_mensal: parsed.valor_mensal != null ? Number(parsed.valor_mensal) : null,
      duracao: parsed.duracao != null ? Number(parsed.duracao) : null,
      objetivo: parsed.objetivo ?? null,
      relacao: parsed.relacao ?? null
    };

    return resultado;
  } catch (err) {
    console.error("Erro ao interpretar com IA:", err);
    return null;
  }
}

async function determinarPerfilInvestimento() {
  const prompt = `
  Você é um analista financeiro do BTG Pactual. 
  Com base nas informações abaixo, determine o PERFIL DO INVESTIMENTO ideal.
  Perfis possíveis: "Conservador", "Moderado", "Sofisticado".

  Dados:
  Valor inicial: ${dadosInvestimento.valor_inicial}
  Valor mensal: ${dadosInvestimento.valor_mensal}
  Duração: ${dadosInvestimento.duracao} anos
  Objetivo: ${dadosInvestimento.objetivo}
  Relação com investimento: ${dadosInvestimento.relacao}

  Critérios gerais:
  - Conservador: objetivos de segurança, prazos curtos (<2 anos), pouca experiência.
  - Moderado: prazos médios (2–5 anos), algum risco, alguma experiência.
  - Sofisticado: prazos longos, grandes valores, foco em patrimônio, experiência alta.

  Responda apenas com o nome do perfil, nada mais.
  `;
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: prompt, modo: modoAtual }),
    });
    const data = await response.json();
    const perfil = (data.reply || "").trim();
    dadosInvestimento.perfil_investimento = perfil;
    console.log("🏁 Perfil do investimento determinado:", perfil);
  } catch (err) {
    console.error("Erro ao determinar perfil do investimento:", err);
  }
}

async function enviarMensagem(event) {
  event.preventDefault();

  const input = document.getElementById('mensagem');
  const texto = input.value.trim(); // ⚠️ corrigido: faltavam parênteses
  const chat = document.getElementById('chat');

  if (!texto) return;

  // Exibe pergunta do usuário
  const pergunta = document.createElement('article');
  pergunta.classList.add('pergunta');
  pergunta.innerHTML = `<p>${texto}</p>`;
  chat.appendChild(pergunta);
  chat.scrollTop = chat.scrollHeight;
  input.value = '';
  contador_mensagens++;

  historico.push({ role: "user", content: texto });

  let mensagemParaAPI = texto;

  // 🔍 1) DETECTA PEDIDO DE CONSULTA DE INVESTIMENTOS
  if (/\b(consultar|ver|mostrar|listar|acompanhar)\b.*investiment/i.test(texto)) {
    const resposta = document.createElement('article');
    resposta.classList.add('resposta');
    resposta.innerHTML = `<p>Consultando seus investimentos...</p>`;
    chat.appendChild(resposta);
    chat.scrollTop = chat.scrollHeight;

    try {
      const resp = await consultarInvestimento();
      const lista = await resp.json();

      if (!lista || lista.length === 0) {
        resposta.innerHTML = `<p>Você ainda não possui investimentos registrados.</p>`;
      } else {
        let html = "<p>Seus investimentos atuais:</p><ul>";
        lista.forEach(inv => {
          html += `<li>
            Valor inicial: R$ ${inv.valor_inicial.toFixed(2)} |
            Valor mensal: R$ ${inv.valor_mensal.toFixed(2)} |
            Duração: ${inv.duracao} anos |
            Objetivo: ${inv.objetivo}
          </li>`;
        });
        html += "</ul>";
        resposta.innerHTML = html;
      }
    } catch (err) {
      console.error("Erro ao consultar investimentos:", err);
      resposta.innerHTML = `<p>Não foi possível consultar os investimentos no momento.</p>`;
    }

    chat.scrollTop = chat.scrollHeight;
    return; // ⛔ Evita continuar o fluxo normal
  }

  // 💬 Detecta início do modo de investimento
  if (/investimento|investir/i.test(texto) && !emColeta) {
    emColeta = true;
    etapaInvestimento = 1;
    mensagemParaAPI = gerarPromptInvestimento(texto);
  }
  // 🧠 Continua o modo de coleta de investimento
  else if (emColeta) {
    const parseResult = await interpretarComIA(texto);

    if (parseResult) {
      for (const chave in parseResult) {
        if (parseResult[chave] !== null && parseResult[chave] !== undefined) {
          dadosInvestimento[chave] = parseResult[chave];
          console.log(`✅ ${chave} definido (IA):`, dadosInvestimento[chave]);
        }
      }
    } else {
      extrairDados(texto); // fallback
    }

    mensagemParaAPI = gerarPromptInvestimento(texto);
  }
  // 👋 Primeira mensagem (inicial)
  else if (contador_mensagens === 1) {
    const instrucoesIniciais = `
      Você é um assistente virtual do banco BTG Pactual, criado para orientar clientes sobre investimentos de acordo com seu perfil de investidor.
      Estamos em 2025, em um cenário de economia brasileira estável, com juros moderados e crescente interesse em investimentos de renda variável e produtos digitais.
      Seu papel é ajudar o cliente a entender qual tipo de investimento faz mais sentido para ele e responder dúvidas sobre produtos financeiros.

      Você deve responder de forma curta, direta e sem formatação de texto.
      Há três perfis possíveis: Conservador, Moderado e Sofisticado.
      
      Modo atual: ${modoAtual}
      Usuário: ${texto}
    `;
    mensagemParaAPI = instrucoesIniciais;
  } else {
    mensagemParaAPI = `[Modo: ${modoAtual}]\n${texto}`;
  }

  // 📡 Chamada à API do chat (resposta do assistente)
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message: mensagemParaAPI,
      modo: modoAtual
    }),
  });

  const data = await response.json();

  historico.push({ role: "assistant", content: data.reply });

  const resposta = document.createElement('article');
  resposta.classList.add('resposta');
  resposta.innerHTML = `<p>${data.reply}</p>`;
  chat.appendChild(resposta);
  chat.scrollTop = chat.scrollHeight;

  // 🏁 Exibe resumo final quando coleta estiver completa
  if (emColeta && coletaCompleta()) {
    emColeta = false;

    await determinarPerfilInvestimento();

    const resumo = `
      Investimento completo:
      Valor inicial: ${dadosInvestimento.valor_inicial}
      Valor mensal: ${dadosInvestimento.valor_mensal}
      Duração: ${dadosInvestimento.duracao} anos
      Objetivo: ${dadosInvestimento.objetivo}
      Relação com investimento: ${dadosInvestimento.relacao}
      Perfil do investimento: ${dadosInvestimento.perfil_investimento}
    `;
    const respostaFinal = document.createElement('article');
    respostaFinal.classList.add('resposta');
    respostaFinal.innerHTML = `<p>${resumo}</p>`;
    chat.appendChild(respostaFinal);
    chat.scrollTop = chat.scrollHeight;
  }
}

async function salvarInvestimento(dados) {
  try{
    const resp = await fetch("https://localhost:8080/investimentos",{
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados)
    });
    const result = await resp.json();
    console.log("Investimento salvo:", result);
  }catch(err){
    consolo.log("Erro ao salvar investimento:", err);
  }
}

async function consultarInvestimento() {
  try {
    const resp = await fetch("http://localhost:8080/investimentos");
    return resp;
  } catch (err) {
    console.error("Erro ao consultar investimentos:", err);
    throw err;
  }
}
