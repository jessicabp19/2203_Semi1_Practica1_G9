from dotenv import load_dotenv
import base64
import boto3
import os
import psycopg2
import uuid

load_dotenv()
HOST_DB = os.getenv("HOST_DB")
DB = os.getenv("DB")
PASS_DB = os.getenv("PASS_DB")
USER_DB = os.getenv("USER_DB")

S3_BUCKET = os.getenv("S3_BUCKET")
S3_REGION = os.getenv("S3_REGION")
S3_ACCESS_KEY_ID = os.getenv("S3_ACCESS_KEY_ID")
S3_SECRET_ACCESS_KEY_BUCKET = os.getenv("S3_SECRET_ACCESS_KEY_BUCKET")

RKG_REGION = os.getenv("RKG_REGION")
RKG_ACCESS_KEY_ID = os.getenv("RKG_ACCESS_KEY_ID")
RKG_SECRET_ACCESS_KEY_RKG = os.getenv("RKG_SECRET_ACCESS_KEY_RKG")
LEX_REGION = os.getenv("LEX_REGION")
LEX_ACCESS_KEY_ID = os.getenv("LEX_ACCESS_KEY_ID")
LEX_SECRET_ACCESS_KEY = os.getenv("LEX_SECRET_ACCESS_KEY")

BOT_ID_1 = os.getenv("BOT_ID_1")
ALIAS_ID_1 = os.getenv("ALIAS_ID_1")
LOCALE_ID_1 = os.getenv("LOCALE_ID_1")
SESSION_ID_1 = os.getenv("SESSION_ID_1")

client = boto3.resource(
    's3',
    aws_access_key_id=S3_ACCESS_KEY_ID,
    aws_secret_access_key=S3_SECRET_ACCESS_KEY_BUCKET,
    region_name=S3_REGION
)

rekClient = boto3.client(
    service_name='rekognition', 
    region_name=RKG_REGION, 
    aws_access_key_id=RKG_ACCESS_KEY_ID, 
    aws_secret_access_key=RKG_SECRET_ACCESS_KEY_RKG
)

translate = boto3.client(
    service_name='translate',
    region_name= os.environ.get('TL_REGION'),
    aws_access_key_id= os.environ.get('TL_ACCESS_KEY_ID'),
    aws_secret_access_key= os.environ.get('TL_SECRET_ACCESS_KEY_TL')
)


client_lex = boto3.client(
    'lexv2-runtime',
    aws_access_key_id=LEX_ACCESS_KEY_ID,
    aws_secret_access_key=LEX_SECRET_ACCESS_KEY,
    region_name=LEX_REGION
)


def subir_imagen(prefix, photo):
    decoded_image = base64.b64decode(photo['base64'])
    key = f'{prefix}/{uuid.uuid4()}.{photo["extension"]}'
    obj = client.Object(S3_BUCKET, key)
    obj.put(Body=decoded_image)
    object_acl = client.ObjectAcl(S3_BUCKET, key)
    response = object_acl.put(ACL='public-read')

    return key

def comparar_imagen(newPhoto, profilePhoto):
    login = 0
    decoded_image = base64.b64decode(newPhoto)
    try:
        response = rekClient.compare_faces(
            SourceImage={"Bytes": decoded_image}, 
            TargetImage={"S3Object": { "Bucket": S3_BUCKET, "Name": profilePhoto}}, 
            SimilarityThreshold=85.00
        )

        match = response['FaceMatches']
        if len(match) == 0:
            return login

        login = 1

    except:
        print("An exception occurred on profile validation")
    
    return login

