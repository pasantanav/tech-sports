import React, { useContext, useState, useEffect } from "react";
import '../../styles/accountpage.css'
import "../../styles/eventoLista.css";
import { Context } from "../store/appContext";
import ModalEvent from "../component/modalevent";
import tournament from "../../img/perfil/tournament.jpg";
import imgFondo from "../../img/perfil/fondok.png";
import { Link, useNavigate } from "react-router-dom";
const EventoLista = () => {

    const { store, actions } = useContext(Context)
    const navigate = useNavigate();

    useEffect(()=>{
        if (!store.accessToken) {
            alert("Sesión expirada");
            navigate("/cuenta");
          }
      }, [store.accessToken]);

    const [selectedEvent, setSelectedEvent] = useState(0);
    const [operation, setOperation] = useState("Evento Nuevo");
    const [indice, setIndice] = useState(null);
    const [idEvento, setIdEvento] = useState(0);
    const [eventToDelete, setEventToDelete] = useState(null);
    const [eventIdDelete, setEventIdDelete] = useState(null);

    useEffect(()=>{
        actions.getUserEvent()
        document.getElementById("spinner").style.display = "none";
        setOperation("Evento Nuevo");
      }, []);

    const handleEdit = (e, index, id_evento) => {
        //setSelectedEvent(eventData.find(t => t.id == e.target.id))
        setOperation("Editar Evento");
        setIndice(index);
        setIdEvento(id_evento);
    }

    const deleteEvento = (id, nombre, index) => {
        /*const newTodos = todoArray.filter(todo => todo.id == id)
        setTodoArrays(newTodos)*/
        setEventIdDelete(id);
        setEventToDelete(nombre);
        setIndice(index);
    }
    const createEvento = () => {
        setOperation("Evento Nuevo");
        setIndice("n");
    }

    return (
        <div className="contSuperior h-100 fatherBody " style={{ minHeight: "400px", paddingBottom:"1%"}}>
            <div className="container">
                <div className="card mb-4">
                    <img className="card-img img-fluid mw-100 object-fit-fill" style={{width: "100%", height: "10rem"}} src={imgFondo} alt="Card image"/>
                    <div className="card-img-overlay">
                        <div className="card-body d-flex justify-content-between align-items-center">
                            <div className="col-4 text-center">
                                <img className="rounded" src={tournament} style={{ maxWidth: '150px', maxHeight: '150px', border: "solid #0D6EFD" }}></img>
                            </div>
                            <div className="col-4 text-center text-white">
                                <h2 className="black-text-shadow">Lista de Eventos</h2>
                                </div>
                            <div className="col-4">
                                <Link to="/cuenta">
                                    <button className="btn btn-primary mx-3 mt-3 m-3" type="button">Volver a Perfil</button>
                                </Link>
                                <button className="btn btn-primary" onClick={() => createEvento()} data-bs-toggle="modal" data-bs-target="#staticBackdrop" type="button">Crear Evento</button>
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
            <div className="table-responsive"  style={{
        height: '500px',
        overflowX: 'auto',
        overflowY: 'auto',
      }}>
            <table className="table align-middle mb-0 bg-white" id='theEventstable'>
                <thead className="bg-light">
                    <tr>
                        <th>Nombre del Evento</th>
                        <th>Dirección</th>
                        <th>Fecha de Inicio</th>
                        <th>Fecha de Término</th>
                        <th>Fecha límite</th>
                        <th>Costo</th>
                        <th>Opciones</th>
                    </tr>
                </thead>
                <tbody>
                    {store.userEvent.map((theEvent, index) => (
                        <tr key={theEvent.id}>
                            <td>
                                <div className="d-flex align-items-center">
                                    <img
                                        src={theEvent.logotipo}
                                        alt=""
                                        style={{ width: '45px', height: '45px' }}
                                        className="rounded-circle"
                                    />
                                    <div className="ms-3">
                                        <p className="fw-bold mb-1"></p>
                                        <p className="text-muted mb-0">{theEvent.nombre_evento}</p>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <p className="fw-normal mb-1">{theEvent.ubicacion}</p>
                            </td>
                            <td>{theEvent.fecha_ini==""? "": new Date(theEvent.fecha_ini+"T00:00:00").toLocaleDateString()}</td>
                            <td>{theEvent.fecha_fin==""? "": new Date(theEvent.fecha_fin+"T00:00:00").toLocaleDateString()}</td>
                            <td>{theEvent.fecha_lim==""? "": new Date(theEvent.fecha_lim+"T"+theEvent.hora_lim+":00").toLocaleString()}</td>
                            <td>{"$"+theEvent.costo}</td>
                            <td>
                                <button id={theEvent.id} onClick={(e) => handleEdit(e, index, theEvent.id)} className="btn btn-outline-primary m-1 btn-sm" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                                    <i className="fa-solid fa-pen-to-square"></i>
                                </button>
                                <Link to={theEvent.reglas} target="_blank">
                                    <button className="btn btn-outline-primary btn-sm">
                                        <strong>Reglas</strong>
                                    </button>
                                </Link>
                                <button className="btn btn-outline-secondary m-1 btn-sm" onClick={() => deleteEvento(theEvent.id, theEvent.nombre_evento, index)} data-bs-toggle="modal" data-bs-target="#staticBackdrop1">
                                    <i className="fa-solid fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>
            </div>
           <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="staticBackdropLabel">{operation}</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <ModalEvent operacion={operation} indice={indice} idEvent={idEvento}/>
                        </div>
                        <div className="modal-footer">
                        </div>
                    </div>
                </div>
            </div>

            <div className="modal fade" id="staticBackdrop1" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdrop1Label" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="staticBackdrop1Label">Eliminar Evento</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            ¿Estás seguro que quieres eliminar el evento {eventToDelete}?
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                            <button type="button" className="btn btn-primary" onClick={() => actions.deleteEvent(eventIdDelete, indice)} data-bs-dismiss="modal">Eliminar</button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default EventoLista;


