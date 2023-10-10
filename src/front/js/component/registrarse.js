import React, { useContext, useState, useEffect } from "react";
import "../../styles/registrarse.css";
import basket from "../../img/basket7.jpeg";
import PayPal from "./paypal";
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Context } from "../store/appContext";

const Registrarse = (props) => {
  const [contador, setContador] = useState(1);
  const [total, setTotal] = useState(75);

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
  const aumentar = () => {
    let temContador = contador + 1;
    const total = parseInt(datosEvento.costo);
    setTotal(temContador * total);
    setContador(temContador);
    console.log(contador);
  };
  const disminuir = () => {
    let temContador = contador - 1;
    const total = parseInt(datosEvento.costo);
    if (temContador < 0) {
      return;
    }
    setTotal(temContador * total);
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
      
      <div className="card mb-4">
        <div className="card-header" style={{ backgroundColor: "#0D6EFD", color: "white" }}>
          Información del Evento
        </div>
        <div className="card-body">
        </div>
      </div>
      <div id="teamRegister" className="col-lg-6 col-md-8 col-sm-12">
        <div id="registerTable" className="container">
        </div>
      </div>
      <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      </div>
    </div>
  );
}

export default Registrarse;
