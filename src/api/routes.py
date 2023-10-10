"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from datetime import timedelta
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, TokenBlockedList, Events, Teams, Pagos, Registros, RegistrosPagos, Pagos_Paypal
from api.utils import generate_sitemap, APIException
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, get_jwt
from datetime import datetime, timezone

api = Blueprint('api', __name__)
#estandar para toda la inicialización de bcrypt
app=Flask(__name__)
bcrypt = Bcrypt(app)
@api.route('/updateimage', methods=['POST'])
# Middleware para verificar la autenticación
@jwt_required()
def update_profile_image():
    # Obtener el ID del usuario autenticado desde el token
    user_id = get_jwt_identity()
    profile_image = request.json.get('newImageUrl')
    # Comprobar si se ha enviado un archivo en la solicitud
    if 'newImageUrl' not in request.json:
        return jsonify({"error": "No se ha enviado un archivo de imagen"}), 400
    # Verificar que el archivo sea una imagen 
    #allowed_extensions = {'jpg', 'jpeg', 'png', 'gif'}
   # if not profile_image.lower().endswith(tuple(allowed_extensions)):
      #  return jsonify({"error": "Tipo de archivo no permitido"}), 400
    # Generar un nombre único para la imagen
    #filename = f"user_{user_id}_profile.jpg"  # Puedes cambiar la extensión según el tipo de archivo
    # Guardar la imagen
   # profile_image.save(os.path.join(upload_folder, filename))
    # Generar la URL completa de la imagen
  #  base_url = process.env.BACKEND_URL 
    #profile_image_url = f'{base_url}/{upload_folder}/{filename}'

    # Actualizar la URL de la imagen en la base de datos
    user = User.query.get(user_id)
    user.url_perfil = profile_image
    db.session.commit()
    # Ejemplo de respuesta exitosa:
    return jsonify({"message": "Imagen de perfil actualizada correctamente"}), 200



@api.route("/changepassword", methods=["POST"])
@jwt_required()
def change_password():
    new_password=request.json.get("Password")
    user_id=get_jwt_identity()
    secure_password = bcrypt.generate_password_hash(new_password, 10).decode("utf-8")
    user=User.query.get(user_id)
    user.password=secure_password
    db.session.add(user)
    db.session.commit()
    return jsonify({"msg": "Clave actualizada"})

@api.route("/recoverpassword", methods=["POST"])
def recover_password():
    user_email = request.json.get("email")
    user = User.query.filter_by(email=user_email).first() 
    
    # Si no se encontró el usuario
    if user is None:
        return jsonify({"message": "User not found"}), 404
    
    # Generar token temporal para la recuperación
    token = create_access_token(
        identity=user.id, expires_delta=timedelta(minutes=10), additional_claims={"type": "password"}  # Corregir 'true' a 'True'
    )
    return jsonify({"recoveryToken": token}), 200



@api.route('/signup', methods=['POST'])
def create_user():
    #recibir correo y password
    email = request.json.get("email")
    password = request.json.get("password")
    name = request.json.get("name")
    #buscar usuario en la bd, que me traiga el primer resultado
    user = User.query.filter_by(email = email).first()
    #si existe el usuario mostrar error
    if user is not None:
        return jsonify({"message": "User already exist"}), 401
    #definir secure_password que se va a guardar en el campo de la bd
    secure_password = bcrypt.generate_password_hash(password, 10).decode("utf-8")
    #crear nuevo usuario a partir de esta data
    #new_event = User(email=data.email, password=data.password)
    new_user = User()
    new_user.email = email
    new_user.password = secure_password
    new_user.is_active = True
    new_user.name = name
    new_user.address = ""
    new_user.phone = ""
    new_user.url_perfil = ""
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"msg":"Usuario registrado"}), 201

@api.route('/login', methods=['POST'])
def login_user():
    #recibir datos del cuerpo de la petición
    email = request.json.get("email")
    password = request.json.get("password")
    #verificación de la contraseña
    #ubicar usuario en la bd, que me traiga el primer resultado
    user = User.query.filter_by(email = email).first()
    #si no se encontró el usuario
    if user is None:
        return jsonify({"message": "User not found"}), 401
    #si la clave no es válida regresamos error
    #verificando el pass del usuario que me regresó de la bd (user.password)
    #con el password de la petición de json (password)
    if not bcrypt.check_password_hash(user.password, password):
        return jsonify({"message": "Wrong password"}), 401
    #después de las validaciones enviar msje de confirmación, se genera el token
    #ya podemos verificar la clave encriptada a la hr de inicio de sesión
    #pasando contenido al token, id del usuario de la bd
    token = create_access_token(identity=user.id, additional_claims={"role":"organizador"})
    return jsonify({"message": "Login successful", "token":token}), 200

