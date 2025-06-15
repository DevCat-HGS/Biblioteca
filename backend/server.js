const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const app = express();

// Configuración
app.use(cors());
app.use(express.json());

// Configurar Content Security Policy
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; img-src 'self' data: https:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com"
  );
  next();
});

// Conexión a MongoDB usando variable de entorno
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bibliotecaPersonal';
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ MongoDB conectado'))
  .catch(err => console.error('❌ Error de MongoDB:', err));

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Rutas API
const librosRouter = require('./routes/libros');
app.use('/api/libros', librosRouter);

// Todas las demás rutas van al frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Iniciar servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor: http://localhost:${PORT}`);
  console.log(`📚 API: http://localhost:${PORT}/api/libros`);
});
