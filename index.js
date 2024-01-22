const express = require('express')
require('dotenv').config()

//Crear servidor express
const app = express()

//Directorio Publico
app.use(express.static('public'))

// lectura y parseo del Body
app.use(express.json())

//Rutas
app.use('/api/auth', require('./routes/auth'))

//Escuchar peticiones
app.listen(process.env.PORT, () => {
    console.log(`Servidor corriendo en puerto ${process.env.PORT}`)
})
