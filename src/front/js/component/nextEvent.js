import React, { useEffect, useContext, useState } from "react"
import '../../styles/nextEvent.css'
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";
import Registrarse from "./registrarse";

const nextEvent = () => {

  const { store, actions } = useContext(Context);

  useEffect(() => {
    actions.getAllEvents();
  }, []);

  return (
    <div className="contSuperior" style={{ minHeight: "400px" }}>
      <div style={{ textAlign: "center" }} className="col-12">
        <h1>Eventos</h1>
        <div className="divider divider-default m-3"></div>
      </div>
      <div id="header" className="card">
        <div className="card-body">
          <div className="row">
            <div className="row">
              <div className="col">
                <h4><b>Evento</b></h4>
              </div>
              <div className="col">
                <h4>Fecha de inicio</h4>
              </div>
              <div className="col">
                <h4>Fecha final</h4>
              </div>
              <div className="col">
                <h4>Ubicación</h4>
              </div>
              <div className="col">
                <h4>Fecha y Hora Límite</h4>
              </div>
            </div>
            {store.allEvents.map((value, index) =>
              <div className="row" key={index}>
                <div className="col">
                  <Link to={"/registrarse/"+index}>
                    <p id="eventTitle" style={{color: "blue"}}>{value.nombre_evento}</p>
                  </Link>
                </div>
                <div className="col">
                  <p>{value.fecha_ini==""? "": new Date(value.fecha_ini+"T00:00:00").toLocaleDateString()}</p>
                </div>
                <div className="col">
                  <p>{value.fecha_fin==""? "": new Date(value.fecha_fin+"T00:00:00").toLocaleDateString()}</p>
                </div>
                <div className="col">
                  <p>{value.ubicacion}</p>
                </div>
                <div className="col">
                  <p>{value.fecha_lim==""? "": new Date(value.fecha_lim+"T"+value.hora_lim+":00").toLocaleString()}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>

  );
}

export default nextEvent;
