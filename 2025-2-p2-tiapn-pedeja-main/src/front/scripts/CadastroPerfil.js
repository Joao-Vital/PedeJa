document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.formulario-campos');

  const usuarioLogado =
    JSON.parse(localStorage.getItem('pedeja_user')) ||
    JSON.parse(sessionStorage.getItem('pedeja_user'));

  if (!usuarioLogado || !usuarioLogado.usuarioid) {
    alert('Você precisa estar logado para criar um perfil');
    window.location.href = 'Login.html';
    return;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);

    const data = {
      usuario_id: usuarioLogado.usuarioid,
      primeiro_nome: formData.get('primeiro-nome'),
      sobrenome: formData.get('sobrenome'),
      cpf: formData.get('cpf'),
      cep: formData.get('cep'),
      endereco: formData.get('endereco'),
      numero: formData.get('numero'),
      complemento: formData.get('complemento'),
      telefone: formData.get('telefone'),
      instagram: formData.get('instagram'),
      facebook: formData.get('facebook'),
    };

    try {
      const response = await fetch(
        'https://pedeja-backend.onrender.com/api/perfil',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Erro ao salvar perfil');
      }

      alert('Perfil salvo com sucesso!');
      window.location.href = 'Navegacao.html';
    } catch (error) {
      console.error(error);
      alert(error.message || 'Erro ao criar perfil');
    }
  });
});
