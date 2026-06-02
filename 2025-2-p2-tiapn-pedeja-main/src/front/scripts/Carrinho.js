const API_BASE_URL = window.env?.API_BASE_URL || '/api';
const usuarioLogado =
  JSON.parse(localStorage.getItem('pedeja_user')) ||
  JSON.parse(sessionStorage.getItem('pedeja_user'));

const contentItens = document.getElementById('content-itens');
const emptyMessage = document.getElementById('empty-cart-message');
const subtotalEl = document.getElementById('subtotal');
const descontoEl = document.getElementById('desconto');
const taxasEl = document.getElementById('taxas');
const totalEl = document.getElementById('total');
const btnContinuar = document.getElementById('btn-continuar');
const btnFinalizar = document.getElementById('btn-finalizar');

const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
let currentCart = null;

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

function redirectToLogin() {
	window.location.href = 'Login.html';
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

function createItemCard(item) {
	const imageSrc = item.imagemUrl
		? item.imagemUrl.startsWith('http')
			? item.imagemUrl
			: `./${item.imagemUrl}`
		: './images/logo-removebg-preview.png';

	const card = document.createElement('div');
	card.className = 'produtos';
	card.innerHTML = `
		<div id="detalhes-produto">
			<div id="img-produto">
				<img src="${imageSrc}" alt="${item.nome}">
			</div>
			<div id="txt-produto">
				<h2 id="nome">${item.nome}</h2>
				<p id="descricao">${item.descricao || ''}</p>
				<p id="preco">Preço: ${currency.format(item.precoUnitario)}</p>
			</div>
		</div>
		<div id="acoes-produto">
			<div id="remover-produto" data-action="remove" data-item-id="${item.itemCarrinhoId}">
				<i class="bi bi-trash3-fill"></i>
				<span>Remover</span>
			</div>
			<div class="contador" data-item-id="${item.itemCarrinhoId}">
				<button class="btn-contador menos" type="button" data-action="decrease" data-item-id="${item.itemCarrinhoId}">
					<i class="bi bi-dash"></i>
				</button>
				<span class="quantidade">${item.quantidade}</span>
				<button class="btn-contador mais" type="button" data-action="increase" data-item-id="${item.itemCarrinhoId}">
					<i class="bi bi-plus"></i>
				</button>
			</div>
		</div>`;

	return card;
}

function renderCart(cart) {
	currentCart = cart;
	contentItens.innerHTML = '';

	if (!cart.itens.length) {
		emptyMessage.hidden = false;
		return;
	}

	emptyMessage.hidden = true;
	cart.itens.forEach((item) => {
		const card = createItemCard(item);
		contentItens.appendChild(card);
	});

	subtotalEl.textContent = currency.format(cart.resumo.subtotal);
	descontoEl.textContent = currency.format(cart.resumo.desconto);
	taxasEl.textContent = currency.format(cart.resumo.taxas);
	totalEl.textContent = currency.format(cart.resumo.total);
}

async function fetchCart() {
	if (!token) {
		redirectToLogin();
		return;
	}

	try {
		const response = await fetch(`${API_BASE_URL}/cart`, {
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
			throw new Error(data.message || 'Erro ao carregar o carrinho.');
		}

		renderCart(data);
	} catch (error) {
		console.error(error);
		showNotification(error.message || 'Erro inesperado ao carregar o carrinho.');
	}
}

async function updateItemQuantity(itemId, quantity) {
	if (quantity < 1) {
		return removeItem(itemId);
	}

	try {
		const response = await fetch(`${API_BASE_URL}/cart/items/${itemId}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ quantidade: quantity }),
		});
		const data = await response.json();
		if (!response.ok) {
			throw new Error(data.message || 'Erro ao atualizar item.');
		}
		renderCart(data);
	} catch (error) {
		showNotification(error.message);
	}
}

async function removeItem(itemId) {
	/*
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
		renderCart(data);
		return;
	} catch (error) {
		showNotification(error.message);
		return;
	}
	*/

	if (!currentCart) {
		showNotification('Carrinho ainda não carregado. Tente novamente.', 'error');
		return;
	}

	const item = currentCart.itens.find((produto) => produto.itemCarrinhoId === itemId);
	if (!item) {
		showNotification('Item não encontrado no carrinho atual.', 'error');
		return;
	}

	const itemTotal = (Number(item.precoUnitario) || 0) * (Number(item.quantidade) || 0);
	currentCart.itens = currentCart.itens.filter((produto) => produto.itemCarrinhoId !== itemId);

	const resumoAtual = currentCart.resumo || { subtotal: 0, desconto: 0, taxas: 0, total: 0 };
	const subtotal = Math.max(0, Number(resumoAtual.subtotal || 0) - itemTotal);
	const total = Math.max(0, Number(resumoAtual.total || 0) - itemTotal);

	currentCart.resumo = {
		...resumoAtual,
		subtotal,
		total,
	};

	renderCart(currentCart);
	showNotification('Item removido.', 'success');
}

function handleQuantityClick(event) {
	const button = event.target.closest('[data-action]');
	if (!button) {
		return;
	}

	const action = button.dataset.action;
	const itemId = Number(button.dataset.itemId);
	if (!itemId) {
		return;
	}

	if (action === 'remove') {
		removeItem(itemId);
		return;
	}

	const counter = button.closest('.contador');
	const quantityEl = counter?.querySelector('.quantidade');
	if (!quantityEl) {
		return;
	}

	let value = Number(quantityEl.textContent) || 1;
	if (action === 'increase') {
		value += 1;
	} else if (action === 'decrease') {
		value -= 1;
	}

	value = Math.max(1, value);
	quantityEl.textContent = value;
	updateItemQuantity(itemId, value);
}

if (!token) {
	redirectToLogin();
} else {
	fetchCart();
}

if (contentItens) {
	contentItens.addEventListener('click', handleQuantityClick);
}

if (btnContinuar) {
	btnContinuar.addEventListener('click', () => {
		window.location.href = 'index.html';
	});
}

if (btnFinalizar) {
	btnFinalizar.addEventListener('click', () => {
		window.location.href = 'Pedido.html';
	});
}
