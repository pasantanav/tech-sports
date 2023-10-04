import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext";

const ModalTeams = (props) => {

    const { store, actions } = useContext(Context);
    const [editar, setEditar] = useState(false);
    const [fechaActual, setFechaActual] = useState("");
    const formulario = document.getElementById("formTeam");
    const [teamFormData, setTeamFormData] = useState(props.operacion=="Equipo Nuevo"? {
      id: "",
      nombre_equipo: "",
      jugadores: "",
      fecha_registro: fechaActual,
      logotipo: "",
      id_user: ""
    }:store.userTeam[props.indice]);
      

      useEffect(()=>{
        console.log("ESTA ES LA OPERACION:", props.operacion);
        if (props.operacion=="Editar Equipo"){
          setTeamFormData(store.userTeam[props.indice]);
          console.log(teamFormData.fecha_registro);
        } else {
          let teamData = {...teamFormData};
          let currentDate = new Date();
          for (let value in teamData){
            teamData[value] = "";
            if (value == "fecha_registro"){
              teamData[value] = currentDate.toString;
              console.log("LA FECHA ACTUAL ES:", currentDate);
            }
          }
          setTeamFormData(teamData);
          setFechaActual(currentDate);
        }
      }, [props.indice]);

      useEffect(()=>{
        setTeamFormData({
        id: "",
        nombre_equipo: "",
        jugadores: "",
        fecha_registro: fechaActual,
        logotipo: "",
        id_user: ""})
      }, []);

    const handleTeamChange = (e) => {
      console.log("TARGET", e.target);
      const { name, value } = e.target;
      setTeamFormData({
        ...teamFormData,
        [name]: value,
      });
      setEditar(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        const nombre_equipo=data.get("nombre_equipo")
        if (props.operacion=="Editar Equipo" && !editar){
          console.log("no es necesario editar");
          alert("Equipo actualizado");
          formulario.reset();
          } else if (nombre_equipo.length <3) {
            alert("El nombre debe tener al menos 2 caracteres")
          } else {
              let resp ="";
              let oper ="";
              if (props.operacion=="Equipo Nuevo"){
                const {newTeam} = actions;
                resp = await newTeam(teamFormData);
                oper = "creado";
              } else {
                //Si estamos editando el equipo
                const {editTeam} = actions;
                resp = await editTeam(teamFormData, props.indice);
                oper = "actualizado";
              }
              console.log({resp})
              console.log(resp.code)
              if (resp=="Ok"){
                alert("Equipo " + oper + " exitosamente");
                formulario.reset();
              } else {
                alert("Error al registrar Equipo")
              }
              formulario.reset();
              //window.location.reload(false)
            }
      };

    return(
        <div className="row">
            <form onSubmit={handleSubmit} id="formTeam">
                      <div className="form-outline mb-4">
                        <label className="form-label" htmlFor="nombre_equipo">
                          Nombre del Equipo
                        </label>
                        <div className="form-outline mb-4">
                          <input
                            type="text"
                            id="nombre_equipo"
                            name="nombre_equipo"
                            maxLength="50"
                            value={teamFormData.nombre_equipo}
                            className="form-control white-background-input"
                            onChange={handleTeamChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="form-outline mb-4">
                        <label className="form-label" htmlFor="jugadores">
                          Jugadores
                        </label>
                        <div className="form-outline mb-4">
                        <input
                            type="text"
                            id="jugadores"
                            name="jugadores"
                            value={teamFormData.jugadores}
                            maxLength="100"
                            className="form-control white-background-input"
                            onChange={handleTeamChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="form-outline mb-4">
                        <label className="form-label" htmlFor="logotipo">
                          Logotipo
                        </label>
                        <div className="form-outline mb-4">
                          <input
                            type="text"
                            id="logotipo"
                            name="logotipo"
                            value={teamFormData.logotipo}
                            maxLength="150"
                            className="form-control white-background-input"
                            onChange={handleTeamChange}
                            required
                          />
                        </div>
                      </div>
                      <div className='text-center'>
                        <button type="submit" className="btn btn-primary btn-block mx-4 mb-4" data-bs-dismiss={props.operacion=="Editar Equipo"? "modal":""}>
                          Guardar
                        </button>
                        <button type="button" className="btn btn-secondary btn-block mb-4" data-bs-dismiss="modal">Cancelar</button>
                      </div>
              </form>
        </div>
);
}

export default ModalTeams;