const express = require('express')
const cors = require('cors');

//Ruteador
const router = require('./route');

//Crear la app express
const app = express()
app.use(cors());
app.use('/', router);

//Puerto de conexión
const PORT = process.env.PORT || 5000;

//Iniciar conexión
app.listen(PORT, console.log(
    `El servidor esta corriendo en el puerto ${PORT}`
))
