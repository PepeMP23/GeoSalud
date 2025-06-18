document.getElementById('register-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  fetch('/api/users/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name, username, password })
  })
    .then(res => res.json())
    .then(data => {
      if (data.message) {
        alert('Usuario registrado correctamente');
        window.location.href = 'index.html';
      } else {
        alert(` ${data.error || 'Error al registrar'}`);
      }
    })
    .catch(error => {
      console.error(' Error en el fetch:', error);
      alert(' Error al enviar solicitud');
    });
});
