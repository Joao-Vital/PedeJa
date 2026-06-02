

// URL do backend em produção (Render)
const API_BASE_URL = 'https://pedeja-backend.onrender.com';
const PRODUCTS_ENDPOINT = `${API_BASE_URL}/api/produtos`;

let produtos = [];
let editingId = null;

function resolveProdutoField(produto, primary, fallback) {
    return produto?.[primary] ?? produto?.[fallback];
}

function findProdutoById(id) {
    return produtos.find(p => (p.id ?? p.ProdutoId) === id);
}

function resolveImageUrl(produto) {
    const fotoPath = resolveProdutoField(produto, 'foto', 'ImagemUrl');
    if (!fotoPath) return '';
    if (/^https?:/i.test(fotoPath)) {
        return fotoPath;
    }
    return `${API_BASE_URL}${fotoPath.startsWith('/') ? '' : '/'}${fotoPath}`;
}

function setCategoriaSelectValue(value) {
    const select = document.getElementById("form-categoria");
    if (!select) return;

    if (!value) {
        select.value = select.options[0]?.value || 'Entrada';
        return;
    }

    const exists = Array.from(select.options).some(opt => opt.value === value);
    if (!exists) {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = value;
        select.appendChild(option);
    }
    select.value = value;
}

// Carregar do servidor
async function carregarProdutos() {
    try {
        const resp = await fetch(PRODUCTS_ENDPOINT);
        
        // Verificar se a resposta é OK
        if (!resp.ok) {
            throw new Error(`HTTP ${resp.status}: ${resp.statusText}`);
        }
        
        // Verificar se tem conteúdo antes de fazer parse
        const text = await resp.text();
        if (!text || text.trim() === '') {
            produtos = [];
            renderProducts();
            return;
        }
        
        produtos = JSON.parse(text);
        renderProducts();
    } catch (err) {
        console.error('Erro ao carregar produtos:', err);
        alert(`Erro ao carregar produtos: ${err.message}\n\nVerifique se o backend está disponível em https://pedeja-backend.onrender.com`);
    }
}

