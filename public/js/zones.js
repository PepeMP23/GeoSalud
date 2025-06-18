// Inicializar el mapa
const map = L.map('map').setView([21.1222, -101.6805], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© Map data de Angel García'
}).addTo(map);

const token = localStorage.getItem('token');
if (!token) {
  alert('Primero inicia sesión');
  location.href = 'index.html';
}


const drawControl = new L.Control.Draw({
  draw: {
    polygon: true,
    rectangle: true,
    circle: false,
    polyline: false,
    marker: false,
    circlemarker: false
  },
  edit: false
});
map.addControl(drawControl);

map.on(L.Draw.Event.CREATED, async function (event) {
  const layer = event.layer;

  if (event.layerType === 'polygon' || event.layerType === 'rectangle') {
    const latlngs = layer.getLatLngs()[0];
    const shape = latlngs.map(p => [p.lat, p.lng]);

    const name = prompt("Nombre de la zona:");
    const description = prompt("Descripción de la zona:");

    if (!name || !description) {
      alert("Nombre y descripción requeridos");
      return;
    }

    try {
      const res = await fetch('/api/zones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, shape })
      });

      if (res.ok) {
        alert('Zona guardada');
        location.reload();
      } else {
        const error = await res.json();
        alert('Error: ' + error.message);
      }
    } catch (err) {
      console.error('Error al guardar zona:', err);
      alert('Ocurrió un error al guardar la zona');
    }
  }
});

async function loadZones() {
  const res = await fetch('/api/zones');
  const zones = await res.json();
  renderZones(zones);
}

function renderZones(zones) {
  const tbody = document.querySelector('#zones-table tbody');
  tbody.innerHTML = '';

  zones.forEach(zone => {
    const polygon = L.polygon(zone.shape).addTo(map);
    polygon.bindPopup(`
      <strong>${zone.name}</strong><br>
      ${zone.description}<br>
      <small><b>ID:</b> ${zone._id}</small>
    `);

    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${zone.name}</td>
      <td>${zone.description}</td>
      <td>${zone.shape.length} puntos</td>
    `;
    tbody.appendChild(row);
  });
}

async function searchZones() {
  const name = document.getElementById('search-zone-input').value;
  if (!name) {
    alert('Escribe un nombre para buscar');
    return;
  }

  const res = await fetch(`/api/zones?name=${encodeURIComponent(name)}`);
  const zones = await res.json();

  map.eachLayer(layer => {
    if (layer instanceof L.Polygon) map.removeLayer(layer);
  });

  renderZones(zones);
}

async function editZone() {
  const id = document.getElementById('edit-zone-id').value.trim();
  const name = document.getElementById('edit-zone-name').value.trim();
  const description = document.getElementById('edit-zone-description').value.trim();

  if (!id || !name || !description) {
    alert('Completa todos los campos para editar una zona');
    return;
  }

  try {
    const res = await fetch(`/api/zones/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description })
    });

    const data = await res.json();

    if (res.ok) {
      alert('Zona actualizada correctamente');
      location.reload();
    } else {
      alert(data.error || 'Error al actualizar la zona');
    }
  } catch (err) {
    console.error('Error al editar zona:', err);
    alert('Error de red');
  }
}

async function deleteZone() {
  const id = document.getElementById('delete-zone-id').value;

  if (!id) {
    alert('Ingresa un ID válido');
    return;
  }

  const confirmed = confirm(`¿Eliminar zona con ID: ${id}?`);
  if (!confirmed) return;

  try {
    const res = await fetch(`/api/zones/${id}`, {
      method: 'DELETE'
    });

    const result = await res.json();

    if (res.ok) {
      alert('Zona eliminada correctamente');
      location.reload();
    } else {
      alert(`Error: ${result.error}`);
    }
  } catch (err) {
    console.error(err);
    alert('Error al eliminar zona');
  }
}

// Cargar todas las zonas al iniciar
loadZones();

document.getElementById('logout-btn').addEventListener('click', () => {
  localStorage.removeItem('token'); 
  alert('Sesión cerrada');
  location.href = 'index.html'; 
});
