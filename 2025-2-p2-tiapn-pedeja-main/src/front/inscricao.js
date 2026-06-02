document.getElementById("formInscricao").addEventListener("submit", function(e){
    e.preventDefault();

    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const turno = document.getElementById("turno").value;

    if(!nome || !email){
        alert("Preencha todos os campos!");
        return;
    }

    // Recupera lista antiga
    let lista = JSON.parse(localStorage.getItem("inscricoes")) || [];

    // Adiciona nova
    lista.push({ nome, email, turno });

    // Salva novamente
    localStorage.setItem("inscricoes", JSON.stringify(lista));

    alert("Inscrição realizada com sucesso!");

    document.getElementById("formInscricao").reset();
});
