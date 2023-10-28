from flask_sqlalchemy import SQLAlchemy
from sqlalchemyseeder import ResolvingSeeder

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = "user"
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), unique=False, nullable=False)
    is_active = db.Column(db.Boolean(), unique=False, nullable=False)
    name = db.Column(db.String(120), unique=False, nullable=False)
    address = db.Column(db.String(250), unique=False, nullable=True)
    phone = db.Column(db.String(20), unique=False, nullable=True)
    url_perfil = db.Column(db.String(150), unique= False, nullable=True)
    events = db.relationship('Events', back_populates='user', lazy=True)
    teams = db.relationship('Teams', back_populates='user', lazy=True)
    pagos = db.relationship('Pagos', back_populates='user', lazy=True)
    registros = db.relationship('Registros', back_populates='user', lazy=True)
    registrospagos = db.relationship('RegistrosPagos', back_populates='user', lazy=True)
    Paypal = db.relationship('Pagos_Paypal', backref='user', lazy=True)
    
    def __repr__(self):
        return f'<User {self.email}>'

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "name": self.name,
            "address": self.address,
            "phone": self.phone,
            "url_perfil": self.url_perfil,
            "events": list(map (lambda p: p.serialize(), self.events)),
            "teams": list(map (lambda p: p.serialize(), self.teams)),
            "pagos": list(map (lambda p: p.serialize(), self.pagos)),
            "registros": list(map (lambda p: p.serialize(), self.registros)),
            "registrospagos": list(map (lambda p: p.serialize(), self.registrospagos))
        }

class Events(db.Model):
    __tablename__ = "events"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nombre_evento= db.Column(db.String(50), unique=False, nullable=False)
    descr_corta = db.Column(db.String(150), unique=False, nullable=False)
    fecha_ini = db.Column(db.String(50), unique=False, nullable=False)
    fecha_fin = db.Column(db.String(50), unique=False, nullable=False)
    ubicacion = db.Column(db.String(100), unique=False, nullable=False)
    logotipo = db.Column(db.String(150), unique=False, nullable=False)
    descr_larga = db.Column(db.String(350), unique=False, nullable=False)
    reglas = db.Column(db.String(150), unique=False, nullable=False)
    fecha_lim = db.Column(db.String(50), unique=False, nullable=False)
    hora_lim = db.Column(db.String(10), unique=False, nullable=False)
    email_contacto = db.Column(db.String(50), unique=False, nullable=False)
    tel_contacto = db.Column(db.String(15), unique=False, nullable=False)
    nombre_contacto = db.Column(db.String(150), unique=False, nullable=False)
    costo = db.Column(db.Float, unique=False, nullable=False)
    id_user = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    user = db.relationship(User)
    pagos = db.relationship('Pagos', back_populates='events')
    registros = db.relationship('Registros', back_populates='events')
    registrospagos = db.relationship('RegistrosPagos', back_populates='events')

    def __repr__(self):
        return f'<Events {self.nombre_evento}>'

    def serialize(self):
        return {
            "Nombre_Evento": self.nombre_evento,
            "Descripcion_corta": self.descr_corta,
            "Fecha_ini": self.fecha_ini,
            "Fecha_fin": self.fecha_fin,
            "Ubicacion": self.ubicacion,
            "Logotipo": self.logotipo,
            "Descripcion_larga": self.descr_larga,
            "Reglas": self.reglas,
            "Fecha_lim": self.fecha_lim,
            "Hora_lim": self.hora_lim,
            "Email_contacto": self.email_contacto,
            "Tel_contacto": self.tel_contacto,
            "Nombre_contacto": self.nombre_contacto,
            "Costo": self.costo,
            "User_id": self.id_user,
            "Pagos": list(map(lambda x: x.serialize(), self.pagos)),
            "Registros": list(map(lambda x: x.serialize(), self.registros))
        }

class Teams(db.Model):
    __tablename__ = "teams"
    id = db.Column(db.Integer, primary_key=True)
    nombre_equipo= db.Column(db.String(50), unique=True, nullable=False)
    jugadores = db.Column(db.String(100), unique=False, nullable=False)
    fecha_registro = db.Column(db.DateTime, unique=False, nullable=False)
    logotipo = db.Column(db.String(150), unique=False, nullable=False)
    id_user = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    user = db.relationship(User)
    registros = db.relationship('Registros', back_populates='teams')

    def __repr__(self):
        return f'<Teams {self.nombre_equipo}>'

    def serialize(self):
        return {
            "id": self.id,
            "nombre_equipo": self.nombre_equipo,
            "jugadores": self.jugadores,
            "fecha_registro": self.fecha_registro,
            "logotipo": self.logotipo,
            "id_user": self.id_user,
            "user_email": self.user.email,
            "user_name": self.user.name,
            "registros": list(map(lambda x: x.serialize(), self.registros))
        }

