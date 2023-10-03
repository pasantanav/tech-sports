import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext";

const ModalEvent = (props) => {

    const { store, actions } = useContext(Context)
    const [fechaActual, setFechaActual] = useState("");
    const [fechaInicio, setFechaInicio] = useState("");
    const [fechaFinal, setFechaFinal] = useState("");
    const [fechaLimite, setFechaLimite] = useState("");
    const [editar, setEditar] = useState(false);
    const formulario = document.getElementById("formEvent");
    const [eventFormData, setEventFormData] = useState(props.operacion=="Evento Nuevo"? {
      nombre_evento: "",
      descr_corta: "",
      fecha_ini: "",
      fecha_fin: "",
      ubicacion: "",
      logotipo: "",
      descr_larga: "",
      reglas: "",
      fecha_lim: "",
      hora_lim: '23:59',
      email_contacto: "",
      tel_contacto: "",
      nombre_contacto: "",
      costo: 0,
      id: ""
    }:store.userEvent[props.indice]);
      
      function cambiarFormatoFecha(fechaAnt){
        let day = fechaAnt.getDate().toString();
        if (day.length==1)
          day = "0"+ day;
        let year = fechaAnt.getFullYear().toString();
        let month = fechaAnt.getMonth()+1;
        month = month.toString();
        if (month.length==1)
        month = "0"+ month;
        let nuevaFecha = year+"-"+month+"-"+day;
        return nuevaFecha;
      }

      const limpiarDataEvento = () => {
        if (props.operacion=="Evento Nuevo"){
          console.log("limpiando datos");
          setEventFormData({
            nombre_evento: "",
            descr_corta: "",
            fecha_ini: "",
            fecha_fin: "",
            ubicacion: "",
            logotipo: "",
            descr_larga: "",
            reglas: "",
            fecha_lim: "",
            hora_lim: '23:59',
            email_contacto: "",
            tel_contacto: "",
            nombre_contacto: "",
            costo: 0,
            id: ""
          });}
      }

      useEffect(()=>{
        if (props.operacion=="Editar Evento"){
          setEventFormData(store.userEvent[props.indice]);
          setFechaInicio(store.userEvent[props.indice].fecha_ini);
          setFechaFinal(store.userEvent[props.indice].fecha_fin);
          setFechaLimite(store.userEvent[props.indice].fecha_lim);
        } else {
          limpiarDataEvento();
          let currentDate = new Date();
          let actual = cambiarFormatoFecha(currentDate);
          console.log("La fecha actua es:", actual);
          setFechaActual(actual);
          setFechaInicio(actual);
          setFechaFinal(actual);
          setFechaLimite(actual);
          /*let eventData = {...eventFormData};
          let currentDate = new Date();
          let actual = cambiarFormatoFecha(currentDate);
          console.log("La fecha actua es:", actual);
          setFechaActual(actual);
          setFechaInicio(actual);
          setFechaFinal(actual);
          setFechaLimite(actual);
          for (let value in eventData){
            eventData[value] = "";
            if (value=="costo")
              eventData[value] = 0;
            if (value=="hora_lim")
              eventData[value] = "23:59";
            if (value=="fecha_ini")
              eventData[value] = fechaInicio;
            if (value=="fecha_fin")
              eventData[value] = fechaFinal;
            if (value=="fecha_lim")
              eventData[value] = fechaLimite;
          }
          setEventFormData(eventData);*/
        }
      }, [props.indice]);

      useEffect(()=>{
        limpiarDataEvento();
        let currentDate = new Date();
        let actual = cambiarFormatoFecha(currentDate);
        console.log("La fecha de hoy es:", actual);
        setFechaActual(actual);
        setFechaInicio(actual);
        setFechaFinal(actual);
        setFechaLimite(actual);
      }, []);

    const handleEventChange = (e) => {
      //console.log("TARGET", e.target);
      const { name, value } = e.target;
      setEventFormData({
        ...eventFormData,
        [name]: value,
      });
      if (name == "fecha_ini" || name == "fecha_fin" || name == "fecha_lim"){
        const eventDataok = {...eventFormData};
        if (name == "fecha_ini"){
            setFechaInicio(value);
            setFechaLimite(value);
            setFechaFinal(value);
            eventDataok.fecha_ini= value;
            eventDataok.fecha_fin= value;
            eventDataok.fecha_lim= value;
          }
        if (name == "fecha_fin"){
          setFechaFinal(value);
          setFechaLimite(value);
          eventDataok.fecha_fin= value;
          eventDataok.fecha_lim= value;
        }
        if (name == "fecha_lim"){
          setFechaLimite(value);
        }
        setEventFormData(eventDataok);
      }
      setEditar(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData(e.target)
        const nombre_evento=data.get("nombre_evento")
        /*const fecha_ini=data.get("fecha_ini")
        const fecha_fin=data.get("fecha_fin")
        const fecha_lim=data.get("fecha_lim")*/
        if (props.operacion=="Editar Evento" && editar==false){
          console.log("no es necesario editar");
          alert("Evento actualizado");
          formulario.reset();
        } else if (nombre_evento.length <3) {
            alert("El nombre debe tener al menos 2 caracteres")
          } else {
              /*const eventDataok = {...eventFormData};
              console.log("FECHA DE INICIO A VER:", fecha_ini);
              eventDataok.fecha_ini = fecha_ini.toString();
              eventDataok.fecha_fin = fecha_fin.toString();
              eventDataok.fecha_lim = fecha_lim.toString();
              console.log("FECHAS:", eventDataok.fecha_ini, eventDataok.fecha_fin, eventDataok.fecha_lim);
              console.log("EVento antes de grabar", eventDataok);
              setEventFormData(eventDataok);
              console.log("Evento a grabar:", eventFormData);*/
              console.log("EVento antes de grabar", eventFormData);
              console.log(props.indice, props.operacion);
              let resp ="";
              let oper ="";
              if (props.operacion=="Evento Nuevo"){
                const {newEvent} = actions;
                resp = await newEvent(eventFormData);
                oper = "creado";
              } else {
                //Si estamos editando el evento
                const {editEvent} = actions;
                resp = await editEvent(eventFormData, props.indice);
                oper = "actualizado";
              }
              console.log({resp})
              console.log(resp.code)
              if (resp=="Ok"){
                //MODAL
                alert("Evento " + oper + " exitosamente");
                limpiarDataEvento();
                /*if (props.operacion=="Evento Nuevo"){
                  let text = "Registro exitoso\n¿Quieres agregar otro evento?";
                  if (confirm(text) == false) {
                    staticBackdrop.hide();
                  }
                } else {
                  alert("Registro exitoso")
                }*/
                formulario.reset();
              } else {
                alert("Error al registrar Evento")
              }
              //cleanEventData();
              formulario.reset();
              //window.location.reload(false)
              //preguntar si desea agregar otro evento?
            }
      };

    return(
        <div className="row">
            <form onSubmit={handleSubmit} id="formEvent">
                      <div className="form-outline mb-4">
                        <label className="form-label" htmlFor="nombre_evento">
                          Nombre del Evento
                        </label>
                        <div className="form-outline mb-4">
                          <input
                            type="text"
                            id="nombre_evento"
                            name="nombre_evento"
                            maxLength="50"
                            value={eventFormData.nombre_evento}
                            className="form-control white-background-input"
                            onChange={handleEventChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="form-outline mb-4">
                        <label className="form-label" htmlFor="descr_corta">
                          Descripción corta
                        </label>
                        <div className="form-outline mb-4">
                        <textarea
                            type="text"
                            id="descr_corta"
                            name="descr_corta"
                            value={eventFormData.descr_corta}
                            rows="2"
                            maxLength="100"
                            className="form-control white-background-input"
                            onChange={handleEventChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="row mb-4">
                          <div className="col">
                            <div className="form-outline">
                              <label className="form-label" htmlFor="fecha_ini">
                                Fecha de inicio
                              </label>
                              <div className="form-outline">
                                <input
                                  type="date"
                                  id="fecha_ini"
                                  min={fechaActual}
                                  name="fecha_ini"
                                  value={eventFormData.fecha_ini}
                                  className="form-control white-background-input"
                                  onChange={handleEventChange}
                                  required
                                />
                              </div>
                            </div>
                          </div>
                          <div className="col">
                            <div className="form-outline">
                              <label className="form-label" htmlFor="fecha_fin">
                                Fecha de terminación
                              </label>
                              <div className="form-outline">
                                <input
                                  type="date"
                                  id="fecha_fin"
                                  min={fechaInicio}
                                  name="fecha_fin"
                                  value={eventFormData.fecha_fin}
                                  className="form-control white-background-input"
                                  onChange={handleEventChange}
                                  required
                                />
                              </div>
                            </div>
                          </div>
                      </div>

                      <div className="form-outline mb-4">
                        <label className="form-label" htmlFor="ubicacion">
                          Dirección
                        </label>
                        <div className="form-outline mb-4">
                          <input
                            type="text"
                            id="ubicacion"
                            name="ubicacion"
                            value={eventFormData.ubicacion}
                            maxLength="100"
                            className="form-control white-background-input"
                            onChange={handleEventChange}
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
                            value={eventFormData.logotipo}
                            maxLength="150"
                            className="form-control white-background-input"
                            onChange={handleEventChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="form-outline mb-4">
                        <label className="form-label" htmlFor="descr_larga">
                          Descripción larga
                        </label>
                        <div className="form-outline mb-4">
                          <textarea
                            type="text"
                            id="descr_larga"
                            name="descr_larga"
                            value={eventFormData.descr_larga}
                            rows="3"
                            maxLength="250"
                            className="form-control white-background-input"
                            onChange={handleEventChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="form-outline mb-4">
                        <label className="form-label" htmlFor="reglas">
                          Reglas
                        </label>
                        <div className="form-outline mb-4">
                          <input
                            type="text"
                            id="reglas"
                            name="reglas"
                            value={eventFormData.reglas}
                            maxLength="150"
                            className="form-control white-background-input"
                            onChange={handleEventChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="form-outline mb-4">
                        <label className="form-label" htmlFor="nombre_contacto">
                          Nombre del contacto
                        </label>
                        <div className="form-outline mb-4">
                          <input
                            type="text"
                            id="nombre_contacto"
                            name="nombre_contacto"
                            value={eventFormData.nombre_contacto}
                            maxLength="150"
                            className="form-control white-background-input"
                            onChange={handleEventChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="row mb-4">
                        <div className="col">
                          <div className="form-outline">
                            <label className="form-label" htmlFor="email_contacto">
                              Email de contacto
                            </label>
                            <div className="form-outline">
                              <input
                                type="email"
                                id="email_contacto"
                                name="email_contacto"
                                value={eventFormData.email_contacto}
                                maxLength="50"
                                className="form-control white-background-input"
                                onChange={handleEventChange}
                                required
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col">
                          <div className="form-outline">
                            <label className="form-label" htmlFor="tel_contacto">
                              Teléfono de contacto
                            </label>
                            <div className="form-outline">
                              <input
                                type="text"
                                id="tel_contacto"
                                name="tel_contacto"
                                value={eventFormData.tel_contacto}
                                maxLength="15"
                                className="form-control white-background-input"
                                onChange={handleEventChange}
                                required
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="row mb-4">
                        <div className="col">
                          <div className="form-outline">
                            <label className="form-label" htmlFor="fecha_lim">
                              Fecha límite
                            </label>
                            <div className="form-outline">
                              <input
                                type="date"
                                id="fecha_lim"
                                name="fecha_lim"
                                value={eventFormData.fecha_lim}
                                max={fechaFinal}
                                className="form-control white-background-input"
                                onChange={handleEventChange}
                                required
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col">
                          <div className="form-outline">
                            <div className="form-outline">
                              <label className="form-label" htmlFor="fecha_lim">
                                Hora límite
                              </label>
                              <input
                                type="time"
                                id="hora_lim"
                                name="hora_lim"
                                value={eventFormData.hora_lim}
                                className="form-control white-background-input"
                                onChange={handleEventChange}
                                required
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col">
                          <div className="form-outline">
                            <label className="form-label" htmlFor="costo">
                              Costo
                            </label>
                            <div className="form-outline">
                              <input
                                type="number"
                                id="costo"
                                name="costo"
                                value={eventFormData.costo}
                                min = "1"
                                step="0.01"
                                placeholder="$"
                                className="form-control white-background-input"
                                onChange={handleEventChange}
                                required
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className='text-center'>
                        <button type="submit" className="btn btn-primary btn-block mx-4 mb-4" data-bs-dismiss={props.operacion=="Editar Evento"? "modal":""}>
                          Guardar
                        </button>
                        <button type="button" className="btn btn-secondary btn-block mb-4" data-bs-dismiss="modal">Cancelar</button>
                      </div>
              </form>
        </div>
);
}

export default ModalEvent;