#utilizar intermediarios middlewares
#solo para usuarios autenticados
#para eso importar depurador de jwt_extended jwt_required
#para usuarios que tengan en el encabezado de la petición un token válido
@api.route('/helloprotected')
@jwt_required() #convierte la ruta en protegida
def hello_protected():
    #traer el subject de mi token (pasado anteriormente al hacer create_access_token identity=user.id)
    #en este caso el id del usuario obtenido de la bd
    user_id = get_jwt_identity()
    claims = get_jwt()
    #con la información del token, traer datos del usuario de la bd
    user = User.query.get(user_id)
    response = {
        "userId": user_id,
        "email" : user.email,
        "claims": claims,
        "isActive": user.is_active,
        "name": user.name,
        "address": user.address,
        "phone": user.phone,
        "url_perfil": user.url_perfil
    }
    return jsonify(response)

@api.route('/logout', methods=['POST'])
@jwt_required()
def user_logout():
    #obtener el jti del token que traemos en claims (get_jwt)
    jti= get_jwt()["jti"]
    now = datetime.now(timezone.utc)
    tokenBlocked = TokenBlockedList(token = jti, created_at = now)
    #guardarlo en la bd
    db.session.add(tokenBlocked)
    db.session.commit()
    return jsonify({"message": "User logged out"}), 200

@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Excellent, the request was succesfull"
    }

    return jsonify(response_body), 200
  
@api.route('/newevent', methods=['POST'])
@jwt_required()
def create_event():
    #recibir datos del evento
    id_user = get_jwt_identity()
    event = request.json
    object_context= event["eventData"]
    nombre_evento= object_context["nombre_evento"]
    descr_corta= object_context["descr_corta"]
    fecha_ini= object_context["fecha_ini"]
    fecha_fin= object_context["fecha_fin"]
    ubicacion= object_context["ubicacion"]
    logotipo= object_context["logotipo"]
    descr_larga= object_context["descr_larga"]
    reglas= object_context["reglas"]
    fecha_lim= object_context["fecha_lim"]
    hora_lim= object_context["hora_lim"]
    email_contacto= object_context["email_contacto"]
    tel_contacto= object_context["tel_contacto"]
    nombre_contacto= object_context["nombre_contacto"]
    costo= object_context["costo"]
    #crear nuevo evento a partir de esta data
    new_event = Events()
    new_event.nombre_evento = nombre_evento
    new_event.descr_corta = descr_corta
    new_event.fecha_ini = fecha_ini
    new_event.fecha_fin = fecha_fin
    new_event.ubicacion = ubicacion
    new_event.logotipo = logotipo
    new_event.descr_larga = descr_larga
    new_event.reglas = reglas
    new_event.fecha_lim = fecha_lim
    new_event.hora_lim = hora_lim
    new_event.email_contacto = email_contacto
    new_event.tel_contacto = tel_contacto
    new_event.nombre_contacto = nombre_contacto
    new_event.costo = float(costo)
    new_event.id_user = id_user
    db.session.add(new_event)
    db.session.commit()
    object_context["id"] = new_event.id
    return jsonify(object_context), 201

@api.route('/editevent', methods=['POST'])
@jwt_required()
def edit_event():
    #recibir datos del evento
    event = request.json
    object_context= event["eventData"]
    event_id = object_context["id"]
    nombre_evento= object_context["nombre_evento"]
    descr_corta= object_context["descr_corta"]
    fecha_ini= object_context["fecha_ini"]
    fecha_fin= object_context["fecha_fin"]
    ubicacion= object_context["ubicacion"]
    logotipo= object_context["logotipo"]
    descr_larga= object_context["descr_larga"]
    reglas= object_context["reglas"]
    fecha_lim= object_context["fecha_lim"]
    hora_lim= object_context["hora_lim"]
    email_contacto= object_context["email_contacto"]
    tel_contacto= object_context["tel_contacto"]
    nombre_contacto= object_context["nombre_contacto"]
    costo= object_context["costo"]
    #buscar evento
    event = Events.query.get(event_id)
    event.nombre_evento = nombre_evento
    event.descr_corta = descr_corta
    event.fecha_ini = fecha_ini
    event.fecha_fin = fecha_fin
    event.ubicacion = ubicacion
    event.logotipo = logotipo
    event.descr_larga = descr_larga
    event.reglas = reglas
    event.fecha_lim = fecha_lim
    event.hora_lim = hora_lim
    event.email_contacto = email_contacto
    event.tel_contacto = tel_contacto
    event.nombre_contacto = nombre_contacto
    event.costo = int(costo)
    db.session.commit()
    return jsonify(object_context), 201

@api.route('/deleteevent', methods=['POST'])
@jwt_required()
def delete_event():
    #recibir datos del evento
    eventId = request.json.get("eventId")
    event = Events.query.get(eventId)
    db.session.delete(event)
    db.session.commit()
    return jsonify({"message": "Delete successfull"}), 201

