import React, { useContext, useState, useEffect } from "react";
import '../../styles/accountpage.css'
import "../../styles/eventList.css";
import { Context } from "../store/appContext";
import ModalEvent from "../component/modalevent";
import tournament from "../../img/perfil/tournament.jpg";
import { Link, useNavigate } from "react-router-dom";
const EventoLista = () => {

    const { store, actions } = useContext(Context)
    const navigate = useNavigate();

    useEffect(()=>{
        if (!store.accessToken) {
            navigate("/");
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
        <div className="contSuperior fatherBody" style={{minHeight:"500px"}}>
            <div className="container">
                <div className="card mb-4">
                    <div className="card-body d-flex justify-content-between align-items-center">
                        <div className="col-2 text-center">
                            <img className="rounded" src={tournament} style={{ maxWidth: '100px', maxHeight: '100px', border: "solid #0D6EFD" }}></img>
                        </div>
                        <div className="col-6 text-center">
                            <h2>Lista de Eventos</h2>
                            </div>
                        <div className="col-4">
                            <Link to="/cuenta">
                                <button className="btn btn-primary mx-3" type="button">Volver a Perfil</button>
                            </Link>
                            <button className="btn btn-primary" onClick={() => createEvento()} data-bs-toggle="modal" data-bs-target="#staticBackdrop" type="button">Crear Evento</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container">
            <div className="table-responsive">
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
                                <button id={theEvent.id} onClick={(e) => handleEdit(e, index, theEvent.id)} className="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                                    <i className="fa-solid fa-pen-to-square"></i>
                                </button>
                                <button className="btn btn-primary m-1 btn-sm" onClick={() => deleteEvento(theEvent.id, theEvent.nombre_evento, index)} data-bs-toggle="modal" data-bs-target="#staticBackdrop1">
                                    <i className="fa-solid fa-trash"></i>
                                </button>
                                <button className="btn btn-primary btn-sm">
                                    Participantes
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