def analizar_rostro(photo_url):
    labels = ""
    try:
        response = rekClient.detect_faces(
            Image={"S3Object": {"Bucket": S3_BUCKET, "Name": photo_url}},
            Attributes=['ALL']
        )

        facedetails = response['FaceDetails']
        if len(facedetails) == 0:
            return "N/A"

        avoidWords = ["BoundingBox", "Quality", "Pose", "Landmarks", "Confidence"]
        specialWords = ["Emotions", "AgeRange", "Gender"]
        d = facedetails[0]

        for i in d:
            if i in avoidWords:
                continue
            if i not in specialWords:
                if d[i]["Value"] == True:
                    labels = labels + i + ','
                    continue
            if i == "AgeRange":
                labels = labels + str(d[i]['Low']) + '-' + str(d[i]['High']) + ','
            if i == "Gender":
                labels = labels + str(d[i]['Value']) + ','
            if i == "Emotions":
                for j in d[i]:
                    if j["Confidence"] > 85.00:
                        labels = labels + str(j['Type']) + ','
                #endfor
        #endfor

    except:
        print("An exception occurred on face detection")
        
    return labels

def extraer_texto(photo):
    textDetection = ""
    decoded_image = base64.b64decode(photo)
    try:
        response = rekClient.detect_text(Image={"Bytes": decoded_image})

        detect = response['TextDetections']
        if len(detect) == 0:
            return textDetection

        for i in detect:
            if i['Type'] == 'LINE':
                textDetection = textDetection + ' ' + i['DetectedText']

    except:
        print("An exception occurred on text extraction")
        
    return textDetection

def obtener_etiquetas(photo_url):
    arrlabels = []
    try:
        response = rekClient.detect_labels(
            Image={"S3Object": {"Bucket": S3_BUCKET, "Name": photo_url}},
            MaxLabels=2,
            MinConfidence=85.00
        )
        lbs = response['Labels']
        if len(lbs) == 0:
            return ""
            
        for i in lbs:
            arrlabels.append(i['Name'])

    except:
        print("An exception occurred on labels detection")
        
    return arrlabels

def database_connection():
    connection = psycopg2.connect(
        host=HOST_DB, database=DB, user=USER_DB, password=PASS_DB)
    return connection

def execute_query(consulta, parametros):
    connection = database_connection()
    cursor = connection.cursor()

    cursor.execute(consulta, parametros)
    connection.commit()

    columnas = list(cursor.description)
    resultado = cursor.fetchall()

    resultados = []
    for row in resultado:
        row_dict = {}
        for i, col in enumerate(columnas):
            row_dict[col.name] = row[i]
        resultados.append(row_dict)

    cursor.close()
    connection.close()

    return resultados


################################TRADUCTOR#####################################
def traducir(texto,target):
    l_source = getIdioma(0)
    l_target = getIdioma(target)
    result = translate.translate_text(Text=texto,SourceLanguageCode=l_source,TargetLanguageCode=l_target)
    t_result = result.get('TranslatedText')
    return t_result

def getIdioma(target):
    if target == 0:
        return 'auto'
    if target == 1:
        return 'en'
    elif target == 2:
        return 'it'
    elif target == 3:
        return 'ko'



########################## REQUESTS ##############################

def create_user(name, user, password, confirmpass, photo):
    if password != confirmpass:
        return {"codigo": 400, "mensaje": "Contraseñas diferentes."}

    photo_url = subir_imagen("Fotos_Perfil", photo)

    resultado = execute_query(
        "SELECT * FROM crearUsuario(%s,%s,%s)", (user, name, password))

    if resultado[0]['crearusuario'] == 0:
        return {"codigo": 400, "mensaje": "Usuario ya existente."}

    analisis = analizar_rostro(photo_url)
    resultado = execute_query(
        "SELECT * FROM crearFoto(%s,%s,%s,%s,%s)", (user,photo_url,"FotoPerfil",analisis,1))

    if resultado[0]['crearfoto'] == 0:
        return {"codigo": 400, "mensaje": "No se pudo crear la foto."}

    return {"codigo": 200, "mensaje": "Usuario creado correctamente."}


def log_in(user, password):
    resultado = execute_query(
        "SELECT * FROM iniciarSesion(%s,%s)", (user, password))

    if len(resultado) == 0 or resultado[0]['sesion'] == 0:
        return {"codigo": 400, "mensaje": "Usuario o contraseña incorrecta."}

    return {"codigo": 200, "mensaje": resultado}


