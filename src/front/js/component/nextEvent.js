import React, { useEffect, useContext, useState } from "react"
import '../../styles/nextEvent.css'
import { Context } from "../store/appContext";
const nextEvent = () => {
  const [events, setEvents] = useState([])
  const { store, actions } = useContext(Context);
  const getEvent = async () => {
    if (store.allEvents.length === 0) {
      const { getAllEvents } = actions;
      await getAllEvents();
      setEvents(store.allEvents)
    }
  }
  useEffect(() => {

    getEvent();

  }, [events])
  console.log("ndfnsvnjsfvjdfvfv", store)
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
                <h3><b>Evento</b></h3>
              </div>
              <div className="col">
                <h3>Fecha de inicio</h3>
              </div>
              <div className="col">
                <h3>Fecha final</h3>
              </div>
              <div className="col">
                <h3>Ubicación</h3>
              </div>
              <div className="col">
                <h3>Fecha Limite</h3>
              </div>
            </div>
            {console.log("probando", events)}
            {events.map((value, index) =>
              <div className="row">
                <div className="col">
                  <p id="eventTitle"><a href="registrarse">{value.nombre_evento}</a></p>
                </div>
                <div className="col">
                  <p>{value.fecha_ini}</p>
                </div>
                <div className="col">
                  <p>{value.fecha_fin}</p>
                </div>
                <div className="col">
                  <p>{value.ubicacion}</p>
                </div>
                <div className="col">
                  <p>{value.fecha_lim}</p>
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
