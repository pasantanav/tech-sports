from flask_sqlalchemy import SQLAlchemy

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
    events = db.relationship('Events', backref='user', lazy=True)
    teams = db.relationship('Teams', backref='user', lazy=True)
    pagos = db.relationship('Pagos', backref='user', lazy=True)
    registros = db.relationship('Registros', backref='user', lazy=True)

    def __repr__(self):
        return f'<User {self.email}>'

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "name": self.name,
            "address": self.address,
            "phone": self.phone,
            "url_perfil": self.url_perfil
        }

teams_registros= db.Table("teams_registros",
                    db.Column("teams_id", db.Integer, db.ForeignKey("teams.id"), primary_key=True),
                    db.Column("registros_id", db.Integer, db.ForeignKey("registros.id"), primary_key=True)
                    )

events_registros= db.Table("events_registros",
                    db.Column("events_id", db.Integer, db.ForeignKey("events.id"), primary_key=True),
                    db.Column("registros_id", db.Integer, db.ForeignKey("registros.id"), primary_key=True)
                    )

events_pagos= db.Table("events_pagos",
                    db.Column("events_id", db.Integer, db.ForeignKey("events.id"), primary_key=True),
                    db.Column("pagos_id", db.Integer, db.ForeignKey("pagos.id"), primary_key=True)
                    )

class Events(db.Model):
    __tablename__ = "events"
    id = db.Column(db.Integer, primary_key=True)
    nombre_evento= db.Column(db.String(50), unique=False, nullable=False)
    descr_corta = db.Column(db.String(100), unique=False, nullable=False)
    fecha_ini = db.Column(db.String(50), unique=False, nullable=False)
    fecha_fin = db.Column(db.String(50), unique=False, nullable=False)
    ubicacion = db.Column(db.String(100), unique=False, nullable=False)
    logotipo = db.Column(db.String(150), unique=False, nullable=False)
    descr_larga = db.Column(db.String(250), unique=False, nullable=False)
    reglas = db.Column(db.String(150), unique=False, nullable=False)
    fecha_lim = db.Column(db.String(50), unique=False, nullable=False)
    hora_lim = db.Column(db.String(10), unique=False, nullable=False)
    email_contacto = db.Column(db.String(50), unique=False, nullable=False)
    tel_contacto = db.Column(db.String(15), unique=False, nullable=False)
    nombre_contacto = db.Column(db.String(150), unique=False, nullable=False)
    costo = db.Column(db.Float, unique=False, nullable=False)
    id_user = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    registros = db.relationship('Registros', secondary=events_registros, back_populates="events")
    pagos = db.relationship('Pagos', secondary=events_pagos, back_populates="events")

    def __repr__(self):
        return f'<Events {self.nombre_evento}>'

    def serialize(self):
        return {
            "Nombre_Evento": self.nombre_evento,
            "Fecha_ini": self.fecha_ini,
            "Fecha_fin": self.fecha_fin,
            "email_contacto": self.email_contacto,
            "costo": self.costo,
            "id_user": list(map(lambda x: x.serialize(), self.id_user)),
            "registros": list(map(lambda x: x.serialize(), self.registros)),
            "pagos": list(map(lambda x: x.serialize(), self.pagos))
        }

class Teams(db.Model):
    __tablename__ = "teams"
    id = db.Column(db.Integer, primary_key=True)
    nombre_equipo= db.Column(db.String(50), unique=True, nullable=False)
    jugadores = db.Column(db.String(100), unique=False, nullable=False)
    fecha_registro = db.Column(db.DateTime, unique=False, nullable=False)
    logotipo = db.Column(db.String(150), unique=False, nullable=False)
    id_user = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    registros = db.relationship('Registros', secondary=teams_registros, back_populates="teams")

    def __repr__(self):
        return f'<Teams {self.nombre_equipo}>'

    def serialize(self):
        return {
            "id": self.id,
            "nombre_equipo": self.nombre_equipo,
            "jugadores": self.jugadores,
            "fecha_registro": self.fecha_registro,
            "logotipo": self.logotipo,
            "id_user": list(map(lambda x: x.serialize(), self.id_user)),
            "registros": list(map(lambda x: x.serialize(), self.registros))
        }

class Pagos(db.Model):
    __tablename__ = "pagos"
    id = db.Column(db.Integer, primary_key=True)
    num_equipos= db.Column(db.Integer, unique=False, nullable=False)
    monto = db.Column(db.Float, unique=False, nullable=False)
    id_user = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    events = db.relationship("Events", secondary=events_pagos, back_populates="pagos")

    def __repr__(self):
        return f'<Pagos {self.cant_equipos}>'

    def serialize(self):
        return {
            "id": self.id,
            "num_equipos": self.num_equipos,
            "monto": self.monto,
            "id_user": list(map(lambda x: x.serialize(), self.id_user)),
            "events": list(map(lambda x: x.serialize(), self.events))
        }

class Registros(db.Model):
    __tablename__ = "registros"
    id = db.Column(db.Integer, primary_key=True)
    id_user = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    events = db.relationship("Events", secondary=events_registros, back_populates="registros")
    teams = db.relationship("Teams", secondary=teams_registros, back_populates="registros")

    def __repr__(self):
        return f'<Registros {self.id}>'

    def serialize(self):
        return {
            "id": self.id,
            "id_user": list(map(lambda x: x.serialize(), self.id_user)),
            "events": list(map(lambda x: x.serialize(), self.events)),
            "teams": list(map(lambda x: x.serialize(), self.teams))
        }

class TokenBlockedList(db.Model):
    __tablename__ = "tokenblockedlist"
    id = db.Column(db.Integer, primary_key=True)
    token = db.Column(db.String(1000), unique=True, nullable=False)
    created_at = db.Column(db.DateTime, nullable=False)
