import base64
import os
import boto3
from dotenv import load_dotenv

load_dotenv()

def CompararYLogear(imagen_capturada,foto_perfil):
    rekognition = boto3.client("rekognition",
                            aws_access_key_id=os.getenv("REK_ACCESS_KEY_ID"),
                            aws_secret_access_key=os.getenv("REK_SECRET_ACCESS_KEY"),
                            region_name='us-east-1')
    imagen_capturada = imagen_capturada.split(",")
    imagen=None
    try:
        imagen = base64.b64decode(imagen_capturada)
    except:
        imagen = base64.b64decode(imagen_capturada[-1])

    response = rekognition.compare_faces(
        SourceImage={'Bytes': imagen},
        TargetImage={'Bytes': foto_perfil}
    )

    if len(response['FaceMatches']) > 0:
        return {"err": False, "message": 'Inicio de sesión exitoso'}
    else:
        return {"err": True, "message": 'Inicio de sesión fallido'}
    
def tags_perfil(foto_perfil):
    rekognition = boto3.client("rekognition",
                            aws_access_key_id=os.getenv("REK_ACCESS_KEY_ID"),
                            aws_secret_access_key=os.getenv("REK_SECRET_ACCESS_KEY"),
                            region_name='us-east-1')
    response = rekognition.detect_faces(
        Image={'Bytes': foto_perfil},
        Attributes=['ALL']
    )
    if 'FaceDetails' in response and len(response['FaceDetails']) > 0:
        face_details = response['FaceDetails'][0]
        
        edad = face_details['AgeRange']
        genero = face_details['Gender']['Value']
        emocion_principal = max(face_details['Emotions'], key=lambda x: x['Confidence'])
        usa_lentes = face_details['Eyeglasses']['Value']
        tiene_barba = face_details['Beard']['Value']
        respuesta = {
            'edad': edad,
            'genero': genero,
            'emocion_principal': emocion_principal['Type'],
            'usa_lentes': usa_lentes,
            'tiene_barba': tiene_barba
        }
        return {"tags":respuesta}
    return {"err":True}

def obtener_texto(imagen_base64):
    try:
        rekognition = boto3.client("rekognition",
                                aws_access_key_id=os.getenv("REK_ACCESS_KEY_ID"),
                                aws_secret_access_key=os.getenv("REK_SECRET_ACCESS_KEY"),
                                region_name='us-east-1')
        imagen_capturada = imagen_base64.split(",")
        imagen=None
        try:
            imagen = base64.b64decode(imagen_capturada)
        except:
            imagen = base64.b64decode(imagen_capturada[-1])
        response = rekognition.detect_text(Image={'Bytes': imagen})
        #print(response)
        texto_detectado = [text['DetectedText'] for text in response['TextDetections']]
        salida = ""
        for i in texto_detectado:
            salida+=" "+i
        return {'err':False,'texto': salida}
    except:
        return {'err':True,'texto': ""}

def obtener_tags(image):
    try:
        rekognition = boto3.client("rekognition",
                                aws_access_key_id=os.getenv("REK_ACCESS_KEY_ID"),
                                aws_secret_access_key=os.getenv("REK_SECRET_ACCESS_KEY"),
                                region_name='us-east-1')
        imagen_capturada = image.split(",")
        imagen=None
        try:
            imagen = base64.b64decode(imagen_capturada)
        except:
            imagen = base64.b64decode(imagen_capturada[-1])
        respuesta = rekognition.detect_labels(Image={'Bytes':imagen})
        #print(respuesta)
        resultado = [ i["Name"] for i in respuesta['Labels']]
        #print(resultado)
        return {'err':False,'tags': resultado}
    except:
        return {'err':True,'tags': ""}