import React, { useEffect, useContext, useState } from "react"
import '../../styles/nextEvent.css'
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import imgPagos from "../../img/perfil/pagos.jpg";
import "../../styles/eventoLista.css";
import imgFondo from "../../img/perfil/fondok.png";

const ConsultaPagos = () => {

  const { store, actions } = useContext(Context);
  const navigate = useNavigate();
  const [eventos, setEventos] = useState([]);
  const [pagos, setPagos] = useState([]);
  const [selectedEvento, setSelectedEvento] = useState("-");
  const [total, setTotal] = useState(0)

  useEffect(() => {
    actions.getPagos(selectedEvento).then(respPagos => {
      if (respPagos == "Ok") {
        setPagos([...store.pagos])
        const suma = store.pagos.reduce((subtotal, valor) => subtotal + valor.monto, 0);
        setTotal(suma);
      }
    });
    document.getElementById("spinner").style.display = "none";
  }, [selectedEvento]);

  useEffect(() => {
    actions.getPagos(selectedEvento).then(respPagos =>{
      if (respPagos == "No token"){
        navigate("/cuenta");
      }
      if (respPagos == "Ok"){
        setPagos([...store.pagos])
        let eventosPagados = [{id: "-", nombre_evento: "Todos los eventos"}];
        store.pagos.map((item)=>
          eventosPagados.push({id: item.event_id, nombre_evento: item.nombre_evento})
        );
        console.log("Eventos pagados:", eventosPagados);
        setEventos([...eventosPagados]);
        const suma = store.pagos.reduce((subtotal, valor) => subtotal + valor.monto, 0);
        setTotal(suma);
      } else {
        setEventos([{id: "-", nombre_evento: "No tienes eventos"}]);
      }
    });
  }, []);

  const handleChangeEventos = e => {
    setSelectedEvento(e.target.value);
    const suma = store.pagos.reduce((subtotal, valor) => subtotal + valor.monto, 0);
    setTotal(suma);
  };

  return (
    <div className="contSuperior" style={{ minHeight: "400px" }}>
      <div className="container">
        <div className="card mb-2">
          <img className="card-img img-fluid mw-100 object-fit-fill" style={{width: "100%", height: "12rem"}} src={imgFondo} alt="Card image"/>
          <div className="card-img-overlay">
            <div className="card-body d-flex flex-column flex-md-row justify-content-between align-items-center">
              <div className="col-md-4 col-12 text-center">
                <img className="rounded" src={imgPagos} style={{ maxWidth: '200px', maxHeight: '200px', border: "solid #0D6EFD" }}></img>
              </div>
              <div className="col-md-4 col-12">
                <form>
                  <div className="form-row">
                    <div className="text-center text-white">
                      <h2 className="black-text-shadow">Lista de Pagos</h2>
                    </div>
                  </div>
                  <div className="form-row text-white fw-bold">
                    <label htmlFor="inputEvento">Evento</label>
                    <select id="inputEvento" className="form-control" name="eventoElegido" value={selectedEvento} onChange={handleChangeEventos} required>
                      {eventos.map(option => (
                        <option key={option.id} value={option.id}>{option.nombre_evento}</option>
                      ))}
                    </select>
                  </div>
                </form>
              </div>
              <div className="col-4 text-center m-2">
                <div>
                  <button className="btn btn-primary mx-3" onClick={() => navigate("/cuenta")} type="button">Volver a Perfil</button>
                </div>
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
                <th scope="col">Equipos Registrados</th>
                <th scope="col">Núm. de Orden</th>
                <th scope="col">Nombre del Evento</th>
                <th scope="col">Monto</th>
              </tr>
              <tr className="text-center">
                <td colSpan={"5"} className={total == 0 ? "" : "d-none"}><b>ESTE EVENTO NO TIENE PAGOS REALIZADOS</b></td>
              </tr>
            </thead>
            <tbody className={total == 0 ? "d-none" : ""}>
              {pagos.map((value, index) =>
                <tr key={index}>
                  <th scope="row">{value.nombre_evento}</th>
                  <td>{value.cant_equipos}</td>
                  <td>{value.orderId}</td>
                  <td>{value.nombre_evento}</td>
                  <td>{"$" + value.monto}</td>
                </tr>
              )}
            </tbody>
            <tfoot className={total == 0 ? "d-none" : ""}>
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td className="text-end">TOTAL</td>
                <td>{"$" + total}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ConsultaPagos;