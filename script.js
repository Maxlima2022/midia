const weatherApiKey = "6c289d4113ec3d26a15f39708dd196f0";
const stockApiKey = "928eb97c18ee4957b1e71e9ab455ae0c";

async function carregarPrevisaoTempo() {
  const cidade = "Sao Paulo";
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${cidade}&units=metric&appid=${weatherApiKey}&lang=pt_br`;
  try {
    const response = await fetch(url);
    const dados = await response.json();

    const container = document.querySelector(".dias");
    container.innerHTML = "";

    const mostrados = new Set();
    dados.list.forEach((item) => {
      const data = new Date(item.dt * 1000);
      const diaSemana = data.toLocaleDateString("pt-BR", { weekday: 'long' });

      if (!mostrados.has(diaSemana) && mostrados.size < 4) {
        mostrados.add(diaSemana);
        const temp = Math.round(item.main.temp);
        const icon = item.weather[0].icon;
        const html = `
          <div>
            <p>${diaSemana}</p>
            <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="tempo">
            <p>${temp}°C</p>
          </div>
        `;
        container.innerHTML += html;
      }
    });
  } catch (e) {
    console.error("Erro ao carregar previsão do tempo", e);
  }
}

async function carregarBolsaValores() {
  const symbols = ["SPX", "NDX", "DJI"];
  const mercadoEl = document.querySelector(".mercado ul");
  mercadoEl.innerHTML = "";

  for (const symbol of symbols) {
    try {
      const response = await fetch(`https://api.twelvedata.com/quote?symbol=${symbol}&apikey=${stockApiKey}`);
      const dados = await response.json();

      if (!dados.price || !dados.percent_change) {
        console.error(`Dados inválidos para ${symbol}:`, dados);
        throw new Error('Dados inválidos');
      }

      const variacao = parseFloat(dados.percent_change);
      const sinal = variacao >= 0 ? "▲" : "▼";
      const classe = variacao >= 0 ? "up" : "down";

      mercadoEl.innerHTML += `
        <li>${symbol}: <span class="${classe}">${dados.price} ${sinal} ${variacao}%</span></li>
      `;
    } catch (e) {
      console.error(`Erro ao carregar ${symbol}:`, e);
      mercadoEl.innerHTML += `<li>${symbol}: <span class="down">Erro ao carregar</span></li>`;
    }
  }
}

function atualizarHora() {
  const agora = new Date();
  const hora = agora.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  document.getElementById("hora").textContent = hora;
}

setInterval(atualizarHora, 1000);
atualizarHora();
carregarPrevisaoTempo();
carregarBolsaValores();
setInterval(() => {
  carregarPrevisaoTempo();
  carregarBolsaValores();
}, 600000);
