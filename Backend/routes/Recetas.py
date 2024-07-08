from flask import Blueprint, jsonify, request
from DB.db import query, query_con_retorno
from S3Controler.Imagenes import Subir_imagenB64
from RekControler.rekognition import obtener_tags


rutas = Blueprint('receta_blueprint',__name__)

@rutas.route("/create", methods=['POST'])
def create():
    try:
        title=request.json['title']
        description=request.json['description']
        idUser=request.json['idUser']
        imageName=request.json['imageName']
        imageContent=request.json['imageContent']
        err=Subir_imagenB64(imageName,imageContent,"Fotos_Publicadas")
        if err[1]:
            return jsonify({"err": True,"message": err[0]}),404
        else:
            salida = obtener_tags(imageContent)
            consulta="""CALL Semi1P.AlmacenarReceta(%s,%s,%s,%s,%s)"""
            datos_receta = (salida["tags"][0],title,description,err[0],idUser)
            query(consulta,datos_receta)
            if len(salida["tags"])>5:
                for i in range(1,5):
                    consulta="""CALL Semi1P.AgregarTag(%s,%s)"""
                    datos_receta = (salida["tags"][i],idUser)
                    query(consulta,datos_receta)
            else:
                for i in salida["tags"][1:]:
                    consulta="""CALL Semi1P.AgregarTag(%s,%s)"""
                    datos_receta = (i,idUser)
                    query(consulta,datos_receta)
            return jsonify({"err": False, "message": "Receta subida exitosamente"}),200
        
    except Exception as e:
        return jsonify({"err": True, "message": "Ha ocurrido en el endpoint del Subir Receta: " + str(e)}),404
    
@rutas.route("/get", methods=['GET'])
def getRecetas():
    try:
        consulta = """SELECT *
                FROM Semi1P.Recetas """
        datos_usuario = ()
        retorno = query_con_retorno(consulta,datos_usuario)
        data = []
        for i in retorno:
            data.append({"idReceta":i[0],"title":i[1],"Description":i[2],"picture":i[3],"idUser":i[4]})
        return jsonify({"err": False, "message": "Recetas obtenidas exitosamente", "data":data}),200
        
    except Exception as e:
        return jsonify({"err": True, "message": "Ha ocurrido en el endpoint de obtener Recetas: " + str(e)}),404

@rutas.route("/getById/<idUser>", methods=['GET'])
def getrecid(idUser):
    try:
        id=idUser
        consulta = """SELECT *
                FROM Semi1P.Recetas WHERE Users_idUser = %s"""
        datos_usuario = (id )
        retorno = query_con_retorno(consulta,datos_usuario)
        data = []
        for i in retorno:
            data.append({"idReceta":i[0],"title":i[1],"Description":i[2],"picture":i[3],"idUser":i[4]})
        return jsonify({"err": False, "message": "Recetas obtenidas exitosamente", "data":data}),200
        
    except Exception as e:
        return jsonify({"err": True, "message": "Ha ocurrido en el endpoint de obtener Recetas por ID: " + str(e)}),404
    
@rutas.route("/getTags", methods=['GET'])
def getTags():
    try:
        consulta = """SELECT *
                FROM Semi1P.Tags """
        datos_usuario = ()
        retorno = query_con_retorno(consulta,datos_usuario)
        data = []
        for i in retorno:
            data.append({"idTag":i[0],"title":i[1]})
        return jsonify({"err": False, "message": "Tags obtenidas exitosamente", "data":data}),200
    except Exception as e:
        return jsonify({"err": True, "message": "Ha ocurrido en el endpoint de obtener Tags: " + str(e)}),404
    
@rutas.route("/getByTag/<idTag>", methods=['GET'])
def getbytag(idTag):
    try:
        consulta = """SELECT  *
                FROM Semi1P.Recetas AS R
                INNER JOIN Semi1P.Detalles AS D ON R.idReceta = D.Recetas_idReceta
                WHERE D.Tag_idTags = %s"""
        datos_usuario = (idTag)
        retorno = query_con_retorno(consulta,datos_usuario)
        data = []
        for i in retorno:
            data.append({"idReceta":i[0],"title":i[1],"Description":i[2],"picture":i[3],"idUser":i[4]})
        return jsonify({"err": False, "message": "Recetas obtenidas exitosamente", "data":data}),200
    except Exception as e:
        return jsonify({"err": True, "message": "Ha ocurrido en el endpoint de obtener Recetas por ID: " + str(e)}),404