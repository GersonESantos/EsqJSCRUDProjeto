import { gsap } from "gsap";

const API_BASE_URL = '/api'; // Vite vai cuidar do proxy

// --- Elementos do DOM ---
const elements = {
    modalOverlay: document.getElementById('modal-overlay'),
    userModal: document.getElementById('user-modal'),
    btnAddUser: document.getElementById('btn-add-user'),
    btnCancel: document.getElementById('btn-cancel'),
    userForm: document.getElementById('user-form'),
    usersContainer: document.getElementById('users-container'),
    modalTitle: document.getElementById('modal-title'),
    toast: document.getElementById('toast'),
    userIdInput: document.getElementById('user-id'),
    nomeInput: document.getElementById('nome'),
    emailInput: document.getElementById('email'),
    senhaInput: document.getElementById('senha'),
};

// --- Estado da Aplicação ---
let isEditing = false;

// --- Animações GSAP ---
const animatePageLoad = () => {
    gsap.from('.glass-header', { y: -50, opacity: 0, duration: 0.7, ease: 'power3.out' });
    gsap.from('.glass-panel', { y: 50, opacity: 0, duration: 0.7, delay: 0.2, ease: 'power3.out' });
};

const animateModalOpen = () => {
    elements.modalOverlay.classList.remove('hidden');
    gsap.to(elements.modalOverlay, { opacity: 1, duration: 0.3 });
    gsap.fromTo(elements.userModal, { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.7)' });
};

const animateModalClose = () => {
    gsap.to(elements.userModal, { scale: 0.9, opacity: 0, duration: 0.3, ease: 'power2.in' });
    gsap.to(elements.modalOverlay, { opacity: 0, duration: 0.3, delay: 0.1, onComplete: () => elements.modalOverlay.classList.add('hidden') });
};

// --- Lógica do Modal ---
const openModal = (editing = false, user = {}) => {
    isEditing = editing;
    elements.userForm.reset();
    elements.modalTitle.textContent = editing ? 'Editar Usuário' : 'Novo Usuário';
    elements.senhaInput.parentElement.querySelector('small').style.display = editing ? 'block' : 'none';
    elements.senhaInput.required = !editing;

    if (editing) {
        elements.userIdInput.value = user.id;
        elements.nomeInput.value = user.nome;
        elements.emailInput.value = user.email;
    }
    animateModalOpen();
};

// --- Notificação Toast ---
const showToast = (message, type = 'success') => {
    elements.toast.textContent = message;
    elements.toast.className = `toast ${type} show`;
    setTimeout(() => {
        elements.toast.classList.remove('show');
    }, 3000);
};

// --- Funções da API ---
const fetchAPI = async (endpoint, options = {}) => {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Ocorreu um erro na requisição.');
        }
        return response.status === 204 ? null : response.json();
    } catch (error) {
        showToast(error.message, 'error');
        console.error('API Error:', error);
        throw error;
    }
};

const fetchUsers = async () => {
    try {
        const users = await fetchAPI('/users');
        renderUsers(users);
    } catch (error) {
        elements.usersContainer.innerHTML = '<p style="text-align:center; color: var(--text-muted);">Não foi possível carregar os usuários.</p>';
    }
};

const deleteUser = async (id) => {
    if (!confirm('Tem certeza que deseja excluir este usuário?')) return;
    try {
        await fetchAPI(`/users/${id}`, { method: 'DELETE' });
        showToast('Usuário excluído com sucesso!');
        fetchUsers();
    } catch (error) {
        // O erro já é mostrado pelo fetchAPI
    }
};

// --- Renderização ---
const renderUsers = (users) => {
    elements.usersContainer.innerHTML = '';
    if (users.length === 0) {
        elements.usersContainer.innerHTML = '<p style="text-align:center; color: var(--text-muted);">Nenhum usuário cadastrado.</p>';
        return;
    }

    users.forEach(user => {
        const row = document.createElement('div');
        row.className = 'user-row';
        row.innerHTML = `
            <div class="user-info">
                <span class="name">${user.nome}</span>
                <span class="email">${user.email}</span>
            </div>
            <div class="user-actions">
                <button class="icon-btn edit-btn" title="Editar">✏️</button>
                <button class="icon-btn delete-btn" title="Excluir">🗑️</button>
            </div>
        `;
        row.querySelector('.edit-btn').addEventListener('click', () => openModal(true, user));
        row.querySelector('.delete-btn').addEventListener('click', () => deleteUser(user.id));
        elements.usersContainer.appendChild(row);
    });
    gsap.from(".user-row", { opacity: 0, y: 20, duration: 0.5, stagger: 0.1 });
};

// --- Manipulação de Formulário ---
const handleFormSubmit = async (e) => {
    e.preventDefault();
    const userData = {
        nome: elements.nomeInput.value,
        email: elements.emailInput.value,
    };
    if (elements.senhaInput.value) {
        userData.senha = elements.senhaInput.value;
    }

    const method = isEditing ? 'PUT' : 'POST';
    const endpoint = isEditing ? `/users/${elements.userIdInput.value}` : '/users';

    try {
        await fetchAPI(endpoint, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        });
        showToast(`Usuário ${isEditing ? 'atualizado' : 'criado'} com sucesso!`);
        animateModalClose();
        fetchUsers();
    } catch (error) {
        // O erro já é mostrado pelo fetchAPI
    }
};

// --- Inicialização e Event Listeners ---
const init = () => {
    animatePageLoad();
    fetchUsers();

    elements.btnAddUser.addEventListener('click', () => openModal());
    elements.btnCancel.addEventListener('click', animateModalClose);
    elements.modalOverlay.addEventListener('click', (e) => {
        if (e.target === elements.modalOverlay) animateModalClose();
    });
    elements.userForm.addEventListener('submit', handleFormSubmit);
};

document.addEventListener('DOMContentLoaded', init);