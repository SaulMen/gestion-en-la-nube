from flask import Blueprint, jsonify, request
from DB.db import query, query_con_retorno
from S3Controler.Imagenes import Subir_imagenB64,get_image
from RekControler.rekognition import CompararYLogear,tags_perfil,obtener_texto
from Translate.translate import traducir

from Utildades import Funciones

rutas = Blueprint('usuario_blueprint',__name__)


@rutas.route("/check", methods=['GET'])
def f2():
    return jsonify({"status": "OK"}), 200

@rutas.route("/register", methods=['POST'])
def register():
    #print(request.json)
    try:
        name=request.json['name']
        userName=request.json['userName']
        passw=request.json['password']
        imageName=request.json['imageName']
        imageContent=request.json['imageContent']
        encriptada = Funciones.encriptarMD5(passw)

        validar = "SELECT userName FROM Semi1P.Users WHERE userName = %s "
        datos_validar = (userName)
        filas = query_con_retorno(validar,datos_validar)
        if len(filas)==0:

            err=Subir_imagenB64(userName+imageName,imageContent,"Fotos_Perfil")
            if err[1]:
                return jsonify({"err": True,"message": err[0]}),404
            else:
                consulta = "INSERT INTO Semi1P.Users (userName, Name, picture, passw) VALUES (%s, %s, %s, %s)"
                datos_usuario = (userName, name, err[0], encriptada)
                query(consulta,datos_usuario)
                return jsonify({"err": False, "message": "Usuario creado exitosamente"}),200
        else:
            return jsonify({"err": True,"message": "El usuario ya existe"}),404
    except Exception as e:
        print(e)
        return jsonify({"err": True, "message": "Ha ocurrido en el endpoint del Registro: " + str(e)}),404

@rutas.route("/login", methods=['POST'])
def login():
    try:
        userName=request.json['userName']
        passw=request.json['password']
        encriptada = Funciones.encriptarMD5(passw)
        validar = "SELECT * FROM Semi1P.Users WHERE userName = %s and passw = %s "
        datos_validar = (userName,encriptada)
        user = query_con_retorno(validar,datos_validar)[0]
        if len(user)==0:
            return jsonify({"err": True,"message": "Usuario o Contraseña Incorrectos"}),404
        else:
              return jsonify({
                            "err": False,
                            "messege":"Login Exitoso!!",
                            "data":{
                                        "idUser": user[0],
                                        "userName": user[1],
                                        "name": user[2],
                                        "imgPerfil": user[3],
                                        "passw": user[4]
                                    }
                            }),202

    except Exception as e:
        return jsonify({"err": True, "message": "Ha ocurrido en el endpoint del login: " + str(e)}),404

@rutas.route("/loginImage", methods=['POST'])
def loginbyface():
    try:
        userName=request.json['userName']
        passw=request.json['imageContent']
        validar = "SELECT * FROM Semi1P.Users as U WHERE userName = %s "
        datos_validar = (userName)
        user = query_con_retorno(validar,datos_validar)[0]
        #print(user)
        if len(user)==5:
            salida=CompararYLogear(passw,get_image(user[3]))
            if salida["err"]:
                return jsonify(salida),404
            return jsonify({
                            "err": False,
                            "messege":"Login Exitoso!!",
                            "data":{
                                        "idUser": user[0],
                                        "userName": user[1],
                                        "name": user[2],
                                        "imgPerfil": user[3],
                                        "passw": user[4]
                                    }
                            }),202
    except Exception as e:
        return jsonify({"err": True, "message": "Ha ocurrido en el endpoint del login por reconocimiento facial: " + str(e)}),404


@rutas.route("/translate", methods=['POST'])
def translate():
    try:
        data = request.json
        text = data.get('text','')
        source = data.get('source','')
        target = data.get('target','')
        salida = traducir(text,source,target)
        return jsonify(salida),202
    except Exception as e:
        return jsonify({"err": True, "message": "Ha ocurrido en el endpoint al traducir el texto: " + str(e)}),404

@rutas.route("/updateUser", methods=['PUT'])
def updateUser():
    try:
        idUser=request.json['idUser']
        name=request.json['name']
        userName=request.json['userName']
        passw=request.json['password']
        encriptada = Funciones.encriptarMD5(passw)

        validar = "SELECT * FROM Semi1P.Users WHERE idUser = %s "
        datos_validar = (idUser)
        filas = query_con_retorno(validar,datos_validar)
        if len(filas)>0:
            print(filas)
            if filas[0][4]!=encriptada:
                return jsonify({"err": True,"message": "Contraseña incorrecta"}),404
            consulta = "UPDATE Semi1P.Users SET userName = %s,Name = %s WHERE idUser = %s"
            datos_usuario = (userName, name, idUser)
            query(consulta,datos_usuario)
            return jsonify({"err": False,"data":{
                "idUser": filas[0][0],
                "userName": userName,
                "name": name,
                "imgPerfil": filas[0][3],
                "passw": encriptada

            } ,"message": "Usuario Actualizado exitosamente"}),200
        else:
            return jsonify({"err": True,"message": "El usuario no existe"}),404
    except Exception as e:
        return jsonify({"err": True, "message": "Ha ocurrido en el endpoint del Editar perfil: " + str(e)}),404
    
@rutas.route("/updatePerfil", methods=['PUT'])
def updatePerfil():
    try:
        idUser=request.json['idUser']
        imageName=request.json['imageName']
        imageContent=request.json['imageContent']
        passw=request.json['password']
        encriptada = Funciones.encriptarMD5(passw)

        validar = "SELECT * FROM Semi1P.Users WHERE idUser = %s "
        datos_validar = (idUser)
        filas = query_con_retorno(validar,datos_validar)
        if len(filas)>0:
            print(filas)
            if filas[0][4]!=encriptada:
                return jsonify({"err": True,"message": "Contraseña incorrecta"}),404
            user = filas[0]
            err=Subir_imagenB64(user[1]+imageName,imageContent,"Fotos_Perfil")
            if err[1]:
                return jsonify({"err": True,"message": err[0]}),404
            else:
                consulta = "UPDATE Semi1P.Users SET picture = %s  WHERE idUser = %s"
                datos_usuario = (err[0], idUser)
                query(consulta,datos_usuario)
                return jsonify({
                            "err": False,
                            "message": "Usuario Actualizado exitosamente",
                            "data":{
                                        "idUser": user[0],
                                        "userName": user[1],
                                        "name": user[2],
                                        "imgPerfil": err[0],
                                        "passw": user[4]
                                    }}),200
        else:
            return jsonify({"err": True,"message": "El usuario no existe"}),404
    except Exception as e:
        return jsonify({"err": True, "message": "Ha ocurrido en el endpoint del Editar perfil: " + str(e)}),404
