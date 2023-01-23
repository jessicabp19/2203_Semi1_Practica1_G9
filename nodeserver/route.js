var router = require('express').Router();
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
let consulta = require('./consulta');
const { uploadImageS3 } = require("./S3/uploadImages");


//Home
router.get('/', function (req,res,next){
    res.send('Online')
    res.end
})


router.post('/crearUsuario',jsonParser, async function(req,res,next) {
    let data = req.body
    let image = data.photo;
    if (image == (undefined || null)) {
        image = "";
    }
    try{
        if (image != undefined && image.length > 0) {
            image = await uploadImageS3(image, 'png');
            data.foto = image;
        }
        const resultado = await consulta.crearUsuario(data) 
        if (resultado.rows[0].crearusuario == 0){
            //return res.status(200).send({ codigo: 200, mensaje: resultado });
            return res.send({"codigo": 200, "mensaje": "Usuario creado correctamente."});
        }else{
            return res.send({"codigo": 400, "mensaje": "Usuario ya existente."});
        }
    } catch (error) {
        return res
        .status(400)
        .send({ ok: false, res: "error creando un usuario" });
    }
})

router.post('/iniciarSesion',jsonParser, async function(req,res,next) {
    //Datos recibidos para la consulta
    /*
        Atributos ejemplo (JSON)
        {
            "usuario": "Robertito",
            "pass":"12345678",
        }
    */
    let data = req.body;
    const resultado = await consulta.iniciarSesion(data)   

    //Enviar la respuesta
    if (resultado.rows[0].sesion == 1){
        return res.send({"codigo": 200, "mensaje": resultado.rows[0]});
    }
    else{
        return res.send({"codigo": 400, "mensaje": "Usuario o contraseña incorrecta."});
    }
})


router.post('/crearAlbum',jsonParser, async function(req,res,next) {
    //Datos recibidos para la consulta
    /*
        Atributos ejemplo (JSON)
        {
            "usuario": "Robertito",
            "album":"albumNuevo",
        }
    */
    let data = req.body;
    const resultado = await consulta.crearAlbum(data); 
    console.log(resultado);  
    //Enviar la respuesta
    if (resultado.rows[0].crearalbum == 1){
        return res.send({"codigo": 200, "mensaje": "Se ha creado el álbum correctamente."});
    }
    else{
        return res.send({"codigo": 400, "mensaje": "No se pudo crear el álbum, el nombre es repetido."});
    }
})

router.post('/crearFoto',jsonParser, async function(req,res,next) {
    let data = req.body
    let image = data.photo;
    if (image == (undefined || null)) {
        image = "";
    }
    try{
        if (image != undefined && image.length > 0) {
            image = await uploadImageS3(image, 'png');
            data.foto = image;
        }
        const resultado = await consulta.crearFoto(data);  
        if (resultado.rows[0].crearfoto == 1){
            return res.send({"codigo": 200, "mensaje": "Se ha creado la foto correctamente."});
        }
        else{
            return res.send({"codigo": 400, "mensaje": "No se pudo crear la foto, el nombre es repetido o algún otro error."});
        }
    } catch (error) {
        return res
        .status(400)
        .send({ ok: false, res: "error creando una foto" });
    }
})


router.post('/getFotos',jsonParser, async function(req,res,next) {
    //Datos recibidos para la consulta
    /*
        Atributos ejemplo (JSON)
        {
            "usuario": "Robertito",
        }
    */
    let data = req.body;
    
    const resultado = await consulta.getFotos(data);
    console.log(resultado)   
    //Enviar la respuesta
    if (resultado.rows[0].length >=  1){
        return res.send({"codigo": 200, "mensaje": resultado.rows});
    }
    else{
        return res.send({"codigo": 400, "mensaje": "No se encontraron"});
    }
})

router.post('/modificarDatos',jsonParser, async function(req,res,next) {
    let data = req.body;
    let image = data.foto;
    if (image == (undefined || null)) {
        image = "";
    }
    try{
        if (image != undefined && image.length > 0) {
            image = await uploadImageS3(image, 'png');
            data.foto = image;
        }
        const resultado = await consulta.modificarDatos(data); 
        if (resultado.rows[0].estado != 0){
            return res.send({"codigo": 200, "mensaje": resultado.rows[0]});
        }
        else{
            return res.send({"codigo": 400, "mensaje": "No modificacion"});
        }
    } catch (error) {
        return res
        .status(400)
        .send({ ok: false, res: "error actualizando perfil" });
    }
})

router.post('/eliminarAlbum',jsonParser, async function(req,res,next) {
    //Datos recibidos para la consulta
    /*
        Atributos ejemplo (JSON)
        {
            "usuario": "Robertito",
            "album":"albumNuevo",
        }
    */
    let data = req.body;
    const resultado = await consulta.eliminarAlbum(data);   
    //Enviar la respuesta
    if (resultado.rows[0].eliminaralbum == 1){
        return res.send({"codigo": 200, "mensaje": resultado});
    }
    else{
        return res.send({"codigo": 400, "mensaje": "No elimino"});
    }
})

router.post('/eliminarFoto',jsonParser, async function(req,res,next) {
    //Datos recibidos para la consulta
    /*
        Atributos ejemplo (JSON)
        {
            "usuario": "Robertito",
            "album": "nombre_album",
            "foto":"Roberto Acevedo",
        }
    */
    let data = req.body;
    const resultado = await consulta.eliminarFoto(data);   
    //Enviar la respuesta
    if (resultado.rows[0].eliminarfoto == 1){
        return res.send({"codigo": 200, "mensaje": "El album fue eliminado correctamente."});
    }
    else{
        return res.send({"codigo": 400, "mensaje": "El album no fue eliminado"});
    }
})



router.post('/editarAlbum',jsonParser, async function(req,res,next) {
    //Datos recibidos para la consulta
    /*
        Atributos ejemplo (JSON)
        {
            "usuario": "Robertito",
            "album": "nombre_album",
            "nuevoNombre":"elNuevoAlbum",
        }
    */
    let data = req.body;
    const resultado = await consulta.editarAlbum(data);   
    //Enviar la respuesta
    if (resultado.rows[0]){
        return res.send({"codigo": 200, "mensaje": resultado});
    }
    else{
        return res.send({"codigo": 400, "mensaje": "No editar"});
    }
})


module.exports = router;