const statusCard = document.getElementById('statusCard');
const loader = document.getElementById('loader');
const statusIcon = document.getElementById('statusIcon');
const statusTitle = document.getElementById('statusTitle');
const statusMessage = document.getElementById('statusMessage');
const retryBtn = document.getElementById('retryBtn');

async function checkConnection() {
    // Reset UI state
    setLoadingState();

    try {
        const response = await fetch('/api/status');
        const data = await response.json();

        if (response.ok && data.success) {
            setSuccessState(data.message);
        } else {
            setErrorState(data.message || 'Erro desconhecido ao conectar.');
        }
    } catch (error) {
        setErrorState('Não foi possível contactar o servidor. Verifique se o Node.js está rodando.');
    }
}

function setLoadingState() {
    statusCard.className = 'status-card';
    loader.classList.remove('hidden');
    statusIcon.classList.add('hidden');
    statusTitle.textContent = 'Verificando...';
    statusMessage.textContent = 'Tentando estabelecer conexão com o banco de dados.';
    retryBtn.disabled = true;
    retryBtn.style.opacity = '0.5';
}

function setSuccessState(message) {
    statusCard.classList.add('success');
    loader.classList.add('hidden');
    statusIcon.classList.remove('hidden');
    statusIcon.innerHTML = '✅'; // Emoji simples, mas eficaz
    statusTitle.textContent = 'Conectado!';
    statusMessage.textContent = message;
    retryBtn.disabled = false;
    retryBtn.style.opacity = '1';
}

function setErrorState(message) {
    statusCard.classList.add('error');
    loader.classList.add('hidden');
    statusIcon.classList.remove('hidden');
    statusIcon.innerHTML = '❌';
    statusTitle.textContent = 'Falha na Conexão';
    statusMessage.textContent = message;
    retryBtn.disabled = false;
    retryBtn.style.opacity = '1';
}

// Event Listeners
retryBtn.addEventListener('click', checkConnection);

// Initial check
document.addEventListener('DOMContentLoaded', checkConnection);
