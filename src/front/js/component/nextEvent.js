import React, { useEffect, useContext, useState } from "react"
import '../../styles/nextEvent.css'
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";

const nextEvent = () => {

  const { store, actions } = useContext(Context);
  const navigate = useNavigate();

  useEffect(() => {
    actions.getAllEvents();
  }, []);

  return (
    <div className="contSuperior" style={{ minHeight: "400px" }}>
      <div style={{ textAlign: "center" }} className="col-12">
        <h1>Eventos</h1>
        <div className="divider divider-default m-3"></div>
      </div>
        <div className="container">
        <div className="table-responsive">
          <table className="table align-middle table-striped table-hover table-bordered">
          <thead className="table-primary">
            <tr>
              <th scope="col">Evento</th>
              <th scope="col">Fecha de Inicio</th>
              <th scope="col">Fecha de Terminación</th>
              <th scope="col">Ubicación</th>
              <th scope="col">Fecha y Hora Límite de Registro</th>
            </tr>
          </thead>
          <tbody style={{cursor: "pointer"}}>
            {store.allEvents.map((value, index) =>
              <tr onClick={()=>navigate("/registrarse/"+index)} key={index}>
                  <th scope="row">{value.nombre_evento}</th>
                  <td>{value.fecha_ini==""? "": new Date(value.fecha_ini+"T00:00:00").toLocaleDateString()}</td>
                  <td>{value.fecha_fin==""? "": new Date(value.fecha_fin+"T00:00:00").toLocaleDateString()}</td>
                  <td>{value.ubicacion}</td>
                  <td>{value.fecha_lim==""? "": new Date(value.fecha_lim+"T"+value.hora_lim+":00").toLocaleString()}</td>
              </tr>
            )}
            </tbody>
          </table>
        </div>
        </div>
    </div>

  );
}

export default nextEvent;
