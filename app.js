const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Importar rutas
const placeRoutes = require('./routes/places');
const userRoutes = require('./routes/user');
const zoneRoutes = require('./routes/zones');

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Rutas base
app.use('/api/places', placeRoutes);
app.use('/api/users', userRoutes);
app.use('/api/zones', zoneRoutes);


// Conexión a MongoDB Atlas
mongoose.connect(
  'mongodb+srv://joseperezmuneton23:KRDdLuBH8VwtElTP@cluster711.hy3wgzb.mongodb.net/saludmapa?retryWrites=true&w=majority&appName=cluster711'
)
.then(() => console.log('Conectado a MongoDB Atlas'))
.catch(err => console.error(' Error de conexión:', err));

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor activo en http://localhost:${PORT}`));