def log_in_rek(user, photo):
    resultado = execute_query(
        "SELECT * FROM getPerfil(%s)", (user,))

    if len(resultado) == 0:
        return {"codigo": 400, "mensaje": "Usuario incorrecto."}

    resultado = execute_query(
        "SELECT * FROM getUsuario(%s)", (user,))

    validacion = comparar_imagen(photo, resultado[0]['foto'])

    if validacion == 0:
        return {"codigo": 400, "mensaje": "Usuario o foto incorrecta."}

    return {"codigo": 200, "mensaje": resultado}


def create_photo(photo, user, description):
    photo_url = subir_imagen("Fotos_Publicadas", photo)
    etiquetas = obtener_etiquetas(photo_url)

    resultado = execute_query(
        "SELECT * FROM crearFoto(%s,%s,%s,%s,%s)", (user,photo_url,description,str(etiquetas),0))

    idPhoto = resultado[0]['crearfoto']
    if idPhoto == 0:
        return {"codigo": 400, "mensaje": "CreatePhoto, No se pudo crear la foto."}

    #Asignacion fotos -> albums (c/etiqueta)
    for lb in etiquetas:
        resultado = execute_query("SELECT * FROM asignarFoto(%s, %s)", (idPhoto,lb))
 
    return {"codigo": 200, "mensaje": "Se ha creado la foto correctamente."}


def get_photo(user):
    resultado = execute_query("SELECT * FROM getFotos(%s)", (user,))

    return {"codigo": 200, "mensaje": resultado}


def get_album(user):
    resultado = execute_query("SELECT * FROM getAlbums(%s)", (user,))

    return {"codigo": 200, "mensaje": resultado}


def mod_perfil(user, newuser, name, password, photo):
    if photo == 'null':
        resultado = execute_query(
            "SELECT * FROM modificarDatos(%s,%s,%s,%s)", (user, newuser, name, password))

        if resultado[0]['estado'] == 0:
            return {"codigo": 400, "mensaje": "No se modificó el perfil. Contraseña incorrecta."}

        return {"codigo": 200, "mensaje": resultado}

    else:
        photo_url = subir_imagen("Fotos_Perfil", photo)
        resultado = execute_query(
            "SELECT * FROM modificarDatos(%s,%s,%s,%s)", (user, newuser, name, password))
        
        if resultado[0]['estado'] == 0:
            return {"codigo": 400, "mensaje": "No se modificó el perfil. Contraseña incorrecta."}

        # Updating profile photo
        analisis = analizar_rostro(photo_url)
        resultado = execute_query(
            "SELECT * FROM crearFoto(%s,%s,%s,%s,%s)", (newuser,photo_url,"FotoPerfil",analisis,1))

        if resultado[0]['crearfoto'] == 0:
            return {"codigo": 400, "mensaje": "No se pudo crear la foto."}


        return {"codigo": 200, "mensaje": resultado}


def mod_album(user, album, new):
    resultado = execute_query(
        "SELECT * FROM editarAlbum(%s,%s,%s)", (user, album, new))

    return {"codigo": 200, "mensaje": resultado}


def delete_album(user, album):
    execute_query("SELECT * FROM eliminarAlbum(%s,%s)", (user, album))

    return {"codigo": 200, "mensaje": "El album fue eliminado correctamente."}


def delete_photo(user, album, photo):
    execute_query("SELECT * FROM eliminarFoto(%s,%s,%s)", (user, album, photo))

    return {"codigo": 200, "mensaje": "Se elimino la foto correctamente."}


def extract_text(photo):
    texto = extraer_texto(photo)

    if texto == "":
        return {"codigo": 400, "mensaje": "Foto sin texto."}

    return {"codigo": 200, "mensaje": texto}

    
def lex_response(texto):
    response = client_lex.recognize_text(
        botId=BOT_ID_1,
        botAliasId=ALIAS_ID_1,
        localeId=LOCALE_ID_1,
        sessionId=SESSION_ID_1,
        text=texto
    )
    return {"codigo": 200, "mensaje": response}
