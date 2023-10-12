import React, { useContext, useState, useEffect } from "react";
import "../../styles/registrarse.css";
import basket from "../../img/basket7.jpeg";
import PayPal from "./paypal";
import { Link, useNavigate, useParams } from 'react-router-dom';

import { Context } from "../store/appContext";

const Registrarse = (props) => {
  const [contador, setContador] = useState(1);
  const [total, setTotal] = useState(0);

  const { store, actions } = useContext(Context);
  const navigate = useNavigate();
  const [abierto, setAbierto] = useState(null);
  const [datosEvento, setDatosEvento] = useState("");
  const [labelBtnRegistro, setBtnRegistro] = useState("");
  const params = useParams();

  useEffect(() => {
    actions.getAllEvents();
    console.log("Parámetro:", params.index);
    if (params.index) {
      const dataEvent = { ...store.allEvents[params.index] };
      setTotal(dataEvent.costo);
      setDatosEvento(dataEvent);
      setAbierto(false);
      let fechahoy = new Date();
      console.log("fecha de hoy:", fechahoy);
      fechahoy = fechahoy.getTime();
      let fechalimite = dataEvent.fecha_lim + "T" + dataEvent.hora_lim + ":00";
      fechalimite = new Date(fechalimite);
      console.log("fecha limite:", fechalimite);
      fechalimite = fechalimite.getTime();
      console.log("hoy es:", fechahoy, "la fecha limite es:", fechalimite);
      // si la fecha actual es mayor a la fecha límite
      setAbierto(false);
      if (fechahoy <= fechalimite) {
        console.log("Si es menor");
        setAbierto(true);
      }
    }
  }, [params.index]);

  useEffect(() => {
    if (abierto === true) {
      setBtnRegistro("Registrar Equipos");
    } else {
      setBtnRegistro("Evento Cerrado");
    }
  }, [abierto]);

  // Funciones del botón Sumar y Restar
  const aumentar = () => {
    let temContador = contador + 1;
    const subTotal = parseInt(datosEvento.costo);
    setTotal(temContador * subTotal);
    actions.setCurrentPaypal(temContador * subTotal)
    setContador(temContador);
    console.log(contador);
  };

  const disminuir = () => {
    let temContador = contador - 1;
    const subTotal = parseInt(datosEvento.costo);
    if (temContador < 0) {
      return;
    }
    setTotal(temContador * subTotal);
    actions.setCurrentPaypal(temContador * subTotal)
    setContador(temContador);
  };

  const handleClick = (e) => {
    e.preventDefault();
    if (store.accessToken == null) {
      alert("Para registrar equipos debes iniciar sesión");
      navigate("/cuenta");
    }
  };

  return (
    <div className="contSuperior container">
      <div className="row">
        <h1 className="fw-bolder mb-1 text-uppercase">{datosEvento.nombre_evento}</h1>
        <div className="text-muted fst-italic mb-2">Creado por {datosEvento.nombre_contacto}</div>
      </div>
      <div className="row">
        <div>
          <button
            type="button"
            onClick={handleClick}
            className={abierto === true ? "btn btn-primary btn-md my-1" : "btn btn-danger disabled my-1"}
            data-bs-dismiss={store.accessToken == null ? "modal" : ""}
            data-bs-toggle={store.accessToken == null ? "" : "modal"}
            data-bs-target="#exampleModal">
            {labelBtnRegistro}
          </button>
          <Link to="/nextEvent">
            <button id="button-event" type="button" className="btn btn-primary mx-3">
              Ver otros Eventos
            </button>
          </Link>
        </div>
      </div>
      <div className="row">
        <div className="col-lg-8">
          <article>
            <header className="mb-4">
              <section className="mb-4">
                <p className="fs-5 my-2">{datosEvento.descr_corta}</p>
              </section>
            </header>
            <figure className="mb-4">
              <img className="img-fluid rounded" style={{ maxWidth: "500px" }} src={basket} alt="..." />
            </figure>
            <section className="mb-3">
              <p className="fs-5 mb-4">{datosEvento.descr_larga}</p>
            </section>
          </article>
        </div>
        <div className="col-lg-4">
          <div className="card mb-4">
            <div className="card-header" style={{ backgroundColor: "#0D6EFD", color: "white" }}>
              Información del Evento
            </div>
            <div className="card-body">
              <div className="flex-row">
                <div className="flex-col">
                  <span className="fas fa-map-marker-alt" style={{ color: "#0D6EFD" }}></span>
                  <span className="txt m-2"><strong>Dirección</strong></span>
                </div>
                <div className="flex-col">
                  <span className="txt ml-3">{datosEvento.ubicacion}</span>
                </div>
              </div>
              <div className="flex-row my-1">
                <div className="flex-col">
                  <span className="fa-solid fa-calendar" style={{ color: "#0D6EFD" }}></span>
                  <span className="txt m-2"><strong>Fecha de inicio</strong></span>
                </div>
                <div className="flex-col">
                  <span className="txt ml-3">
                    {datosEvento.fecha_ini == "" ? "" : new Date(datosEvento.fecha_ini + "T00:00:00").toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="flex-row">
                <div className="flex-col">
                  <span className="fa-solid fa-calendar" style={{ color: "#0D6EFD" }}></span>
                  <span className="txt m-2"><strong>Fecha de terminación</strong></span>
                </div>
                <div className="flex-col">
                  <span className="txt ml-3">
                    {datosEvento.fecha_fin == "" ? "" : new Date(datosEvento.fecha_fin + "T00:00:00").toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="flex-row">
                <div className="flex-col">
                  <span className="fa-solid fa-calendar" style={{ color: "red" }}></span>
                  <span className="txt m-2"><strong>Fecha y hora límite de registro</strong></span>
                </div>
                <div className="flex-col">
                  <span className="txt ml-3">
                    {datosEvento.fecha_lim == "" ? "" : new Date(datosEvento.fecha_lim + "T" + datosEvento.hora_lim + ":00").toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="flex-row">
              </div>
              <div>
                <Link to={datosEvento.reglas} target="_blank">
                  <button className="btn btn-outline-primary">Ver el reglamento del evento</button>
                </Link>
              </div>
            </div>
          </div>
        </div>  
        <div className="contact-containerr">
        <div className="col-lg-4 contactt" >
          <div className="card mb-4">
            <div className="card-header" style={{ backgroundColor: "#0D6EFD", color: "white" }}>
             Contacto
            </div> 
            <div className="card-body">
              <div className="flex-row">
                <div className="flex-col">
                  <span className="fas fa-map-marker-alt" style={{ color: "#0D6EFD" }}></span>
                  <span className="txt m-2"><strong>Email</strong></span>
                </div>
                <div className="flex-col">
                  <span className="txt ml-3">{datosEvento.email_contacto}</span>
                </div>
              </div>
              <div className="flex-row">
                <div className="flex-col">
                  <span className="fa-solid fa-phone" style={{ color: "#0D6EFD" }}></span>
                  <span className="txt m-2"><strong>Teléfono</strong></span>
                </div>
                <div className="flex-col">
                  <span className="txt ml-3">{datosEvento.tel_contacto}</span>
                </div>
              </div>
            </div>
          </div>
        </div>  
          </div>  
      </div>      
      <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">Modal title</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className="modal-body">
                <div className="container">
                  <div className="row">
                    <div className="col-md-12">
                      <h3>Cantidad de equipos a registrar</h3>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-3">
                      <b><h5>Evento</h5></b>
                    </div>
                    <div className="col-md-3">
                      <b><h5>Costo</h5></b>
                    </div>
                    <div className="col-md-3">
                      <b><h5>Cant.</h5></b>
                    </div>
                    <div className="col-md-3">
                      <b><h5>Total</h5></b>
                    </div>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-md-3">
                      <p>Jam on it</p>
                    </div>
                    <div className="col-md-3">
                      <p>${datosEvento.costo}</p>
                    </div>
                    <div className="col-md-3">
                      <button className="button" id="disminuir" onClick={disminuir}>-</button>
                      <span><button id="cantidad" value="0">{contador}</button></span>
                      <button className="button" id="aumentar" onClick={aumentar}>+</button>
                    </div>
                    <div className="col-md-3">
                      <p>${total}</p>
                    </div>
                  </div>
                  <hr />
                  <div className="row">
                    <div className="col-md-3"></div>
                    <div className="col-md-3"></div>
                    <div className="col-md-3">
                      <b><h4>Total</h4></b>
                    </div>
                    <div className="col-md-3">
                      <b><h4>${total}</h4></b>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-3"></div>
                    <div className="col-md-3"></div>
                    <div className="col-md-3"></div>
                    <div className="col-md-3">
                    </div>
                  </div>
                </div>
              </div>
              
              <PayPal index={params.index} costo={total} />
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" className="btn btn-primary">Save changes</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Registrarse;


  