import React, { useEffect, useContext, useState } from "react"
import '../../styles/nextEvent.css'
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import imgPagos from "../../img/perfil/pagos.jpg";

const ConsultaPagos = () => {

  const { store, actions } = useContext(Context);
  const navigate = useNavigate();
  const [eventos, setEventos] = useState([]);
  const [pagos, setPagos] = useState([]);
  const [selectedEvento, setSelectedEvento] = useState("-");
  const [total, setTotal] = useState(0)

  useEffect(()=>{
    console.log("Selectedevento:", selectedEvento)
    actions.getPagos(selectedEvento).then(respPagos =>{
      if (respPagos == "Ok"){
        setPagos([...store.pagos])
        console.log("PAGOS1:", store.pagos)
        const suma = store.pagos.reduce((subtotal, valor) => subtotal + valor.monto, 0);
        console.log(suma);
        setTotal(suma);
      }
    });
  }, [selectedEvento]);

  useEffect(() => {
    actions.getPagos(selectedEvento).then(respPagos =>{
      console.log("Respagos:",respPagos)
      if (respPagos == "Ok"){
        setPagos([...store.pagos])
        console.log("PAGOS2:", store.pagos)
        const suma = store.pagos.reduce((subtotal, valor) => subtotal + valor.monto, 0);
        console.log(suma);
        setTotal(suma);
      }
    });
    actions.getUserEvent().then(respEvents =>{
      if (respEvents == "No token"){
        //alert("Sesión expirada");
        navigate("/cuenta");
      }
      if (respEvents=="Ok" && store.userEvent.length!=0){
        setEventos([{id: "-", nombre_evento: "Todos los eventos"}, ...store.userEvent]);
      } else {
        setEventos([{id: "-", nombre_evento: "No tienes eventos"}]);
      }
    });
  }, []);

  const handleChangeEventos = e => {
    console.log("Valor evento:", e.target.value);
    setSelectedEvento(e.target.value);
    console.log("PAGOS3:", store.pagos)
        const suma = store.pagos.reduce((subtotal, valor) => subtotal + valor.monto, 0);
        console.log(suma);
    setTotal(suma);
  };

  return (
    <div className="contSuperior" style={{ minHeight: "400px" }}>
      <div className="container">
        <div className="card mb-2">
          <div className="card-body d-flex justify-content-between align-items-center">
            <div className="col-3 text-center">
              <img className="rounded" src={imgPagos} style={{ maxWidth: '200px', maxHeight: '200px', border: "solid #0D6EFD" }}></img>
            </div>
            <div className="col-6">
              <form>
                <div className="form-row">
                  <div className="text-center">
                    <h2>Lista de Pagos</h2>
                  </div>
                </div>
                <div className="form-row">
                    <label htmlFor="inputEvento">Evento</label>
                    <select id="inputEvento" className="form-control" name="eventoElegido" value={selectedEvento} onChange={handleChangeEventos} required>
                      {eventos.map(option => (
                        <option key={option.id} value={option.id}>{option.nombre_evento}</option>
                      ))}
                    </select>
                </div>
              </form>
            </div>
            <div className="col-3 text-center">
              <div>
                <button className="btn btn-primary mx-3" onClick={()=>navigate("/cuenta")} type="button">Volver a Perfil</button>
              </div>
            </div>
          </div>
        </div>
      </div> 
        <div className="container">
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
                  <td colSpan={"5"} className={total==0? "":"d-none"}><b>ESTE EVENTO NO TIENE PAGOS REALIZADOS</b></td>
                </tr>
              </thead>
              <tbody className={total==0? "d-none":""}>
                {pagos.map((value, index) =>
                  <tr key={index}>
                      <th scope="row">{value.nombre_evento}</th>
                      <td>{value.cant_equipos}</td>
                      <td>{value.orderId}</td>
                      <td>{value.nombre_evento}</td>
                      <td>{"$"+value.monto}</td>
                  </tr>
                )}
              </tbody>
              <tfoot className={total==0? "d-none":""}>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td className="text-end">TOTAL</td>
                  <td>{"$"+total}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
    </div>

  );
}

export default ConsultaPagos;