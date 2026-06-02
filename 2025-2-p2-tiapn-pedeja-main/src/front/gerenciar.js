function carregarInscricoes(){
    let lista = JSON.parse(localStorage.getItem("inscricoes")) || [];

    const tabela = document.getElementById("tabelaInscricoes");
    tabela.innerHTML = "";

    lista.forEach((item, index) => {
        tabela.innerHTML += `
            <tr>
                <td>${item.nome}</td>
                <td>${item.email}</td>
                <td>${item.turno}</td>
                <td><button onclick="remover(${index})">Excluir</button></td>
            </tr>
        `;
    });
}

function remover(index){
    let lista = JSON.parse(localStorage.getItem("inscricoes")) || [];
    lista.splice(index, 1);
    localStorage.setItem("inscricoes", JSON.stringify(lista));
    carregarInscricoes();
}

window.onload = carregarInscricoes;
