from flask import Flask, jsonify, request
from flask_cors import CORS
from controller import mod_album
from controller import delete_photo
from controller import delete_album
from controller import mod_perfil
from controller import create_photo
from controller import log_in
from controller import create_user
from controller import get_photo
from controller import get_album
from controller import traducir

from controller import log_in_rek
from controller import extract_text
from controller import lex_response

app = Flask(__name__)
app.config["JSON_AS_ASCII"] = False
CORS(app)


@app.route("/")
def hello_world():
    return jsonify({
        "message": "Hola mundo"
    })


@app.route("/crearUsuario", methods=["POST"])
def crear_usuario():
    res = create_user(request.json["name"], request.json["user"],
                      request.json["password"], request.json["confirmpass"],
                      request.json["photo"])

    return jsonify(res), res["codigo"]


@app.route("/iniciarSesionCamara", methods=["POST"])
def iniciar_sesion_camara():
    res = log_in_rek(request.json["user"], request.json["photo"])

    return jsonify(res), res["codigo"]
    

@app.route("/iniciarSesion", methods=["POST"])
def iniciar_sesion():
    res = log_in(request.json["user"], request.json["password"])

    return jsonify(res), res["codigo"]


@app.route("/crearFoto", methods=["POST"])
def crear_foto():
    res = create_photo(request.json["photo"],
                       request.json["user"], request.json["description"])

    return jsonify(res), res["codigo"]


@app.route("/getFotos", methods=["POST"])
def ver_foto():
    res = get_photo(request.json["user"])

    return jsonify(res), res["codigo"]


@app.route("/extraerTexto", methods=["POST"])
def extraer_texto():
    res = extract_text(request.json["photo"])

    return jsonify(res), res["codigo"]


# ASK ABOUT IT
@app.route("/getAlbums", methods=["POST"])
def ver_album():
    res = get_album(request.json["user"])

    return jsonify(res), res["codigo"]


@app.route("/modificarDatos", methods=["POST"])
def modificar_datos():
    res = mod_perfil(request.json["user"], request.json["newuser"],
                     request.json["name"], request.json["password"],
                     request.json["photo"])

    return jsonify(res), res["codigo"]


@app.route("/editarAlbum", methods=["POST"])
def modificar_album():
    res = mod_album(request.json["user"], request.json["album"],
                    request.json["new"])

    return jsonify(res), res["codigo"]


@app.route("/eliminarAlbum", methods=["POST"])
def eliminar_album():
    res = delete_album(request.json["user"], request.json["album"])

    return jsonify(res), res["codigo"]


@app.route("/eliminarFoto", methods=["POST"])
def eliminar_foto():
    res = delete_photo(
        request.json["user"], request.json["album"], request.json["photo"])

    return jsonify(res), res["codigo"]

################Traductor#######################
@app.route('/traducir', methods=['POST'])
def traductor():
    content = request.get_json(silent=True)
    target = content.get("target",None)
    text = content.get("text",None)
    result = traducir(text,target)
    res ={"codigo": 200, "mensaje": result}
    return jsonify(res), res["codigo"]

@app.route("/bot", methods=["POST"])
def chat_bot():
    res = lex_response(
        request.json["texto"])

    return jsonify(res), res["codigo"]


if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0')
