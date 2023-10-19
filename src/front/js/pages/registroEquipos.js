import React, { useEffect, useContext, useState } from "react"
import '../../styles/nextEvent.css'
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import eventlist from "../../img/perfil/eventlist.jpg";

const RegistroEquipos = () => {

  const { store, actions } = useContext(Context);
  const navigate = useNavigate();
  const [eventos, setEventos] = useState([]);
  const [equipos, setEquipos] = useState([]);
  const [registros, setRegistros] = useState([]);
  const [selectedEventos, setSelectedEventos] = useState("");
  const [selectedEquipos, setSelectedEquipos] = useState("");
  const [exitoso, setExitoso] = useState(false);

  useEffect(() => {
    actions.getRegisters().then(respRegister => {
      if (respRegister == "Ok") {
        setRegistros([...store.registers])
      }
    });
    actions.getUserTeams().then(respTeams => {
      if (respTeams == "No token") {
        //alert("Sesión expirada");
        navigate("/cuenta");
      }
      if (respTeams == "Ok") {
        setEquipos([{ id: "-", nombre_equipo: "Elige un equipo" }, ...store.userTeam]);
      } else {
        setEquipos([{ id: "-", nombre_equipo: "No tienes equipos" }]);
      }
    });
    actions.getUserEventsRegister().then(respEventsReg => {
      if (respEventsReg == "No token") {
        //alert("Sesión expirada");
        navigate("/cuenta");
      }
      if (respEventsReg == "Ok" && store.userEventsRegister.length != 0) {
        setEventos([{ id: "-", nombre_evento: "Elige un evento" }, ...store.userEventsRegister]);
      } else {
        setEventos([{ id: "-", nombre_evento: "No tienes eventos pagados" }]);
      }
    });
    document.getElementById("spinner").style.display = "none";
  }, []);

  useEffect(() => {
    actions.getRegisters().then(respRegister => {
      if (respRegister == "Ok") {
        setRegistros([...store.registers])
      }
    });
    //Si se graba el registro hay que mostrar de nuevo los eventos
    //por si en alguno ya están completos los registros no mostrarlo
    actions.getUserEventsRegister().then(respEventsReg => {
      if (respEventsReg == "Ok" && store.userEventsRegister.length != 0) {
        setEventos([{ id: "-", nombre_equipo: "Elige un evento" }, ...store.userEventsRegister]);
      } else {
        setEventos([{ id: "-", nombre_evento: "No tienes eventos pagados" }]);
      }
    });
    setExitoso(false);
  }, [exitoso == true]);

  const handleChangeEventos = e => {
    console.log("Valor evento:", e.target.value);
    setSelectedEventos(e.target.value);
  };

  const handleChangeEquipos = e => {
    console.log(e.target.value);
    setSelectedEquipos(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log("evento:", selectedEventos, "equipo:", selectedEquipos);
    if (selectedEventos == "-" || selectedEquipos == "-" ||
      selectedEventos == "" || selectedEquipos == "" ||
      selectedEventos == "Elige un evento" || selectedEquipos == "Elige un equipo"
    ) {
      alert("Debes elegir Evento y Equipo")
    } else {
      let currentDate = new Date().toLocaleString();
      const { newRegister } = actions;
      let id_equipo = selectedEquipos;
      let id_evento = selectedEventos;
      console.log("id_equipo:", id_equipo, "id_evento", id_evento, " fecha:", currentDate);
      let resp = await newRegister(id_equipo, id_evento, currentDate);
      console.log("resultado registro:", resp)
      if (resp == "Ok") {
        alert("Registro exitoso");
        setExitoso(true);
        setSelectedEventos("Elige un evento");
        setSelectedEquipos("Elige un equipo");
        /*//Si se graba el registro hay que mostrar de nuevo los eventos
        //por si en alguno ya están completos los registros no mostrarlo
        actions.getUserEventsRegister().then(respEventsReg =>{
          if (respEventsReg=="Ok"){
            setEventos([{id: "-", nombre_evento: "Elige un evento"}, ...store.userEventsRegister]);
          } else {
            setEventos([{id: "-", nombre_evento: "No tienes eventos pagados"}]);
          }
        });*/
      }
    }
  }

  return (
    <div className="contSuperior" >
      <div className="">
        <div className="card mb-2">
          <div className="card-body d-flex flex-column flex-md-row justify-content-between align-items-center ">
            <div className="col-md-4 col-12 text-center">
              <img className="rounded" src={eventlist} style={{ maxWidth: '200px', maxHeight: '200px', border: "solid #0D6EFD" }}></img>
            </div>
            <div className="col-md-4 col-12">
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="text-center">
                    <h2>Registro de Equipos</h2>
                  </div>
                </div>
                <div className="form-row">
                  <label htmlFor="inputEvento">Evento</label>
                  <select id="inputEvento" className="form-control" name="eventoElegido" value={selectedEventos} onChange={handleChangeEventos} required>
                    {eventos.map(option => (
                      <option key={option.id} value={option.id}>{option.nombre_evento}</option>
                    ))}
                  </select>
                </div>
                <div className="form-row">
                  <label htmlFor="inputEquipo">Equipo</label>
                  <select id="inputEquipo" className="form-control" name="equipoElegido" value={selectedEquipos} onChange={handleChangeEquipos} required>
                    {equipos.map(option => (
                      <option key={option.id} value={option.id}>{option.nombre_equipo}</option>
                    ))}
                  </select>
                </div>
                <div className="form-row text-center mt-2">
                  <button type="submit" className="btn btn-primary">Registrar</button>
                </div>
              </form>
            </div>
            <div className="col-4 text-center">
              <div>
                <button className="btn btn-primary mx-3 m-3" onClick={() => navigate("/cuenta")} type="button">Volver a Perfil</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="text-center" id="spinner">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="text-primary">Cargando...</p>
        </div>
        <div className="table-responsive">
          <table className="table align-middle table-striped table-hover table-bordered">
            <thead className="table-primary">
              <tr>
                <th scope="col">Evento</th>
                <th scope="col">Fecha de Inicio</th>
                <th scope="col">Fecha de Terminación</th>
                <th scope="col">Equipo Registrado</th>
                <th scope="col">Fecha de Registro</th>
              </tr>
            </thead>
            <tbody>
              {registros.map((value, index) =>
                <tr key={index}>
                  <th scope="row">{value.nombre_evento}</th>
                  <td>{value.fecha_ini == "" ? "" : new Date(value.fecha_ini + "T00:00:00").toLocaleDateString()}</td>
                  <td>{value.fecha_fin == "" ? "" : new Date(value.fecha_fin + "T00:00:00").toLocaleDateString()}</td>
                  <td>{value.nombre_equipo}</td>
                  <td>{value.fecha_registro}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div >

  );
}

export default RegistroEquipos;
