// 🔑 INSIRA SUAS CHAVES AQUI
const weatherApiKey = "6c289d4113ec3d26a15f39708dd196f0";
const stockApiKey = "SUA_API_KEY_TWELVE_DATA";

// 🌦️ Clima Atual (exemplo para São Paulo)
async function carregarPrevisaoTempo() {
  const cidade = "Sao Paulo";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=São Paulo&appid=${weatherApiKey}&units=metric&lang=pt`;

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
}

// 📈 Cotação da Bolsa
async function carregarBolsaValores() {
  const symbols = ["SPX", "NDX", "DJI"];
  const response = await fetch(`https://api.twelvedata.com/quote?symbol=${symbols.join(",")}&apikey=${stockApiKey}`);
  const dados = await response.json();

  const mercadoEl = document.querySelector(".mercado ul");
  mercadoEl.innerHTML = "";

  for (const symbol of symbols) {
    const d = dados[symbol];
    const variacao = parseFloat(d.percent_change);
    const sinal = variacao >= 0 ? "▲" : "▼";
    const classe = variacao >= 0 ? "up" : "down";

    mercadoEl.innerHTML += `
      <li>${symbol}: <span class="${classe}">${d.price} ${sinal} ${variacao}%</span></li>
    `;
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
