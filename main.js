import { gsap } from 'gsap';

const API_URL = 'http://localhost:3000/api/users';

// State
let isEditing = false;
let currentUserId = null;

// Elements
const modalOverlay = document.getElementById('modal-overlay');
const btnAddUser = document.getElementById('btn-add-user');
const btnCloseModal = document.getElementById('btn-close-modal');
const btnCancel = document.getElementById('btn-cancel');
const userForm = document.getElementById('user-form');
const usersContainer = document.getElementById('users-container');
const modalTitle = document.getElementById('modal-title');
const toastElement = document.getElementById('toast');

// --- GSAP Animations ---
const animateEntry = () => {
    gsap.from('.glass-header', { y: -50, opacity: 0, duration: 1, ease: 'power3.out' });
    gsap.from('.glass-panel', { y: 50, opacity: 0, duration: 1, delay: 0.2, ease: 'power3.out' });
};

const animateListUpdate = () => {
    gsap.fromTo('.user-row', 
        { opacity: 0, x: -20 }, 
        { opacity: 1, x: 0, duration: 0.4, stagger: 0.1, ease: 'power2.out' }
    );
};

// --- Modal Logic ---
const openModal = (editing = false, user = {}) => {
    isEditing = editing;
    currentUserId = user.id || null;
    modalTitle.innerText = editing ? 'Editar Usuário' : 'Novo Usuário';
    
    // Reset or Fill form
    document.getElementById('nome').value = user.nome || '';
    document.getElementById('email').value = user.email || '';
    document.getElementById('senha').value = ''; // Password always empty or handled securely
    
    // Hide password field if editing (optional UX choice, but here we allow update of everything)
    // For this simple CRUD, we allow updating password too.
    
    modalOverlay.classList.remove('hidden');
    requestAnimationFrame(() => modalOverlay.classList.add('active'));
    
    gsap.fromTo('.glass-modal', 
        { scale: 0.8, opacity: 0 }, 
        { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' }
    );
};

const closeModal = () => {
    modalOverlay.classList.remove('active');
    setTimeout(() => {
        modalOverlay.classList.add('hidden');
    }, 300);
};

// --- Toast Notification ---
const showToast = (message, type = 'success') => {
    toastElement.innerText = message;
    toastElement.className = `toast ${type} show`;
    setTimeout(() => {
        toastElement.classList.remove('show');
    }, 3000);
};

// --- API Calls ---
const fetchUsers = async () => {
    try {
        const response = await fetch(API_URL);
        const users = await response.json();
        renderUsers(users);
        animateListUpdate();
    } catch (error) {
        showToast('Erro ao carregar usuários', 'error');
    }
};

const deleteUser = async (id) => {
    if (!confirm('Tem certeza que deseja excluir?')) return;
    try {
        const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        if (res.ok) {
            showToast('Usuário excluído com sucesso');
            fetchUsers();
        } else {
            showToast('Erro ao excluir usuário', 'error');
        }
    } catch (error) {
        showToast('Erro de conexão', 'error');
    }
};

const renderUsers = (users) => {
    usersContainer.innerHTML = '';
    if (users.length === 0) {
        usersContainer.innerHTML = '<div style="padding: 2rem; text-align: center; color: var(--text-muted);">Nenhum usuário encontrado.</div>';
        return;
    }
    
    users.forEach(user => {
        const row = document.createElement('div');
        row.className = 'user-row';
        row.innerHTML = `
            <div>${user.nome}</div>
            <div style="color: var(--text-muted); font-size: 0.9em;">${user.email}</div>
            <div style="display:flex; justify-content: flex-end;">
                <button class="icon-btn edit-btn">✏️</button>
                <button class="icon-btn delete delete-btn">🗑️</button>
            </div>
        `;
        
        // Event Listeners for buttons
        row.querySelector('.edit-btn').addEventListener('click', () => openModal(true, user));
        row.querySelector('.delete-btn').addEventListener('click', () => deleteUser(user.id));
        
        usersContainer.appendChild(row);
    });
};

const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    
    const userData = { nome, email };
    // Only send password if creating or if user typed it? Simple CRUD: Send if typed or always required on create.
    if (!isEditing || senha) {
        userData.senha = senha;
    }

    const method = isEditing ? 'PUT' : 'POST';
    const url = isEditing ? `${API_URL}/${currentUserId}` : API_URL;

    try {
        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });

        const data = await res.json();

        if (res.ok) {
            showToast(isEditing ? 'Usuário atualizado!' : 'Usuário criado!');
            closeModal();
            fetchUsers();
        } else {
            showToast(data.error || 'Erro ao salvar', 'error');
        }
    } catch (error) {
        showToast('Erro de conexão', 'error');
        console.error(error);
    }
};

// --- Initialization ---
const init = () => {
    animateEntry();
    fetchUsers();
    
    btnAddUser.addEventListener('click', () => openModal(false));
    btnCloseModal.addEventListener('click', closeModal);
    btnCancel.addEventListener('click', closeModal);
    userForm.addEventListener('submit', handleFormSubmit);
    
    // Close modal on click outside
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });
};

document.addEventListener('DOMContentLoaded', init);
