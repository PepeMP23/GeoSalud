document.getElementById('login-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  fetch('/api/users/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  })
    .then(res => res.json())
    .then(data => {
      if (data.token) {
        localStorage.setItem('token', data.token);
        alert('Bienvenido');
        window.location.href = 'map.html';
      } else {
        alert(data.error || ' Error al iniciar sesión');
      }
    })
    .catch(error => {
      console.error(' Error en el login:', error);
      alert(' Error en la solicitud');
    });
});
