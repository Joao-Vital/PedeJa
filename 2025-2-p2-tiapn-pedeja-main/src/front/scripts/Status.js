const API_BASE_URL = window.env?.API_BASE_URL || '/api';
const token = localStorage.getItem('pedeja_token');
const REFRESH_INTERVAL = 15000;

const timelineList = document.getElementById('timeline-list');
const cardsList = document.getElementById('cards-list');
const emptyCards = document.getElementById('pedido-vazio');
const codigoPedidoEl = document.getElementById('codigo-pedido');
const formaPagamentoEl = document.getElementById('forma-pagamento');
const statusAtualEl = document.getElementById('status-atual');
const dataPedidoEl = document.getElementById('data-pedido');
const subtotalEl = document.getElementById('pedido-subtotal');
const taxasEl = document.getElementById('pedido-taxas');
const totalEl = document.getElementById('pedido-total');

const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const timeFormatter = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' });
const datetimeFormatter = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium', timeStyle: 'short' });

let refreshHandle = null;

function redirectToLogin() {
  window.location.href = 'Login.html';
}

function injectToastStyles() {
  if (document.getElementById('toast-style')) {
    return;
  }
  const style = document.createElement('style');
  style.id = 'toast-style';
  style.textContent = `
    .toast-message {
      position: fixed;
      bottom: 24px;
      right: 24px;
      padding: 12px 20px;
      border-radius: 8px;
      color: #fff;
      font-weight: 600;
      z-index: 2000;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      opacity: 0.95;
    }
    .toast-message.success { background-color: #2d8a4b; }
    .toast-message.error { background-color: #d64545; }
  `;
  document.head.appendChild(style);
}

function showNotification(message, type = 'error') {
  injectToastStyles();
  const existing = document.querySelector('.toast-message');
  if (existing) {
    existing.remove();
  }

  const toast = document.createElement('div');
  toast.className = `toast-message ${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2500);
}

function formatTime(value) {
  if (!value) {
    return '--:--';
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '--:--';
  }
  return timeFormatter.format(date);
}

function formatDate(value) {
  if (!value) {
    return '--';
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '--';
  }
  return datetimeFormatter.format(date);
}

function resolveImage(path) {
  if (!path) {
    return null;
  }
  if (path.startsWith('http')) {
    return path;
  }
  return `./${path.replace(/^\.\/?/, '')}`;
}

function showEmptyOrder(message) {
  timelineList.innerHTML = `<p class="lista-vazia">${message}</p>`;
  cardsList.innerHTML = '';
  if (emptyCards) {
    emptyCards.hidden = false;
  }
  codigoPedidoEl.textContent = 'Pedido não encontrado';
  formaPagamentoEl.textContent = '--';
  statusAtualEl.textContent = '--';
  dataPedidoEl.textContent = '--';
  subtotalEl.textContent = currency.format(0);
  taxasEl.textContent = currency.format(0);
  totalEl.textContent = currency.format(0);
}

function renderTimeline(etapas = [], historico = []) {
  if (!timelineList) {
    return;
  }

  timelineList.innerHTML = '';
  if (!etapas.length) {
    timelineList.innerHTML = '<p class="lista-vazia">Fluxo de status não disponível.</p>';
    return;
  }

  const historyMap = new Map();
  historico.forEach((entry) => {
    historyMap.set(entry.status, entry);
  });
  const latest = historico[historico.length - 1]?.status;

  etapas.forEach((etapa) => {
    const entry = historyMap.get(etapa.nome);
    const item = document.createElement('div');
    item.className = 'timeline-item';
    if (entry) {
      item.classList.add('is-done');
    }
    if (entry && entry.status === latest) {
      item.classList.add('is-current');
    }

    item.innerHTML = `
      <div class="timeline-dot"></div>
      <div class="timeline-content">
        <p class="time">${entry ? formatTime(entry.registradoEm) : '--:--'}</p>
        <h4>${etapa.nome}</h4>
        <p class="desc">${etapa.descricao || 'Aguarde atualizações.'}</p>
      </div>
    `;

    timelineList.appendChild(item);
  });
}

function renderItems(itens = []) {
  if (!cardsList) {
    return;
  }

  cardsList.innerHTML = '';
  if (!itens.length) {
    if (emptyCards) {
      emptyCards.hidden = false;
    }
    return;
  }

  if (emptyCards) {
    emptyCards.hidden = true;
  }
  itens.forEach((item) => {
    const card = document.createElement('div');
    card.className = 'card';
    const image = resolveImage(item.imagemUrl);
    const quantity = Number(item.quantidade) || 0;
    card.innerHTML = `
      <div class="img-placeholder">
        ${image ? `<img src="${image}" alt="${item.nome}">` : '<i class="bi bi-bag"></i>'}
      </div>
      <div class="card-body">
        <p class="nome">${item.nome}</p>
        ${item.observacao ? `<p class="descricao">${item.observacao}</p>` : ''}
        <p class="preco">
          ${currency.format(item.totalItem || 0)}
          <span class="unit-price">(${currency.format(item.precoUnitario || 0)} cada)</span>
        </p>
      </div>
      <div class="qty">x ${quantity}</div>
    `;
    cardsList.appendChild(card);
  });
}

function renderSummary(pedido) {
  const resumo = pedido?.resumo || {};
  codigoPedidoEl.textContent = pedido?.codigoLocalizador ? `Pedido #${pedido.codigoLocalizador}` : 'Pedido #------';
  formaPagamentoEl.textContent = pedido?.formaPagamento || '--';
  statusAtualEl.textContent = pedido?.statusAtual || '--';
  dataPedidoEl.textContent = `Realizado em ${formatDate(pedido?.dataPedido)}`;
  subtotalEl.textContent = currency.format(resumo.subtotal || 0);
  taxasEl.textContent = currency.format(resumo.taxas || 0);
  totalEl.textContent = currency.format(resumo.total || 0);
}

function renderPedido(data) {
  if (!data) {
    showEmptyOrder('Não foi possível carregar o pedido.');
    return;
  }
  renderSummary(data);
  renderTimeline(data.etapas, data.historico);
  renderItems(data.itens);
}

async function fetchLatestOrder(showErrors = true) {
  try {
    const response = await fetch(`${API_BASE_URL}/orders/latest`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 401) {
      redirectToLogin();
      return;
    }

    if (response.status === 404) {
      showEmptyOrder('Nenhum pedido recente encontrado. Finalize um pedido para acompanhar aqui.');
      return;
    }

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Erro ao consultar status do pedido.');
    }

    renderPedido(data);
  } catch (error) {
    console.error(error);
    if (showErrors) {
      showNotification(error.message || 'Erro inesperado ao carregar o status.');
    }
  }
}

function init() {
  if (!timelineList || !cardsList) {
    console.warn('Status.js: elementos necessários não encontrados na página.');
    return;
  }

  if (!token) {
    redirectToLogin();
    return;
  }

  fetchLatestOrder();
  refreshHandle = setInterval(() => fetchLatestOrder(false), REFRESH_INTERVAL);
}

window.addEventListener('beforeunload', () => {
  if (refreshHandle) {
    clearInterval(refreshHandle);
  }
});

init();
