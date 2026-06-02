const API_BASE_URL = 'https://pedeja-backend.onrender.com/api';

const usuarioLogado =
  JSON.parse(localStorage.getItem('pedeja_user')) ||
  JSON.parse(sessionStorage.getItem('pedeja_user'));

const currency = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

let listaProdutosEl = null;

// Função auxiliar para resolver campos do produto (minúsculo/maiúsculo)
function resolveProdutoField(produto, primary, fallback) {
  return produto?.[primary] ?? produto?.[fallback];
}

// Função para resolver a URL da imagem
function resolveImageUrl(produto) {
  const fotoPath = resolveProdutoField(produto, 'foto', 'imagemurl') || 
                   resolveProdutoField(produto, 'ImagemUrl', 'imagemUrl');
  
  if (!fotoPath) return './images/Product.png';
  
  if (/^https?:/i.test(fotoPath)) {
    return fotoPath;
  }
  
  const baseUrl = 'https://pedeja-backend.onrender.com';
  return `${baseUrl}${fotoPath.startsWith('/') ? '' : '/'}${fotoPath}`;
}

async function fetchProducts(categoria) {
  const params = new URLSearchParams();
  if (categoria) params.append('categoria', categoria);

  const response = await fetch(
    `${API_BASE_URL}/produtos${params.toString() ? '?' + params : ''}`
  );

  if (!response.ok) {
    throw new Error('Erro ao buscar produtos');
  }

  return response.json();
}

function formatCurrency(valor) {
  return currency.format(Number(valor) || 0);
}

function criarCardProduto(produto) {
  const article = document.createElement('article');
  article.classList.add('produto');
  
  const produtoId = resolveProdutoField(produto, 'id', 'produtoid') || 
                    resolveProdutoField(produto, 'ProdutoId', 'produtoId');
  article.dataset.produtoId = produtoId;

  const nome = resolveProdutoField(produto, 'nome', 'Nome') || '';
  const descricao = resolveProdutoField(produto, 'descricao', 'Descricao') || '';
  const preco = resolveProdutoField(produto, 'preco', 'Preco') || 0;
  const imgUrl = resolveImageUrl(produto);

  article.innerHTML = `
    <div class="info-produto">
      <div class="img-produto">
        <img src="${imgUrl}" alt="${nome}">
      </div>

      <div class="txt-produto">
        <h3>${nome}</h3>
        <p>${descricao}</p>
      </div>

      <div class="detalhes-compra">
        <span class="preco">${formatCurrency(preco)}</span>
        <button class="btn-adicionar">Adicionar</button>
      </div>
    </div>
  `;

  return article;
}

async function carregarProdutos(categoria) {
  listaProdutosEl.innerHTML = '<p>Carregando produtos...</p>';

  try {
    const produtos = await fetchProducts(categoria);

    console.log('Produtos recebidos:', produtos);

    if (!produtos.length) {
      listaProdutosEl.innerHTML = '<p>Nenhum produto encontrado.</p>';
      return;
    }

    listaProdutosEl.innerHTML = '';

    produtos.forEach((produto) => {
      const card = criarCardProduto(produto);
      listaProdutosEl.appendChild(card);
    });
  } catch (error) {
    console.error(error);
    listaProdutosEl.innerHTML =
      '<p>Erro ao carregar produtos. Tente novamente.</p>';
  }
}

function configurarCategorias() {
  document.querySelector('.categorias').addEventListener('click', (e) => {
    const link = e.target.closest('a[data-categoria]');
    if (!link) return;

    e.preventDefault();
    const categoria = link.dataset.categoria;
    carregarProdutos(categoria);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  listaProdutosEl = document.getElementById('lista-produtos');

  configurarCategorias();

  const categoriaDefault =
    document.getElementById('produtos')?.dataset.categoriaDefault;

  carregarProdutos(categoriaDefault);
});
