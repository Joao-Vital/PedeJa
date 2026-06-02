const form = document.querySelector('[data-form-cadastro]');
const feedback = document.getElementById('form-feedback');

// const API_BASE_URL = window.env?.API_BASE_URL || '/api';
const API_BASE_URL = 'https://pedeja-backend.onrender.com/api';



function setFeedback(message, type = 'error') {
	if (!feedback) return;
	feedback.textContent = message;
	feedback.hidden = false;
	feedback.className = type === 'success' ? 'feedback success' : 'feedback error';
}

function resetFeedback() {
	if (!feedback) return;
	feedback.hidden = true;
	feedback.textContent = '';
	feedback.className = 'feedback';
}

async function handleSubmit(event) {
	event.preventDefault();
	resetFeedback();

	const formData = new FormData(form);
	const payload = {
		email: formData.get('email'),
		senha: formData.get('senha'),
		confirmarSenha: formData.get('confirmarSenha'),
	};

	try {
			const response = await fetch(`${API_BASE_URL}/cadastro`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload),
		});

		const data = await response.json();

		if (!response.ok) {
			throw new Error(data.message || 'Erro ao criar usuário.');
		}

		setFeedback(data.message || 'Cadastro realizado com sucesso.', 'success');
		form.reset();
		setTimeout(() => {
			window.location.href = 'Login.html';
		}, 1200);
	} catch (error) {
		setFeedback(error.message || 'Erro inesperado.');
	}
}

if (form) {
	form.addEventListener('submit', handleSubmit);
}