// Renderizar na tabela
function renderProducts() {
    const tbody = document.getElementById("productList");
    tbody.innerHTML = "";

    let lista = [...produtos];

    const search = document.getElementById("searchInput").value.toLowerCase();
    lista = lista.filter(p => {
        const nome = resolveProdutoField(p, 'nome', 'Nome') || '';
        return nome.toLowerCase().includes(search);
    });

    const order = document.getElementById("orderSelect").value;
    if (order === "az") lista.sort((a, b) => (resolveProdutoField(a, 'nome', 'Nome') || '').localeCompare(resolveProdutoField(b, 'nome', 'Nome') || ''));
    if (order === "za") lista.sort((a, b) => (resolveProdutoField(b, 'nome', 'Nome') || '').localeCompare(resolveProdutoField(a, 'nome', 'Nome') || ''));
    if (order === "precoAsc") lista.sort((a, b) => (Number(resolveProdutoField(a, 'preco', 'Preco')) || 0) - (Number(resolveProdutoField(b, 'preco', 'Preco')) || 0));
    if (order === "precoDesc") lista.sort((a, b) => (Number(resolveProdutoField(b, 'preco', 'Preco')) || 0) - (Number(resolveProdutoField(a, 'preco', 'Preco')) || 0));

    lista.forEach(p => {
        const id = resolveProdutoField(p, 'id', 'ProdutoId');
        const nome = resolveProdutoField(p, 'nome', 'Nome') || '';
        const preco = Number(resolveProdutoField(p, 'preco', 'Preco')) || 0;
        const categoria = resolveProdutoField(p, 'categoria', 'Categoria') || '';
        const descricao = resolveProdutoField(p, 'descricao', 'Descricao') || '';
        const fotoUrl = resolveImageUrl(p);

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td data-label="Foto">
                ${fotoUrl ? `<img src="${fotoUrl}" style="width:60px;height:60px;object-fit:cover">` : ''}
            </td>
            <td data-label="Nome">${nome}</td>
            <td data-label="Preço">R$ ${preco.toFixed(2)}</td>
            <td data-label="Categoria">${categoria}</td>
            <td data-label="Descrição">${descricao}</td>
            <td data-label="Ações">
                <button class="btn-edit" onclick="editar(${id})">Editar</button>
                <button class="btn-delete" onclick="excluir(${id})">Excluir</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}


// Abrir modal cadastrar
function redirectCadastrar() {
    editingId = null;

    document.getElementById("form-title").textContent = "Cadastrar Produto";
    document.getElementById("form-foto").value = "";
    document.getElementById("form-nome").value = "";
    document.getElementById("form-preco").value = "";
    setCategoriaSelectValue('Entrada');
    document.getElementById("form-descricao").value = "";

    document.getElementById("productFormModal").style.display = "flex";
}

// Abrir modal editar
function editar(id) {
    const p = findProdutoById(id);
    if (!p) return;

    editingId = id;

    document.getElementById("form-title").textContent = "Editar Produto";
    document.getElementById("form-foto").value = "";
    document.getElementById("form-nome").value = resolveProdutoField(p, 'nome', 'Nome') || '';
    document.getElementById("form-preco").value = resolveProdutoField(p, 'preco', 'Preco') || '';
    setCategoriaSelectValue(resolveProdutoField(p, 'categoria', 'Categoria') || 'Entrada');
    document.getElementById("form-descricao").value = resolveProdutoField(p, 'descricao', 'Descricao') || '';

    document.getElementById("productFormModal").style.display = "flex";
}

// Fechar formulário
function fecharForm() {
    document.getElementById("productFormModal").style.display = "none";
}

// Salvar (POST ou PUT)
async function salvarProduto() {
    const nome = document.getElementById("form-nome").value;
    const preco = parseFloat(document.getElementById("form-preco").value);
    const categoria = document.getElementById("form-categoria").value;
    const descricao = document.getElementById("form-descricao").value;
    const fotoInput = document.getElementById("form-foto");

    if (!nome || isNaN(preco)) {
        alert("Preencha os campos obrigatórios!");
        return;
    }

    // Criar FormData para enviar arquivo
    const formData = new FormData();
    formData.append('nome', nome);
    formData.append('preco', preco);
    formData.append('categoria', categoria);
    formData.append('descricao', descricao);

    // Adicionar arquivo se foi selecionado
    if (fotoInput.files && fotoInput.files[0]) {
        formData.append('foto', fotoInput.files[0]);
    }

    // Se estiver editando e não selecionou nova imagem, manter a atual
    if (editingId) {
        const p = findProdutoById(editingId);
        const fotoAtual = resolveProdutoField(p, 'foto', 'ImagemUrl');
        if (p && fotoAtual && (!fotoInput.files || !fotoInput.files[0])) {
            formData.append('fotoAtual', fotoAtual);
        }
    }

    try {
        let resp;

        if (editingId) {
            resp = await fetch(`${PRODUCTS_ENDPOINT}/${editingId}`, {
                method: 'PUT',
                body: formData
            });
        } else {
            resp = await fetch(PRODUCTS_ENDPOINT, {
                method: 'POST',
                body: formData
            });
        }

        if (!resp.ok) {
            const error = await resp.json();
            throw new Error(error.error || 'Erro ao salvar produto');
        }

        fecharForm();
        showSuccess();
        
        // Recarregar produtos após mostrar o modal
        await carregarProdutos();

    } catch (err) {
        console.error(err);
        alert(err.message || "Erro ao salvar produto no servidor.");
    }
}

// Excluir produto
async function excluir(id) {
    if (!confirm("Tem certeza que deseja excluir?")) return;

    try {
        await fetch(`${PRODUCTS_ENDPOINT}/${id}`, { method: 'DELETE' });
        produtos = produtos.filter(p => (p.id ?? p.ProdutoId) !== id);
        showDeleteSuccess();
        renderProducts();
    } catch (err) {
        console.error(err);
        alert("Erro ao excluir produto.");
    }
}

// modal de sucesso ao cadastrar ou editar
let successTimer = null;

function showSuccess() {
    const modal = document.getElementById("successModal");
    
    // Limpar timer anterior se existir
    if (successTimer) {
        clearTimeout(successTimer);
    }
    
    // Forçar display do modal
    modal.style.display = "flex";
    modal.style.zIndex = "9999";
    
    // Fechar ao clicar no fundo
    modal.onclick = function(event) {
        if (event.target === modal) {
            closeModal();
        }
    };
    
    // Fechar automaticamente após 10 segundos
    successTimer = setTimeout(() => {
        closeModal();
    }, 10000);
}

function closeModal() {
    const modal = document.getElementById("successModal");
    modal.style.display = "none";
    if (successTimer) {
        clearTimeout(successTimer);
        successTimer = null;
    }
}

// modal de sucesso ao excluir
let deleteTimer = null;

function showDeleteSuccess() {
    const modal = document.getElementById("deleteModal");
    
    // Limpar timer anterior se existir
    if (deleteTimer) {
        clearTimeout(deleteTimer);
    }
    
    // Forçar display do modal
    modal.style.display = "flex";
    modal.style.zIndex = "9999";
    
    // Fechar ao clicar no fundo
    modal.onclick = function(event) {
        if (event.target === modal) {
            closeDeleteModal();
        }
    };
    
    // Fechar automaticamente após 10 segundos
    deleteTimer = setTimeout(() => {
        closeDeleteModal();
    }, 10000);
}

function closeDeleteModal() {
    const modal = document.getElementById("deleteModal");
    modal.style.display = "none";
    if (deleteTimer) {
        clearTimeout(deleteTimer);
        deleteTimer = null;
    }
}

document.getElementById("searchInput").addEventListener("input", renderProducts);
document.getElementById("orderSelect").addEventListener("change", renderProducts);

carregarProdutos();

function logout() {
  localStorage.clear();
  sessionStorage.clear();
  window.location.href = 'Login.html';
}

document.addEventListener('DOMContentLoaded', () => {
  const btnLogout = document.getElementById('btn-logout');

  if (btnLogout) {
    btnLogout.addEventListener('click', logout);
  }
});


