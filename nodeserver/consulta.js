
//Módulo de pg
const { Client } = require('pg')


//Traer las variables de entorno
const config = require('./config.js');


//Credenciales de la base de datos
const credencialesDB = {
    user: config.USER,
    host: config.HOST,
    database: config.DB,
    password: config.PASS,
    port: config.PORT,
  }


//Función para ejecutar las consultas
async function ejecutar (query){
    //Conectar a la BD
    const client = new Client(credencialesDB)
    var respuesta;
    try{
        await client.connect()
        respuesta = await client.query(query); 
    }catch (err) {
        respuesta = err
    }finally{
        //Cerrar la conexión
        if (client){
            await client.end()
        }
    }
    return respuesta
}


async function crearUsuario (data){
    const query = 
    `SELECT * FROM crearUsuario('${data.user}','${data.name}','${data.password}','${data.photo}');`;
    //Conectar
    const resultado = ejecutar(query); 
    return resultado
}

async function iniciarSesion (data){
    const query = 
    `SELECT * FROM iniciarSesion('${data.user}','${data.password}');`;
    const resultado = await ejecutar(query);  
    return resultado 
}

async function crearAlbum (data){
    const query = 
    `SELECT * FROM crearAlbum('${data.user}','${data.album}');`;
    const resultado = await ejecutar(query);
    return resultado
}

async function crearFoto (data){
    const query = 
    `SELECT * FROM crearFoto('${data.photo}','${data.album}','${data.user}')`;
    const resultado = await ejecutar(query);
    return resultado
}

async function getFotos (data){
    const query = 
    `SELECT * FROM getFotos('${data.user}')`;
    const resultado = await ejecutar(query);
    return resultado
}

async function modificarDatos (data){
    const query = 
    `SELECT * FROM modificarDatos('${data.user}','${data.newuser}','${data.name}','${data.password}','${data.photo}')`;
    const resultado = await ejecutar(query);
    return resultado
}

async function eliminarAlbum (data){
    const query = 
    `SELECT * FROM eliminarAlbum('${data.user}','${data.album}')`;
    const resultado = await ejecutar(query);
    return resultado
}

async function eliminarFoto (data){
    const query = 
    `SELECT * FROM eliminarFoto('${data.user}','${data.album}','${data.photo}')`;
    const resultado = await ejecutar(query);
    return resultado    
}

async function editarAlbum (data){
    const query = 
    `SELECT * FROM editarAlbum('${data.usuario}','${data.album}','${data.nuevoNombre}')`;
    const resultado = await ejecutar(query);
    return resultado    

}


module.exports.crearUsuario = crearUsuario;
module.exports.iniciarSesion = iniciarSesion;
module.exports.crearAlbum = crearAlbum;
module.exports.crearFoto = crearFoto;
module.exports.getFotos = getFotos;
module.exports.modificarDatos = modificarDatos;
module.exports.eliminarAlbum = eliminarAlbum;
module.exports.eliminarFoto = eliminarFoto;
module.exports.editarAlbum = editarAlbum;