class Pagos(db.Model):
    __tablename__ = "pagos"
    id = db.Column(db.Integer, primary_key=True)
    cant_equipos= db.Column(db.Integer, unique=False, nullable=False)
    monto = db.Column(db.Float, unique=False, nullable=False)
    orderId = db.Column(db.String(80), unique=False, nullable=False)
    payerId = db.Column(db.String(80), unique=False, nullable=False)
    paymentId = db.Column(db.String(80), unique=False, nullable=False)
    id_user = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    user = db.relationship(User)
    event_id = db.Column(db.Integer, db.ForeignKey('events.id'), nullable=False)
    events = db.relationship(Events)

    def __repr__(self):
        return f'<Pagos {self.cant_equipos}>'

    def serialize(self):
        return {
            "id": self.id,
            "cant_equipos": self.cant_equipos,
            "monto": self.monto,
            "orderId": self.orderId,
            "payerId": self.payerId,
            "paymentId": self.paymentId,
            "id_user": self.id_user,
            "nombre_evento": self.events.nombre,
            "fecha_ini" : self.events.fecha_ini,
            "fecha_fin" : self.events.fin
        }

class Registros(db.Model):
    __tablename__ = "registros"
    id = db.Column(db.Integer, primary_key=True)
    fecha_reg = db.Column(db.String(50), unique=False, nullable=False)
    id_user = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    user = db.relationship(User)
    event_id = db.Column(db.Integer, db.ForeignKey('events.id'), nullable=False)
    events = db.relationship(Events)
    team_id = db.Column(db.Integer, db.ForeignKey('teams.id'), nullable=False)
    teams = db.relationship(Teams)

    def __repr__(self):
        return f'<Registros {self.id}>'

    def serialize(self):
        return {
            "id": self.id,
            "fecha_reg": self.fecha_reg,
            "id_user": self.id_user,
            "event_id": self.event_id,
            "team_id": self.team_id,
        }

class RegistrosPagos(db.Model):
    __tablename__ = "registrospagos"
    id =db.Column(db.Integer, primary_key=True)
    cant_registrados = db.Column(db.Integer, unique=False, nullable=False)
    cant_pagados = db.Column(db.Integer, unique=False, nullable=False)
    id_user = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    user = db.relationship(User)
    event_id = db.Column(db.Integer, db.ForeignKey('events.id'), nullable=False)
    events = db.relationship(Events)

    def __repr__(self):
        return f'<ResgistrosPagos {self.id}>'
    
    def serialize(self):
        return {
            "id": self.id,
            "id_user": self.id_user,
            "event_id": self.event_id,
        }

class TokenBlockedList(db.Model):
    __tablename__ = "tokenblockedlist"
    id = db.Column(db.Integer, primary_key=True)
    token = db.Column(db.String(1000), unique=True, nullable=False)
    created_at = db.Column(db.DateTime, nullable=False)

class Pagos_Paypal(db.Model):
    __tablename__ = "pagos_paypal"
    id = db.Column(db.Integer, primary_key=True)
    id_user = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    orderId = db.Column(db.String(80), unique=False, nullable=False)
    payerId = db.Column(db.String(80), unique=False, nullable=False)
    paymentSourceId = db.Column(db.String(80), unique=False, nullable=False)
    paymentId = db.Column(db.String(80), unique=False, nullable=False)
    
    def __repr__(self):
        return f'<Pagos_Paypal {self.orderId}>'

    def serialize(self):
        return {
            "id":self.id,
            "orderId":self.orderId,
            "payerId":self.payerId,
            "paymentSourceId":self.paymentSourceId,
            "paymentId":self.paymentId,
            "id_user":list(map(lambda x: x.serialize(), self.id_user)),
            
        }
   
def seed():
  seeder = ResolvingSeeder(db.session)
  #modelos a llenar
  seeder.register(User)
  seeder.register(Events)
  seeder.register(Teams)
  seeder.register(Pagos)
  seeder.register(Registros)
  seeder.register(RegistrosPagos)
  seeder.load_entities_from_json_file("seedData.json")
  db.session.commit()