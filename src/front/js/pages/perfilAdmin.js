import React, { useEffect, useContext, useState } from "react"
import { Context } from "../store/appContext";
import { useNavigate, Link } from "react-router-dom";
import imgAdmin from "../../img/perfil/admin.jpg";

const PerfilAdmin = () => {

  const { store, actions } = useContext(Context);
  const navigate = useNavigate();
  const [registros, setRegistros] = useState([]);
  const [selectedItem, setSelectedItem] = useState("1");
  const [total, setTotal] = useState(0);
  const titulosUsu = ["Nombre", "Email", "Dirección", "Teléfono"];
  const titulosEve = ["Evento", "Fecha de Inicio", "Fecha de Terminación", "Fecha y Hora Límite de Registro"];
  const titulosPag = ["Evento", "Usuario", "Equipos Registrados", "Monto"]
  const [titulos, setTitulos] = useState(["Nombre", "Email", "Dirección", "Teléfono"]);
  const itemsList = [
                      {id:"1", nombre:"Usuarios"},
                      {id:"2", nombre:"Eventos"},
                      {id:"3", nombre:"Pagos"}
                    ]

  useEffect(() => {
    let newRegistro = [];
    switch(selectedItem){
      case "1":
        actions.getAllUsers().then(respUsers =>{
          if (respUsers == "Ok"){
            store.allUsuarios.map((item)=>
              newRegistro.push({dato1: item.name, dato2: item.email, dato3: item.address, dato4: item.phone})
            );
            setRegistros([...newRegistro]);
          } else {
            setRegistros([{id:"-", dato1: "No hay usuarios"}]);
          }
        });
        setTitulos([...titulosUsu]);
        setTotal(0);
        break;
      case "2":
        actions.getAllEvents().then(respEvents =>{
          if (respEvents == "Ok"){
            store.allEvents.map((item) =>
              newRegistro.push({dato1: item.nombre_evento,
                dato2: new Date(item.fecha_ini+"T00:00:00").toLocaleDateString(),
                dato3: new Date(item.fecha_fin+"T00:00:00").toLocaleDateString(),
                dato4: new Date(item.fecha_lim+"T"+item.hora_lim+":00").toLocaleString()})
            );
            setRegistros([...newRegistro]);
          } else {
            setRegistros([{id:"-", dato1: "No hay eventos"}]);
          }
        });
        setTitulos([...titulosEve]);
        setTotal(0);
        break;
      case "3":
        setTotal(0);
        actions.getAllPagos().then(respPagos => {
          if(respPagos == "Ok"){
            let subtotal = 0;
            store.allPagos.map((item)=>{
            subtotal+=item.monto;
            newRegistro.push({
              dato1: item.nombre_evento,
              dato2: item.nombre_usuario,
              dato3: item.cant_equipos,
              dato4: "$" + item.monto
            })});
            setTotal(subtotal);
            setRegistros([...newRegistro]);
          } else {
            setRegistros([{id:"-", dato1: "No hay Pagos"}]);
          }
        });
        setTitulos([...titulosPag]);
        break;
    }
    document.getElementById("spinner").style.display = "none";
  }, [selectedItem]);

  const handleChangeItems = e => {
    setSelectedItem(e.target.value);
  };

  return (
    <div className="contSuperior" style={{ minHeight: "400px" }}>
      <div className="container">
        <div className="card mb-2">
          <div className="card-body d-flex justify-content-between align-items-center">
            <div className="col-3 text-center">
              <img className="rounded" src={imgAdmin} style={{ maxWidth: '200px', maxHeight: '200px', border: "solid #0D6EFD" }}></img>
            </div>
            <div className="col-6">
              <form>
                <div className="form-row">
                  <div className="text-center">
                    <h2>Panel de Administración</h2>
                  </div>
                </div>
                <div className="form-row">
                    <label htmlFor="inputEvento">Elige una opción</label>
                    <select id="inputEvento" className="form-control" name="eventoElegido" value={selectedItem} onChange={handleChangeItems} required>
                      {itemsList.map(option => (
                        <option key={option.id} value={option.id}>{option.nombre}</option>
                      ))}
                    </select>
                </div>
              </form>
            </div>
            <div className="col-3 text-center">
              <div>
                <Link to={"/"}>
                  <button className="btn btn-primary mx-3" onClick={() => actions.logout()} type="button">Cerrar Sesión</button>
                </Link>
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
                  {titulos.map((titulo)=> <th key={titulo} scope="col">{titulo}</th>)}
                </tr>
              </thead>
              <tbody>
                {registros.map((value, index) =>
                  <tr key={index}>
                      <th scope="row">{value.dato1}</th>
                      <td>{value.dato2}</td>
                      <td>{value.dato3}</td>
                      <td>{value.dato4}</td>
                  </tr>
                )}
              </tbody>
              <tfoot className={total==0? "d-none":""}>
                <tr>
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

export default PerfilAdmin;