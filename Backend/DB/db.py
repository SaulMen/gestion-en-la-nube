import pymysql
from dotenv import load_dotenv
import os
#cargar las variables de entorno
load_dotenv()

#realizar la coneccion a la db
def get_conection():
    return pymysql.connect(host=os.getenv("DB_HOST"),
                           user= os.getenv("DB_USER"),
                           password= os.getenv("DB_PASSWORD"),
                           port= int(os.getenv("DB_PORT"))
                           )

#funcion para hacer consultas sin retorno
def query(quer:str, data= None):
    conexion = get_conection()
    consultas = quer.split("--")
    cursor = conexion.cursor()
    for i in consultas:
        print(i)
        if data:
            cursor.execute(i,data)
        else:
            cursor.execute(i)
        conexion.commit()
        cursor.fetchall()
    cursor.close()
    conexion.close()

#funcion para hacer consultas con retorno
def query_con_retorno(quer:str, data= None):
    conexion = get_conection()
    consultas = quer.split("--")
    cursor = conexion.cursor()
    retorno = None
    for i in consultas:
        print(i)
        if data:
            cursor.execute(quer,data)
            retorno = cursor.fetchall()
        else:
            cursor.execute(quer)
            retorno = cursor.fetchall()
        conexion.commit()
        
    cursor.close()
    conexion.close()
    return retorno
