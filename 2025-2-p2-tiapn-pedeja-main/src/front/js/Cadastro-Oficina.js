const API_BASE_URL = 'https://pedeja-backend.onrender.com/api/oficinas';

const usuarioLogado =
  JSON.parse(localStorage.getItem('pedeja_user')) ||
  JSON.parse(sessionStorage.getItem('pedeja_user'));

const form = document.querySelector('[data-form-oficina]');
const params = new URLSearchParams(window.location.search);
const oficinaId = params.get('id');

function exigirLogin() {
  if (!usuarioLogado) {
    window.location.href = 'Login.html';
    return false;
  }
  return true;
}

async function carregarOficina() {
  if (!oficinaId) return;

  try {
    const res = await fetch(`${API_BASE_URL}/${oficinaId}`);
    const oficina = await res.json();

    if (!res.ok) throw new Error('Erro ao carregar oficina');

    form.nome.value = oficina.nome;
    form.descricao.value = oficina.descricao;
    form.duracao.value = oficina.duracao;
    form.status.value = oficina.status;
  } catch (err) {
    console.error(err);
    alert('Erro ao carregar oficina');
  }
}

form.addEventListener('submit', async e => {
  e.preventDefault();
  if (!exigirLogin()) return;

  const payload = {
    nome: form.nome.value,
    descricao: form.descricao.value,
    duracao: form.duracao.value,
    status: form.status.value
  };

  try {
    const res = await fetch(
      oficinaId ? `${API_BASE_URL}/${oficinaId}` : API_BASE_URL,
      {
        method: oficinaId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }
    );

    if (!res.ok) throw new Error('Erro ao salvar oficina');

    alert('Oficina salva com sucesso!');
    window.location.href = 'Oficina.html';
  } catch (err) {
    console.error(err);
    alert('Erro ao salvar oficina');
  }
});

document.addEventListener('DOMContentLoaded', carregarOficina);
