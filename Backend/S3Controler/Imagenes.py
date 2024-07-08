import os
import boto3
import base64
from dotenv import load_dotenv

load_dotenv()

def Subir_imagenB64(file_name,Image_Base64,Carpeta):
    #print(Image_Base64)
    s3 = boto3.client('s3',
            aws_access_key_id=os.getenv("S3_ACCESS_KEY_ID"),
            aws_secret_access_key=os.getenv("S3_SECRET_ACCESS_KEY"),
            region_name='us-east-2'
            )
    Image_Base64 = Image_Base64.split(",")
    imagen=None
    try:
        imagen = base64.b64decode(Image_Base64)
    except:
        imagen = base64.b64decode(Image_Base64[-1])


    try:
        s3.put_object(Bucket='practica2-g15-imagenes', Key=Carpeta+"/"+file_name+".jpg", Body=imagen)
        url= f'https://practica2-g15-imagenes.s3.us-east-2.amazonaws.com/{Carpeta}/{file_name}'+".jpg"
        return [url, False]
    except Exception as e:
        print("error Funciones Subir_imagenB64",e)
        return["Error en funcion para subir imagen", True]


def get_image(url:str):
    spl = url.split("/")
    clave=f"{spl[3]}/{spl[4]}"
    try:
        s3 = boto3.client('s3',
            aws_access_key_id=os.getenv("S3_ACCESS_KEY_ID"),
            aws_secret_access_key=os.getenv("S3_SECRET_ACCESS_KEY"),
            region_name='us-east-2'
            )
        # Descarga la imagen de perfil desde S3
        response = s3.get_object(Bucket='practica2-g15-imagenes', Key=clave)
        imagen_bytes = response['Body'].read()
        return imagen_bytes
    except Exception as e:
        print("Error al obtener la imagen de perfil desde S3:", e)
        return None
#Subir_imagenB64("prueba3","data:image/png;base64,content","Fotos_Publicadas")
