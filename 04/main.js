import gsap from 'gsap';

const API_URL = 'http://localhost:3000/api/usuarios';

const userForm = document.getElementById('userForm');
const usersList = document.getElementById('usersList');
const userIdInput = document.getElementById('userId');
const submitBtn = userForm.querySelector('button[type="submit"]');

// Load users on startup
document.addEventListener('DOMContentLoaded', fetchUsers);

async function fetchUsers() {
    try {
        const response = await fetch(API_URL);
        const users = await response.json();
        renderUsers(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        usersList.innerHTML = '<tr><td colspan="5" class="error">Erro ao carregar usuários. Verifique se o servidor está rodando.</td></tr>';
    }
}

function renderUsers(users) {
    usersList.innerHTML = '';
    
    if (users.length === 0) {
        usersList.innerHTML = '<tr><td colspan="5" class="loading">Nenhum usuário cadastrado.</td></tr>';
        return;
    }

    users.forEach((user, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${user.nome}</td>
            <td>${user.email}</td>
            <td>${user.telefone}</td>
            <td>${formatDate(user.data_nasc)}</td>
            <td>
                <button class="btn btn-edit" data-id="${user.id}">Editar</button>
                <button class="btn btn-danger" data-id="${user.id}">Excluir</button>
            </td>
        `;
        usersList.appendChild(tr);

        // GSAP Animation for row entry
        gsap.fromTo(tr, 
            { opacity: 0, y: 20 }, 
            { opacity: 1, y: 0, duration: 0.3, delay: index * 0.05, ease: "power2.out" }
        );
    });

    // Add event listeners for buttons using closure for reliability
    document.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', () => loadUserForEdit(btn.dataset.id));
    });

    document.querySelectorAll('.btn-danger').forEach(btn => {
        btn.addEventListener('click', () => deleteUser(btn.dataset.id));
    });
}

    // Add listener for New User button
    const btnNewUser = document.getElementById('btnNewUser');
    if (btnNewUser) {
        btnNewUser.addEventListener('click', () => {
            resetForm();
            gsap.fromTo("#form-card", { scale: 1 }, { scale: 1.01, duration: 0.1, yoyo: true, repeat: 1 });
        });
    }

function formatDate(dateString) {
    if (!dateString) return '';
    // Create date focusing on UTC parts to avoid timezone shifting
    const date = new Date(dateString);
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const year = date.getUTCFullYear();
    return `${day}/${month}/${year}`;
}

userForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const id = userIdInput.value;
    const userData = {
        nome: document.getElementById('nome').value,
        email: document.getElementById('email').value,
        fone: document.getElementById('fone').value,
        data_nascimento: document.getElementById('data_nascimento').value
    };

    try {
        let response;
        if (id && id !== 'undefined') {
            // Update
            response = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });
        } else {
            // Create
            response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });
        }

        if (response.ok) {
            resetForm();
            fetchUsers();
            
            // Success Animation on Form
            gsap.fromTo("#form-card", 
                { scale: 1, borderColor: "rgba(255, 255, 255, 0.1)" }, 
                { scale: 1.02, borderColor: "var(--success-color)", duration: 0.2, yoyo: true, repeat: 1 }
            );
        } else {
            const errorData = await response.json();
            alert(`Erro ao salvar: ${errorData.error || 'Erro desconhecido'}`);
        }
    } catch (error) {
        console.error('Error saving user:', error);
        alert('Erro de conexão ao salvar usuário.');
    }
});

async function loadUserForEdit(id) {
    if (!id || id === 'undefined') {
        console.error('Invalid ID passed to loadUserForEdit');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) throw new Error('Falha ao buscar usuário');
        const user = await response.json();
        
        userIdInput.value = user.id;
        document.getElementById('nome').value = user.nome;
        document.getElementById('email').value = user.email;
        // DB column 'telefone' -> Form input 'fone'
        document.getElementById('fone').value = user.telefone || '';
        
        // Robust Date Handling for Input (YYYY-MM-DD)
        // DB column 'data_nasc'
        if (user.data_nasc) {
            const date = new Date(user.data_nasc);
            const year = date.getUTCFullYear();
            const month = String(date.getUTCMonth() + 1).padStart(2, '0');
            const day = String(date.getUTCDate()).padStart(2, '0');
            document.getElementById('data_nascimento').value = `${year}-${month}-${day}`;
        } else {
            document.getElementById('data_nascimento').value = '';
        }
        
        submitBtn.querySelector('span').textContent = 'Atualizar Usuário';
        submitBtn.classList.remove('btn-primary');
        submitBtn.classList.add('btn-edit');
        submitBtn.style.width = '100%'; 
        submitBtn.style.background = 'var(--accent-color)';
        submitBtn.style.color = 'white';
        
        // Scroll to form
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Highlight form
        gsap.fromTo("#form-card", 
            { boxShadow: "0 0 0 0 rgba(88, 166, 255, 0)" }, 
            { boxShadow: "0 0 0 4px rgba(88, 166, 255, 0.3)", duration: 0.3, yoyo: true, repeat: 1 }
        );

    } catch (error) {
        console.error('Error loading user:', error);
    }
}

async function deleteUser(id) {
    if (!confirm('Tem certeza que deseja excluir este usuário?')) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            fetchUsers();
        } else {
            alert('Erro ao excluir usuário');
        }
    } catch (error) {
        console.error('Error deleting user:', error);
    }
}

function resetForm() {
    userForm.reset();
    userIdInput.value = '';
    submitBtn.querySelector('span').textContent = 'Salvar Usuário';
    
    // Reset styling if it was in edit mode
    submitBtn.classList.remove('btn-edit');
    submitBtn.classList.add('btn-primary');
    submitBtn.style.background = ''; 
    submitBtn.style.color = '';
}
