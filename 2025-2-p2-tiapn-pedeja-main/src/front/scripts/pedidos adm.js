// ==========================
// CONFIGURAÇÃO DA API
// ==========================
const API_URL = "http://localhost:4000";

document.addEventListener("DOMContentLoaded", () => {

    // Containers
    const boxPendentes = document.getElementById("pendentes");
    const boxConfirmados = document.getElementById("confirmados");
    const boxProntos = document.getElementById("prontos");

    // Contadores
    const contPendentes = document.getElementById("qtd-pendentes");
    const contConfirmados = document.getElementById("qtd-confirmados");
    const contProntos = document.getElementById("qtd-prontos");

    let ultimoEstado = {}; // Para animar mudanças

    // ==========================
    // FUNÇÃO PARA BUSCAR PEDIDOS
    // ==========================
    async function carregarPedidos(autoUpdate = false) {

        try {
            const res = await fetch(`${API_URL}/pedidos`);
            const pedidos = await res.json();

            // Limpa caixas apenas no carregamento manual
            if (!autoUpdate) {
                boxPendentes.innerHTML = "";
                boxConfirmados.innerHTML = "";
                boxProntos.innerHTML = "";
            }

            pedidos.forEach(pedido => renderizarPedido(pedido, autoUpdate));

            atualizarContadores();

        } catch (error) {
            console.error("Erro ao carregar pedidos:", error);
        }
    }

    // ==========================
    // CRIAR HTML DO PEDIDO
    // ==========================
    function renderizarPedido(pedido, animarMudanca) {

        let card = document.querySelector(`.pedido-item[data-id="${pedido.id}"]`);

        // Se o card ainda NÃO existe → cria
        if (!card) {

            card = document.createElement("div");
            card.classList.add("pedido-item");
            card.dataset.id = pedido.id;

            card.innerHTML = `
                <div class="pedido-info">
                    <h3>Pedido #${pedido.numero_pedido}</h3>
                    <p class="pedido-descricao">${pedido.descricao}</p>
                    <p class="pedido-horario">Recebido às ${formatarHora(pedido.horario_recebido)}</p>
                </div>

                <div class="botoes-status">
                    <button class="status-btn btn-confirmar">Confirmar</button>
                    <button class="status-btn btn-pronto">Pronto</button>
                </div>
            `;

            // Eventos
            card.querySelector(".btn-confirmar")
                .addEventListener("click", () => atualizarStatus(pedido.id, "confirmado"));

            card.querySelector(".btn-pronto")
                .addEventListener("click", () => atualizarStatus(pedido.id, "pronto"));
        }

        // Mudança de status → animação
        if (animarMudanca && ultimoEstado[pedido.id] && ultimoEstado[pedido.id] !== pedido.status) {
            animarAlteracao(card, pedido.status);
        }

        ultimoEstado[pedido.id] = pedido.status;

        // Move o card para o container certo
        moverParaArea(card, pedido.status);
    }

    // ==========================
    // ATUALIZA STATUS NO BANCO
    // ==========================
    async function atualizarStatus(id, status) {

        try {
            const res = await fetch(`${API_URL}/pedidos/${id}/status`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status })
            });

            if (!res.ok) {
                alert("Erro ao atualizar status!");
                return;
            }

            const pedido = await res.json();

            renderizarPedido(pedido, true);
            atualizarContadores();

            if (status === "confirmado") alert("Pedido confirmado!");
            if (status === "pronto") alert("Pedido pronto!");

        } catch (error) {
            console.error("Erro ao atualizar pedido:", error);
        }

    }

    // ==========================
    // MOVE PEDIDO ENTRE AS ÁREAS
    // ==========================
    function moverParaArea(card, status) {

        card.remove(); // Remove antes de recolocar

        if (status === "pendente") boxPendentes.appendChild(card);
        if (status === "confirmado") boxConfirmados.appendChild(card);
        if (status === "pronto") boxProntos.appendChild(card);
    }

    // ==========================
    // ANIMAÇÃO DE MUDANÇA DE STATUS
    // ==========================
    function animarAlteracao(card, status) {

        card.classList.add("animacao-mudar");

        if (status === "confirmado") card.classList.add("animacao-confirmar");
        if (status === "pronto") card.classList.add("animacao-pronto");

        setTimeout(() => {
            card.classList.remove("animacao-mudar", "animacao-confirmar", "animacao-pronto");
        }, 1200);
    }

    // ==========================
    // ATUALIZA CONTADORES
    // ==========================
    async function atualizarContadores() {
        try {
            const res = await fetch(`${API_URL}/status/contadores`);
            const data = await res.json();

            contPendentes.textContent = data.pendentes;
            contConfirmados.textContent = data.confirmados;
            contProntos.textContent = data.prontos;
        } catch (error) {
            console.error("Erro contadores:", error);
        }
    }

    // ==========================
    // FORMATA HORÁRIO
    // ==========================
    function formatarHora(datetime) {
        const hora = new Date(datetime);
        return hora.toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit"
        });
    }

    // ==========================
    // AUTO-UPDATE A CADA 5s
    // ==========================
    setInterval(() => {
        carregarPedidos(true); // true = atualizar mantendo animações
    }, 5000);

    // ==========================
    // INICIAR
    // ==========================
    carregarPedidos();

});
