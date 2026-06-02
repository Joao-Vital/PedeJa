const API_BASE_URL = window.env?.API_BASE_URL || '/api';
const token = localStorage.getItem('pedeja_token');

const totalItensEl = document.getElementById('qntd-itens');
const valorTotalEl = document.getElementById('valor-total');
const itensContainer = document.getElementById('lista-itens');
const finalizarBtn = document.getElementById('btn-finalizar-pedido');
const paymentButtons = document.querySelectorAll('.metodo[data-payment]');

const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
let selectedPayment = null;

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

function handlePaymentSelection(button) {
  paymentButtons.forEach((btn) => {
    const isActive = btn === button;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
  });
  selectedPayment = button.dataset.payment;
}

function renderEmptyState() {
  itensContainer.innerHTML = '<p class="lista-vazia">Nenhum item encontrado. Volte ao carrinho para adicionar produtos.</p>';
}

function renderItems(items) {
  if (!items.length) {
    renderEmptyState();
    return;
  }

  itensContainer.innerHTML = '';
  items.forEach((item) => {
    const wrapper = document.createElement('div');
    wrapper.className = 'itens-pedido';
    wrapper.innerHTML = `
      <button type="button" class="btn-remove-item" data-item-id="${item.itemCarrinhoId}" aria-label="Remover ${item.nome}">
        <i class="bi bi-trash3-fill"></i>
      </button>
      <div class="info-item">
        <p class="quantidade-item">${item.quantidade}x</p>
        <p class="nome-item">${item.nome}</p>
      </div>
      <p class="preco-item">${currency.format(item.totalItem)}</p>
    `;
    itensContainer.appendChild(wrapper);
  });
}

function renderSummary(data) {
  totalItensEl.textContent = data.totalItens;
  valorTotalEl.textContent = currency.format(data.resumo.total);
  renderItems(data.itens);
}

async function fetchCheckout() {
  try {
    const response = await fetch(`${API_BASE_URL}/orders/checkout`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.status === 401) {
      redirectToLogin();
      return;
    }

    const data = await response.json();
    if (!response.ok) {
      if (response.status === 400) {
        renderEmptyState();
        totalItensEl.textContent = '0';
        valorTotalEl.textContent = currency.format(0);
      }
      throw new Error(data.message || 'Não foi possível carregar o pedido.');
    }

    renderSummary(data);
  } catch (error) {
    showNotification(error.message || 'Erro inesperado ao carregar o pedido.');
  }
}

async function removeItem(itemId) {
  try {
    const response = await fetch(`${API_BASE_URL}/cart/items/${itemId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Erro ao remover item.');
    }
    await fetchCheckout();
  } catch (error) {
    showNotification(error.message || 'Erro ao remover item.');
  }
}

function handleItemsClick(event) {
  const target = event.target.closest('.btn-remove-item');
  if (!target) {
    return;
  }

  const itemId = Number(target.dataset.itemId);
  if (!itemId) {
    return;
  }
  removeItem(itemId);
}

async function finalizeOrder() {
  if (!selectedPayment) {
    showNotification('Selecione uma forma de pagamento.', 'error');
    return;
  }

  try {
    finalizarBtn.disabled = true;
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ formaPagamento: selectedPayment }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Erro ao finalizar pedido.');
    }

    showNotification('Pedido criado com sucesso!', 'success');
    setTimeout(() => {
      window.location.href = 'Status.html';
    }, 1200);
  } catch (error) {
    showNotification(error.message || 'Erro inesperado ao finalizar pedido.');
  } finally {
    finalizarBtn.disabled = false;
  }
}

function init() {
  if (!totalItensEl || !valorTotalEl || !itensContainer || !finalizarBtn) {
    console.warn('Pedido.js: elementos necessários não foram encontrados na página.');
    return;
  }

  if (!token) {
    redirectToLogin();
    return;
  }

  fetchCheckout();

  paymentButtons.forEach((button) => {
    button.addEventListener('click', () => handlePaymentSelection(button));
  });

  itensContainer.addEventListener('click', handleItemsClick);
  finalizarBtn.addEventListener('click', finalizeOrder);
}

init();
