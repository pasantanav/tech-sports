import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext";
//import ModalTeam from "../component/modalteams";
import { Link, useNavigate } from "react-router-dom";

const TeamLista = () => {

    const { store, actions } = useContext(Context)
    const navigate = useNavigate();

    useEffect(()=>{
        if (!store.accessToken) {
            navigate("/");
          }
      }, [store.accessToken]);

    const [operation, setOperation] = useState("Equipo Nuevo");
    const [indice, setIndice] = useState(null);
    const [idEquipo, setIdEquipo] = useState(0);
    const [teamToDelete, setTeamToDelete] = useState(null);
    const [teamIdDelete, setTeamIdDelete] = useState(null);

    useEffect(()=>{
        actions.getUserTeams()
        setOperation("Equipo Nuevo");
      }, []);

    const handleEdit = (e, index, id_equipo) => {
        //setSelectedTeam(teamData.find(t => t.id == e.target.id))
        setOperation("Editar Equipo");
        setIndice(index);
        setIdEquipo(id_equipo);
    }

    const deleteEquipo = (id, nombre, index) => {
        /*const newTodos = todoArray.filter(todo => todo.id == id)
        setTodoArrays(newTodos)*/
        setTeamIdDelete(id);
        setTeamToDelete(nombre);
        setIndice(index);
    }
    const createEquipo = () => {
        setOperation("Equipo Nuevo");
        setIndice("n");
        setTeamFormData({
            nombre_equipo: "",
            jugadores: "",
            //fecha_registro: fechaActual,
            fecha_registro: "",
            logotipo: "",
            id_user: "",
            id: ""
          })
    }
    const handleChange = (e, propertyName) => {
        /*const currentTeam = Object.assign({}, selectedTeam);
        currentTeam[propertyName] = e.target.value;
        setSelectedTeam(currentTeam)*/
    }
    /////////////////////////////////////////////////////////////////7
    const [editar, setEditar] = useState(false);
    const [fechaActual, setFechaActual] = useState("");
    const formulario = document.getElementById("formTeam");
    const [teamFormData, setTeamFormData] = useState(operation=="Equipo Nuevo"? {
      nombre_equipo: "",
      jugadores: "",
      //fecha_registro: fechaActual,
      fecha_registro: "",
      logotipo: "",
      id_user: "",
      id: ""
    }:store.userTeam[indice]);
      

      useEffect(()=>{
        console.log("ESTA ES LA OPERACION:", operation);
        if (operation=="Editar Equipo"){
          setTeamFormData(store.userTeam[indice]);
          console.log(teamFormData.fecha_registro);
        } else {
          let teamData = {...teamFormData};
          let currentDate = new Date();
          for (let value in teamData){
            teamData[value] = "";
            if (value == "fecha_registro"){
              //teamData[value] = currentDate.toString();
              teamData[value] = currentDate;
              console.log("LA FECHA ACTUAL ES:", currentDate);
            }
          }
          setTeamFormData(teamData);
          setFechaActual(currentDate);
        }
      }, [indice]);

      useEffect(()=>{
        limpiarDataEquipo();
      }, []);

    const handleTeamChange = (e) => {
      //console.log("TARGET", e.target);
      const { name, value } = e.target;
      setTeamFormData({
        ...teamFormData,
        [name]: value,
      });
      setEditar(true);
    };

    const limpiarDataEquipo = () => {
        setTeamFormData({
            id: "",
            nombre_equipo: "",
            jugadores: "",
            fecha_registro: fechaActual,
            logotipo: "",
            id_user: ""});
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData(e.target);
        const nombre_equipo=data.get("nombre_equipo")
        if (operation=="Editar Equipo" && editar==false){
          console.log("no es necesario editar");
          alert("Equipo actualizado");
          formulario.reset();
          } else if (nombre_equipo.length <3) {
            alert("El nombre debe tener al menos 2 caracteres")
          } else {
              let resp ="";
              let oper ="";
              if (operation=="Equipo Nuevo"){
                const {newTeam} = actions;
                console.log("Equipo a registrar:", teamFormData);
                resp = await newTeam(teamFormData);
                oper = "creado";
              } else {
                //Si estamos editando el equipo
                const {editTeam} = actions;
                resp = await editTeam(teamFormData, indice);
                oper = "actualizado";
              }
              console.log({resp})
              console.log(resp.code)
              if (resp=="Ok"){
                alert("Equipo " + oper + " exitosamente");
                limpiarDataEquipo();
              } else {
                if (resp.code == 402)
                    alert("Equipo ya existe");
                else
                    alert("Error al registrar Equipo");
              }
              formulario.reset();
              //window.location.reload(false)
            }
      };
      ////////////////////////////////////////////////////
    return (
        <div className="contSuperior fatherBody" style={{minHeight:"500px"}}>
            <div className="row text-center mb-3">
                <div className="d-grid gap-2 d-md-flex justify-content-md-center">
                    <Link to="/cuenta">
                        <button className="btn btn-primary me-md-2" type="button">Volver a Perfil</button>
                    </Link>
                    <button className="btn btn-primary" onClick={() => createEquipo()} data-bs-toggle="modal" data-bs-target="#staticBackdrop" type="button">Crear Equipo</button>
                </div>
            </div>
            <table className="table align-middle mb-0 bg-white" id='theTeamstable'>
                <thead className="bg-light">
                    <tr>
                        <th>Nombre del Equipo</th>
                        <th>Jugadores</th>
                        <th>logotipo</th>
                        <th>Fecha de Registro</th>
                    </tr>
                </thead>
                <tbody>
                    {store.userTeam.map((theTeam, index) => (
                        <tr key={theTeam.id}>
                            <td>
                                <div className="d-flex align-items-center">
                                    <img
                                        src={`https://mdbootstrap.com/img/new/avatars/${theTeam.id}.jpg`}
                                        alt=""
                                        style={{ width: '45px', height: '45px' }}
                                        className="rounded-circle"
                                    />
                                    <div className="ms-3">
                                        <p className="fw-bold mb-1"></p>
                                        <p className="text-muted mb-0">{theTeam.nombre_equipo}</p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <p className="fw-normal mb-1">{theTeam.jugadores}</p>
                            </td>
                            <td>{theTeam.fecha_registro}</td>
                            <td>{theTeam.logotipo}</td>
                                <td>
                                    <div className="row">
                                        <div className="col-4">
                                            <button id={theTeam.id} onClick={(e) => handleEdit(e, index, theTeam.id)} className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                                                Editar
                                            </button>
                                        </div>
                                        <div className="col-4">
                                            <button className="btn btn-primary" onClick={() => deleteEquipo(theTeam.id, theTeam.nombre_equipo, index)} data-bs-toggle="modal" data-bs-target="#staticBackdrop1">
                                                Eliminar
                                            </button>
                                        </div>
                                        <div className="col-4">
                                            <button className="btn btn-primary">
                                                Jugadores
                                            </button>
                                        </div>
                                    </div>
                                </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            
           <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="staticBackdropLabel">{operation}</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            {/*<ModalTeam operacion={operation} indice={indice} idEquipo={idEquipo}/>*/}

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
                                            <button type="submit" className="btn btn-primary btn-block mx-4 mb-4" data-bs-dismiss={operation=="Editar Equipo"? "modal":""}>
                                            Guardar
                                            </button>
                                            <button type="button" className="btn btn-secondary btn-block mb-4" data-bs-dismiss="modal">Cancelar</button>
                                        </div>
                                </form>
                            </div>

                        </div>
                        <div className="modal-footer">
                            {/*<button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                            <button type="button" className="btn btn-primary">Guardar</button>*/}
                        </div>
                    </div>
                </div>
            </div>

            <div className="modal fade" id="staticBackdrop1" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdrop1Label" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="staticBackdrop1Label">Eliminar Equipo</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            ¿Estás seguro que quieres eliminar el equipo {teamToDelete}?
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                            <button type="button" className="btn btn-primary" onClick={() => actions.deleteTeam(teamIdDelete, indice)} data-bs-dismiss="modal">Eliminar</button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default TeamLista;


