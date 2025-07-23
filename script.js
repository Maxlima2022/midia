// 🔑 INSIRA SUAS CHAVES AQUI
const weatherApiKey = "6c289d4113ec3d26a15f39708dd196f0";

async function updateWeather() {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=São Paulo&appid=${weatherApiKey}&units=metric&lang=pt`);
        const data = await response.json();

        if (data.cod !== 200) {
            throw new Error(data.message);
        }

        document.getElementById('tempo').innerHTML = `
            <strong>${data.name}</strong><br>
            ${data.weather[0].description}<br>
            🌡 ${data.main.temp}°C
        `;
    } catch (error) {
        document.getElementById('tempo').innerText = "Erro ao obter clima: " + error.message;
    }
}

updateWeather();

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