@api.route('/loadevents', methods=['GET'])
@jwt_required()
def load_events():
    #recibir datos del cuerpo de la petición
    user = get_jwt_identity()
    #ubicar usuario en la bd, que me traiga todos los resultados
    lista = Events.query.filter_by(id_user = user).order_by(Events.fecha_ini.desc()).all()
    #si no se encontró el evento
    if lista is None:
        return jsonify({"message": "Events not found"}), 402
    response=[]
    for item in lista:
    #    response.append({item})
        response.append({
        "id": item.id,
        "nombre_evento": item.nombre_evento,
        "descr_corta": item.descr_corta,
        "fecha_ini": item.fecha_ini,
        "fecha_fin": item.fecha_fin,
        "ubicacion": item.ubicacion,
        "logotipo": item.logotipo,
        "descr_larga": item.descr_larga,
        "reglas": item.reglas,
        "fecha_lim": item.fecha_lim,
        "hora_lim": item.hora_lim,
        "email_contacto": item.email_contacto,
        "tel_contacto": item.tel_contacto,
        "nombre_contacto": item.nombre_contacto,
        "costo": item.costo,
        "id_user": item.id_user})
    #después de las validaciones enviar msje de confirmación
    #pasando contenido
    return jsonify({"eventos":response}), 200

@api.route('/newteam', methods=['POST'])
@jwt_required()
def create_team():
    #recibir datos del evento
    id_user = get_jwt_identity()
    team = request.json
    object_context= team["teamData"]
    nombre_equipo= object_context["nombre_equipo"]
    team = Teams.query.filter_by(nombre_equipo = nombre_equipo).first()
    #si existe el usuario mostrar error
    if team is not None:
        return jsonify({"message": "Equipo ya existe"}), 405
    jugadores= object_context["jugadores"]
    fecha_registro= object_context["fecha_registro"]
    logotipo= object_context["logotipo"]
    #crear nuevo evento a partir de esta data
    new_team = Teams()
    new_team.nombre_equipo = nombre_equipo
    new_team.jugadores = jugadores
    new_team.fecha_registro = fecha_registro
    new_team.logotipo = logotipo
    new_team.id_user = id_user
    db.session.add(new_team)
    db.session.commit()
    object_context["id"] = new_team.id
    return jsonify(object_context), 201

@api.route('/editteam', methods=['POST'])
@jwt_required()
def edit_team():
    #recibir datos del equipo
    id_user = get_jwt_identity()
    team = request.json
    object_context= team["teamData"]
    team_id = object_context["id"]
    nombre_equipo= object_context["nombre_equipo"]
    jugadores= object_context["jugadores"]
    fecha_registro= object_context["fecha_registro"]
    logotipo= object_context["logotipo"]
    #buscar equipo
    team = Teams.query.get(team_id)
    #si existe el nombre del equipo mostrar error
    team.nombre_equipo = nombre_equipo
    team.jugadores = jugadores
    team.fecha_registro = fecha_registro
    team.logotipo = logotipo
    team.id_user = id_user
    try:
        db.session.commit()
    except:
        return jsonify({"message": "Equipo ya existe"}), 405
    
    return jsonify(object_context), 201

@api.route('/deleteteam', methods=['POST'])
@jwt_required()
def delete_team():
    #recibir datos del equipo
    teamId = request.json.get("teamId")
    team = Teams.query.get(teamId)
    db.session.delete(team)
    db.session.commit()
    return jsonify({"message": "Delete successfull"}), 201

@api.route('/loaduserteams', methods=['GET'])
@jwt_required()
def load_user_teams():
    #recibir datos del cuerpo de la petición
    user = get_jwt_identity()
    #ubicar usuario en la bd, que me traiga todos los resultados
    lista = Teams.query.filter_by(id_user = user).all()
    #si no se encontró el evento
    if lista is None:
        return jsonify({"message": "Teams not found"}), 402
    response=[]
    for item in lista:
        response.append({
        "id": item.id,
        "nombre_equipo": item.nombre_equipo,
        "jugadores": item.jugadores,
        "fecha_registro": item.fecha_registro,
        "logotipo": item.logotipo,
        "id_user": item.id_user})
    #después de las validaciones enviar msje de confirmación
    #pasando contenido
    return jsonify({"teams":response}), 200

