const map = L.map('map').setView([21.1222, -101.6805], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© Map data de Angel García'
}).addTo(map);

const token = localStorage.getItem('token');
if (!token) {
  alert('Primero inicia sesión');
  location.href = 'index.html';
}

// El evento para la captura de coordenadas con un click
let marker;
map.on('click', function(e) {
    const { lat, lng } = e.latlng;
    document.getElementById('lat').value = lat;
    document.getElementById('lng').value = lng;

    if(marker) {
        map.removeLayer(marker);
    }
    marker = L.marker([lat, lng])
        .addTo(map)
        .bindPopup('Ubicación seleccionada')
        .openPopup();
});

// Manejar el formulario
// Intercepta el envío del formulario para evitar que la página se recargue automáticamente
document.getElementById('place-form').addEventListener('submit', async function(e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;
    const latitude = parseFloat(document.getElementById('lat').value);
    const longitude = parseFloat(document.getElementById('lng').value);

    const response = await fetch('/api/places', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name,
            description,
            latitude,
            longitude
        })
    });

    // Espera la respuesta, muestra un mensaje y recarga la página para que el nuevo marcador aparezca
    const data = await response.json();
    alert('Lugar registrado');
    location.reload();
});

async function loadPlaces() {
  const res = await fetch('/api/places');
  const places = await res.json();

  // Mapa
  places.forEach(place => {
    const [lng, lat] = place.location.coordinates;
    L.marker([lat, lng])
      .addTo(map)
      .bindPopup(`
        <strong>${place.name}</strong><br>
        ${place.description}<br>
        <small><b>ID:</b> ${place._id}</small>
      `);
  });

  // Tabla
  renderTable(places);
}


async function deletePlace() {
    const id = document.getElementById('delete-id').value;

    if (!id) {
        alert('Por favor ingresa un ID válido');
        return;
    }

    const confirmed = confirm(`¿Estás seguro de que quieres eliminar el lugar con ID: ${id}?`);
    if (!confirmed) return;

    try {
        const response = await fetch(`/api/places/${id}`, {
            method: 'DELETE'
        });

        const result = await response.json();

        if (response.ok) {
            alert('Lugar eliminado correctamente');
            location.reload(); // Recarga el mapa
        } else {
            alert(`Error: ${result.error}`);
        }
    } catch (error) {
        alert('Ocurrió un error al eliminar el lugar');
        console.error(error);
    }
}

async function editPlace() {
    const id = document.getElementById('edit-id').value;
    const name = document.getElementById('edit-name').value;
    const description = document.getElementById('edit-description').value;

    if (!id || !name || !description) {
        alert('Completa todos los campos');
        return;
    }

    try {
        const response = await fetch(`/api/places/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, description })
        });

        const result = await response.json();

        if (response.ok) {
            alert('Lugar editado correctamente');
            location.reload();
        } else {
            alert(`Error: ${result.error}`);
        }
    } catch (error) {
        console.error(error);
        alert('Ocurrió un error al editar el lugar');
    }
}

loadPlaces();

function renderTable(places) {
  const tbody = document.querySelector('#places-table tbody');
  tbody.innerHTML = ''; // limpia la tabla

  places.forEach(place => {
    const [lng, lat] = place.location.coordinates;
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${place.name}</td>
      <td>${place.description}</td>
      <td>${lat.toFixed(5)}</td>
      <td>${lng.toFixed(5)}</td>
    `;
    tbody.appendChild(row);
  });
}
async function searchPlaces() {
  const name = document.getElementById('search-input').value;
  if (!name) {
    alert('Escribe un nombre para buscar');
    return;
  }

  const res = await fetch(`/api/places?name=${encodeURIComponent(name)}`);
  const filtered = await res.json();

  // Mostrar resultados en tabla
  renderTable(filtered);

  // Eliminar solo marcadores de lugar (no el mapa base ni zonas)
  map.eachLayer(layer => {
    if (layer instanceof L.Marker) map.removeLayer(layer);
  });

  // Agregar marcadores filtrados
  filtered.forEach(place => {
    const [lng, lat] = place.location.coordinates;
    L.marker([lat, lng])
      .addTo(map)
      .bindPopup(`
        <strong>${place.name}</strong><br>
        ${place.description}<br>
        <small><b>ID:</b> ${place._id}</small>
      `);
  });
}

document.getElementById('logout-btn').addEventListener('click', () => {
  localStorage.removeItem('token'); // o el nombre que uses
  alert('Sesión cerrada');
  location.href = 'index.html'; // o login.html si tienes
});
