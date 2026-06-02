const API_BASE_URL = 'https://pedeja-backend.onrender.com/api';

const params = new URLSearchParams(window.location.search);
const produtoId = Number(params.get('produtoId') || params.get('id'));

const usuarioLogado =
  JSON.parse(localStorage.getItem('pedeja_user')) ||
  JSON.parse(sessionStorage.getItem('pedeja_user'));

const currency = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

const imgProdutoEl = document.querySelector('#img-produto img');
const nomeProdutoEl = document.getElementById('nome-produto');
const precoProdutoEl = document.getElementById('preco-produto');
const descricaoProdutoEl = document.getElementById('descricao-produto');
const quantidadeEl = document.querySelector('.contador .quantidade');
const btnMais = document.querySelector('.contador .mais');
const btnMenos = document.querySelector('.contador .menos');
const btnAdicionar = document.getElementById('btn-adicionar');
const btnContinuar = document.getElementById('btn-continuar');
const feedbackEl = document.getElementById('produto-feedback');

let produtoAtual = null;
let quantidadeAtual = 1;
let carregando = false;


function redirectToLogin() {
  window.location.href = 'Login.html';
}

function setFeedback(message, type = 'error') {
  if (!feedbackEl) return;
  feedbackEl.textContent = message;
  feedbackEl.hidden = !message;
  feedbackEl.className = `produto-feedback ${type}`;
}

function setLoading(state) {
  carregando = state;
  if (btnAdicionar) btnAdicionar.disabled = state;
  if (btnContinuar) btnContinuar.disabled = state;
}

function formatCurrency(value) {
  return currency.format(Number(value) || 0);
}

function atualizarQuantidadeDisplay() {
  if (quantidadeEl) quantidadeEl.textContent = quantidadeAtual;
}


function aplicarDadosProduto(produto) {
  produtoAtual = produto;

  if (nomeProdutoEl) nomeProdutoEl.textContent = produto.nome;
  if (precoProdutoEl)
    precoProdutoEl.textContent = formatCurrency(produto.preco);

  if (descricaoProdutoEl)
    descricaoProdutoEl.textContent =
      produto.descricao || 'Sem descrição disponível.';

  if (imgProdutoEl)
    imgProdutoEl.src = produto.imagemurl || './images/Product.png';
}

async function carregarProduto() {
  if (!produtoId) {
    setFeedback('Produto não informado na URL.');
    desabilitarBotoes();
    return;
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/produtos/${produtoId}`
    );

    if (!response.ok) {
      throw new Error('Produto não encontrado.');
    }

    const data = await response.json();
    aplicarDadosProduto(data);
    setFeedback('');
  } catch (error) {
    console.error(error);
    setFeedback(error.message || 'Erro ao carregar produto.');
    desabilitarBotoes();
  }
}

function desabilitarBotoes() {
  if (btnAdicionar) btnAdicionar.disabled = true;
  if (btnMais) btnMais.disabled = true;
  if (btnMenos) btnMenos.disabled = true;
}



async function adicionarAoCarrinho({ redirectTo } = {}) {
  if (!produtoAtual) {
    setFeedback('Produto não carregado.');
    return false;
  }

  if (!usuarioLogado) {
    redirectToLogin();
    return false;
  }

  setLoading(true);

  try {
    const response = await fetch(`${API_BASE_URL}/cart/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        produtoId: produtoAtual.produtoid,
        quantidade: quantidadeAtual,
      }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Erro ao adicionar ao carrinho.');
    }

    setFeedback('Produto adicionado ao carrinho!', 'success');
    quantidadeAtual = 1;
    atualizarQuantidadeDisplay();

    if (redirectTo) {
      setTimeout(() => {
        window.location.href = redirectTo;
      }, 600);
    }

    return true;
  } catch (error) {
    console.error(error);
    setFeedback(error.message || 'Erro ao adicionar ao carrinho.');
    return false;
  } finally {
    setLoading(false);
  }
}


function configurarEventos() {
  btnMais?.addEventListener('click', () => {
    quantidadeAtual++;
    atualizarQuantidadeDisplay();
  });

  btnMenos?.addEventListener('click', () => {
    quantidadeAtual = Math.max(1, quantidadeAtual - 1);
    atualizarQuantidadeDisplay();
  });

  btnAdicionar?.addEventListener('click', () => {
    adicionarAoCarrinho({ redirectTo: 'Navegacao.html' });
  });

  btnContinuar?.addEventListener('click', () => {
    adicionarAoCarrinho({ redirectTo: 'Carrinho.html' });
  });
}


function inicializar() {
  atualizarQuantidadeDisplay();
  configurarEventos();
  carregarProduto();
}

document.addEventListener('DOMContentLoaded', inicializar);
