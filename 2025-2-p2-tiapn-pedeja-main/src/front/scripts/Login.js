const formLogin = document.querySelector('[data-form-login]');
const loginFeedback = document.getElementById('login-feedback');

const API_BASE_URL = 'https://pedeja-backend.onrender.com/api';

const ADMIN_ROUTE = 'gerenciamentoProdutos.html';
const CUSTOMER_ROUTE = 'Navegacao.html';
const PROFILE_ROUTE = 'CadastroPerfil.html'; // a


function setLoginFeedback(message, type = 'error') {
  if (!loginFeedback) return;
  loginFeedback.textContent = message;
  loginFeedback.hidden = false;
  loginFeedback.className =
    type === 'success' ? 'feedback success' : 'feedback error';
}

function resetLoginFeedback() {
  if (!loginFeedback) return;
  loginFeedback.hidden = true;
  loginFeedback.textContent = '';
  loginFeedback.className = 'feedback';
}

async function handleLogin(event) {
  event.preventDefault();
  resetLoginFeedback();

  const formData = new FormData(formLogin);

  const payload = {
    email: formData.get('email'),
    senha: formData.get('senha'),
  };

  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Falha ao realizar login');
    }

    setLoginFeedback('Login realizado com sucesso!', 'success');

    const usuario = data.usuario || data.user;
    const token = data.token;
    const tipoUsuario = (usuario.tipo || usuario.tipoUsuario || '').toLowerCase();
    const lembrar = formData.get('lembrar');

    const storage = lembrar ? localStorage : sessionStorage;
    storage.setItem('pedeja_user', JSON.stringify(usuario));
    storage.setItem('pedeja_tipo_usuario', tipoUsuario);
    if (token) {
      storage.setItem('pedeja_token', token);
    }

    let nextRoute = CUSTOMER_ROUTE;

    if (tipoUsuario === 'administrador' || tipoUsuario === 'admin') {
      nextRoute = ADMIN_ROUTE;
    } else if (!usuario.perfilCriado) {
      nextRoute = PROFILE_ROUTE;
    }


    console.log('Redirecionando para:', nextRoute);

    setTimeout(() => {
      window.location.href = nextRoute;
    }, 500);

  } catch (error) {
    console.error('Erro no login:', error);
    setLoginFeedback(error.message || 'Erro inesperado');
  }
}

if (formLogin) {
  formLogin.addEventListener('submit', handleLogin);
}
