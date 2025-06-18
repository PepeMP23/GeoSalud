// Cargar todos los usuarios al iniciar
window.addEventListener('DOMContentLoaded', loadUsers);

const token = localStorage.getItem('token');
if (!token) {
  alert('Primero inicia sesión');
  location.href = 'index.html';
}


async function loadUsers() {
  try {
    const res = await fetch('/api/users');
    const users = await res.json();

    const tbody = document.getElementById('users-table-body');
    tbody.innerHTML = ''; 

    users.forEach(user => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${user._id}</td>
        <td>${user.name}</td>
        <td>${user.username}</td>
      `;
      tbody.appendChild(row);
    });
  } catch (err) {
    console.error('Error al cargar usuarios:', err);
  }
}

async function createUser() {
  const name = document.getElementById('user-name').value;
  const username = document.getElementById('user-username').value;
  const password = document.getElementById('user-password').value;

  if (!name || !username || !password) return alert('Completa todos los campos');

  try {
    const res = await fetch('/api/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, username, password })
    });

    const data = await res.json();
    if (res.ok) {
      alert('Usuario registrado correctamente');
      location.reload();
    } else {
      alert(data.error);
    }
  } catch (err) {
    console.error('Error al crear usuario:', err);
  }
}

function fillEditForm(id, name, username) {
  document.getElementById('edit-user-id').value = id;
  document.getElementById('edit-user-name').value = name;
  document.getElementById('edit-user-username').value = username;
}

async function editUser() {
  const id = document.getElementById('edit-user-id').value.trim();
  const name = document.getElementById('edit-user-name').value.trim();
  const username = document.getElementById('edit-user-username').value.trim();
  const password = document.getElementById('edit-user-password').value;

  if (!id || !name || !username || !password) {
    return alert('Completa todos los campos para editar');
  }

  try {
    const res = await fetch(`/api/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, username, password })
    });

    const data = await res.json();

    if (res.ok) {
      alert('Usuario actualizado');
      location.reload();
    } else {
      alert(`${data.error || 'Error al actualizar'}`);
    }
  } catch (err) {
    console.error(err);
    alert('Error de red');
  }
}

async function deleteUser() {
  const id = document.getElementById('delete-user-id').value.trim();
  if (!id) {
    return alert('Debes ingresar un ID válido');
  }

  const confirmDelete = confirm(`¿Seguro que quieres eliminar el usuario con ID: ${id}?`);
  if (!confirmDelete) return;

  try {
    const res = await fetch(`/api/users/${id}`, {
      method: 'DELETE'
    });

    const data = await res.json();

    if (res.ok) {
      alert('Usuario eliminado');
      location.reload();
    } else {
      alert(`${data.error || 'Error al eliminar'}`);
    }
  } catch (err) {
    console.error(err);
    alert('Error de red al eliminar');
  }
}


async function deleteUserById(id) {
  const confirmDelete = confirm('¿Eliminar este usuario?');
  if (!confirmDelete) return;

  try {
    const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
    const data = await res.json();

    if (res.ok) {
      alert('Usuario eliminado correctamente');
      location.reload();
    } else {
      alert(data.error);
    }
  } catch (err) {
    console.error('Error al eliminar usuario:', err);
  }
}

document.getElementById('logout-btn').addEventListener('click', () => {
  localStorage.removeItem('token'); 
  alert('Sesión cerrada');
  location.href = 'index.html'; 
});