#api para nextEvent
@api.route('/loadallevents', methods=['GET'])
def load_allevents():
    #ubicar usuario en la bd, que me traiga todos los resultados
    #lista = Events.query.all()
    lista = Events.query.order_by(Events.fecha_ini.desc()).all()
    #si no se encontró el evento
    if lista is None:
        return jsonify({"message": "Events not found"}), 402
    response=[]
    for item in lista:
    #    response.append({item})
        response.append({
        "id": item.id,
        "nombre_evento": item.nombre_evento,
        "descr_corta": item.descr_corta,
        "fecha_ini": item.fecha_ini,
        "fecha_fin": item.fecha_fin,
        "ubicacion": item.ubicacion,
        "logotipo": item.logotipo,
        "descr_larga": item.descr_larga,
        "reglas": item.reglas,
        "fecha_lim": item.fecha_lim,
        "hora_lim": item.hora_lim,
        "email_contacto": item.email_contacto,
        "tel_contacto": item.tel_contacto,
        "nombre_contacto": item.nombre_contacto,
        "costo": item.costo,
        "id_user": item.id_user})
    #después de las validaciones enviar msje de confirmación
    #pasando contenido
    return jsonify({"eventos":response}), 200

@api.route('/loadAllUsers', methods=['GET'])
#@jwt_required()
def loadAllUser():
    #recibir datos del cuerpo de la petición
   # user = get_jwt_identity()
    #ubicar usuario en la bd, que me traiga todos los resultados
    lista = User.query.all()
    #si no se encontró el evento
    if lista is None:
        return jsonify({"message": "Users not found"}), 401
    response=[]
    for item in lista:
    #    response.append({item})
        response.append({
        "id": item.id,
        
        "name": item.name})
    #después de las validaciones enviar msje de confirmación
    #pasando contenido
    return jsonify({"Users":response}), 200

@api.route('/loadusereventsregister', methods=['GET'])
@jwt_required()
def load_usereventsregister():
    user = get_jwt_identity()
    lista_ev_pagados = Pagos.query.filter_by(id_user = user).first()
    #user = User.query.filter_by(email = email).first()
    #si el usuario no ha hecho pagos
    if lista_ev_pagados is None:
        return jsonify({"message": "No tienes eventos pagados"}), 404
 
    listaPagReg = RegistrosPagos.query.filter_by(id_user = user).all()
    if listaPagReg is None:
        return jsonify({"message": "No tienes eventos pagados"}), 404

    response=[]
    for PagReg in listaPagReg:
        if PagReg.cant_registrados < PagReg.cant_pagados:
            response.append({"id": PagReg.event_id, "nombre_evento": PagReg.events.nombre_evento})
 
    return jsonify({"eventos_disponibles":response}), 200

@api.route('/loadregisters', methods=['GET'])
@jwt_required()
def load_registers():
    user = get_jwt_identity()
    #lista = Registros.query.filter_by(id_user = user).order_by(Registros.fecha_ini.desc()).all()
    lista = Registros.query.filter_by(id_user = user).all()
    #si no se encontró el registro
    if lista is None:
        return jsonify({"message": "Sin registros"}), 404
    response=[]
    for registro in lista:
        response.append({
            "event_id": registro.event_id,
            "nombre_evento": registro.events.nombre_evento,
            "fecha_ini": registro.events.fecha_ini,
            "fecha_fin": registro.events.fecha_fin
        })
 
    return jsonify({"registros":response}), 200

@api.route('/newregister', methods=['POST'])
@jwt_required
def create_register():
    user = get_jwt_identity()
    idEquipo = request.json.get("idEquipo")
    idEvento = request.json.get("IdEvento")
    fechaRegistro = request.json.get("fechaActual")
    newRegister = Registros()
    newRegister.id_user = user
    newRegister.team_id = idEquipo
    newRegister.event_id = idEvento
    newRegister.fecha_reg = fechaRegistro
    db.session.add(newRegister)
    db.session.commit()

    registro = RegistrosPagos.query.filter_by(id_user = user, event_id = idEvento).first()
    if registro is not None:
        cant = registro.cant_registrados
        cant = cant + 1
        registro.cant_registrados = cant
        db.session.commit()

    return jsonify({"msg":"Registro realizado"}), 200

    #ACTUALIZARUSUARIOS
@api.route('/pagos_paypal', methods=['POST'])
@jwt_required()
def pagos_paypal():
    #obtener el jti del token que traemos en claims (get_jwt)
    user_id = get_jwt_identity()
    orderId = request.json.get("orderId")
    payerId = request.json.get("payerId")
    paymentId = request.json.get("paymentId")
    paymentSourceId = request.json.get(" paymentSourceId")
    #buscar usuario en la bd, que me traiga el primer resultado
    #registro de pago de paypal
    new_pago = Pagos_Paypal()
    new_pago.user_id=user_id
    new_pago.orderId=orderId
    new_pago.payerId=payerId
    new_pago.paymentSourceId=paymentSourceId
    new_pago.paymentId=paymentId
    new_pago.orderId=orderId
    #guardarlo en la bd
    db.session.add(new_pago)
    db.session.commit()
    return jsonify({"message":"Pago registrado"}), 201
