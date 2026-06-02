const API_BASE_URL = 'https://pedeja-backend.onrender.com/api/oficinas';

const usuarioLogado =
  JSON.parse(localStorage.getItem('pedeja_user')) ||
  JSON.parse(sessionStorage.getItem('pedeja_user'));

const listaOficinasEl = document.getElementById('lista-oficinas');
const filtroFavoritasBtn = document.getElementById('btn-favoritas');
const filtroTodasBtn = document.getElementById('btn-todas');

let oficinasCache = [];

function exigirLogin() {
  if (!usuarioLogado) {
    window.location.href = 'Login.html';
    return false;
  }
  return true;
}

async function carregarOficinas() {
  try {
    const res = await fetch(API_BASE_URL);
    const data = await res.json();

    if (!res.ok) throw new Error('Erro ao carregar oficinas');

    oficinasCache = data;
    renderizarOficinas(data);
  } catch (err) {
    console.error(err);
    listaOficinasEl.innerHTML = '<p>Erro ao carregar oficinas</p>';
  }
}

function renderizarOficinas(oficinas) {
  listaOficinasEl.innerHTML = '';

  if (!oficinas.length) {
    listaOficinasEl.innerHTML = '<p>Nenhuma oficina encontrada.</p>';
    return;
  }

  oficinas.forEach(oficina => {
    const card = document.createElement('div');
    card.className = 'oficina-card';

    card.innerHTML = `
      <h3>${oficina.nome}</h3>
      <p>${oficina.descricao || ''}</p>
      <span>Duração: ${oficina.duracao}</span>

      <button class="btn-favorito ${oficina.isfavorito ? 'ativo' : ''}">
        ${oficina.isfavorito ? '♥' : '♡'}
      </button>
    `;

    const btnFav = card.querySelector('.btn-favorito');
    btnFav.addEventListener('click', () => toggleFavorito(oficina));

    listaOficinasEl.appendChild(card);
  });
}

async function toggleFavorito(oficina) {
  if (!exigirLogin()) return;

  try {
    const res = await fetch(`${API_BASE_URL}/${oficina.id}/favorito`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!res.ok) throw new Error('Erro ao favoritar');

    oficina.isfavorito = !oficina.isfavorito;
    renderizarOficinas(oficinasCache);
  } catch (err) {
    console.error(err);
    alert('Erro ao atualizar favorito');
  }
}

if (filtroFavoritasBtn) {
  filtroFavoritasBtn.addEventListener('click', () => {
    renderizarOficinas(oficinasCache.filter(o => o.isfavorito));
  });
}

if (filtroTodasBtn) {
  filtroTodasBtn.addEventListener('click', () => {
    renderizarOficinas(oficinasCache);
  });
}

document.addEventListener('DOMContentLoaded', carregarOficinas);
