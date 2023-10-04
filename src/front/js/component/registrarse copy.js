import React, { useContext, useState, useEffect } from "react";
import "../../styles/registrarse.css";
import basket from "../../img/basket7.jpeg"
import PayPal from "./paypal";
import { useNavigate, useParams } from 'react-router-dom';
import {Context} from "../store/appContext";

const Registrarse = (props) => {
    const [contador, setContador,] = useState(1);
    const [total, setTotal,] = useState(75);
    const {store, actions} = useContext(Context);
    const navigate =useNavigate();
    const [btnRegistro, setBtnRegistro] = useState("");
    const [datosEvento, setDatosEvento] = useState("");
    const params = useParams();

    useEffect(()=>{
        /*if(store.accessToken){
          //ir a la página de los datos del usuario
          navigate("/perfil");*/
          console.log("a que hrs se despliega?, index:", params.index);
          if (params.index) {
            setDatosEvento(store.allEvents[params.index]);
          }
          console.log("EVENTO:", datosEvento);
      }, [params.index]);

    //fUNCIONES DEL BOTON SUMAR Y RESTAR
    const aumentar = () => {
        let temContador = contador + 1;
        const total = parseInt(datosEvento.costo);
        setTotal(temContador * total);
        setContador(temContador);
        console.log(contador);
    }
    const disminuir = () => {
        let temContador = contador - 1;
        const total = parseInt(datosEvento.costo);
        if (temContador < 0) {
            return;
        }
        setTotal(temContador * total);
        setContador(temContador);
    }

    return (
        <div id="registerWrapper" className="card container">
            <div id="registerTitle" className="row">
                <div className="col-4"></div>
                <div className="col-4">
                    <h1 >{datosEvento.nombre_evento}</h1>
                    <div className="divider divider-default m-3"></div>
                </div>
                <div className="col-4"></div>
            </div>
            <div className="row">
                <div className="col-6">
                    <div id="header" className="card-body">
                        <p className="card-text">{datosEvento.descr_corta}</p>
                        <hr style={{ height: "2px", width: "100%", borderWidth: "0", color: "gray", }}></hr>
                        <div id="center" className="row">
                            <div className="col">
                                <b><h2>Fecha de inicio</h2></b>
                                <p>{datosEvento.fecha_ini}</p>
                            </div>
                            <hr style={{ height: "2px", width: "100%", borderWidth: "0", color: "gray", }}></hr>
                            <div className="col">
                                <b><h2>Fecha de término</h2></b>
                                <p>{datosEvento.fecha_fin}</p>
                            </div>
                            <hr style={{ height: "2px", width: "100%", borderWidth: "0", color: "gray", }}></hr>
                            <div className="col">
                                <b><h2>Fecha límite de registro</h2></b>
                                <p>{"Día: " + datosEvento.fecha_lim + " Hora: "+ datosEvento.hora_lim}</p>
                            </div>
                            <hr style={{ height: "2px", width: "100%", borderWidth: "0", color: "gray", }}></hr>
                        </div>
                        <div className="row">
                            <div id="center" className="col">
                                <b><h2>Ubicación</h2></b>
                                <p>New York, NY, USA(MAP)</p>
                            </div>
                        </div>
                        <div className="row">
                            <img id="image" src={basket} className="img-fluid" alt="Image" />
                        </div>
                        <div className="row">
                            <div className="col">
                                <b><h1>Descripción</h1></b>
                                <hr style={{ height: "2px", width: "100%", borderWidth: "0", color: "gray", }}></hr>
                                <p>This event article, used for writing about and listing the events planned for the future on your website.You can edit all of this text from the Pages tab by clicking the edit button.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="teamRegister" className="col-6">
                    <div id="registerTable" className="container">
                        <div id="registerTableTitle" className="row">
                            <h3>Cantidad de equipos a registrar</h3>
                        </div>
                        <div className="row">
                            <div className="col-3">
                                <b><h5>Evento</h5></b>
                            </div>
                            <div className="col-3">
                                <b><h5>Costo</h5></b>
                            </div>
                            <div className="col-3">
                                <b><h5>Cant.</h5></b>
                            </div>
                            <div className="col-3">
                                <b><h5>Total</h5></b>
                            </div>
                            <hr style={{ height: "2px", width: "100%", borderWidth: "0", color: "gray", }}></hr>
                            <div className="row">
                                <div className="col-3">
                                    <p>Jam on it</p>
                                </div>
                                <div className="col-3">
                                    <p>$75</p>
                                </div>
                                <div className="col-3">
                                    <button className="button" id="disminuir" onClick={disminuir}>-</button>
                                    <span ><button id="cantidad" value="0">{contador}</button></span>
                                    <button className="button" id="aumentar" onClick={aumentar}>+</button>
                                </div>
                                <div className="col-3">
                                    <p>${total}</p>
                                </div>
                            </div>
                        </div>
                        <hr style={{ height: "2px", width: "100%", borderWidth: "0", color: "gray", }}></hr>
                        <div className="row">
                            <div className="col-3"></div>
                            <div className="col-3"></div>
                            <div className="col-3">
                                <b><h4>Total</h4></b>
                            </div>
                            <div className="col-3">
                                <b><h4>${total}</h4></b>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-3"></div>
                            <div className="col-3"></div>
                            <div className="col-3"></div>
                            <div className="col-3">
                                <button type="button" className="btn btn-primary btn-md" data-bs-toggle="modal" data-bs-target="#exampleModal">
                                    Pagar
                                </button>
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
                            <PayPal />
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary">Save changes</button>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}

export default Registrarse;
