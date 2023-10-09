import React, {  useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext";
import emailjs from "emailjs-com";

const ResetPass = () => {
  const [email, setEmail] = useState("");
  const [recoveredPassword, setRecoveredPassword] = useState(""); // Agrega el estado para la contraseña recuperada
  const [isEmailSent, setIsEmailSent] = useState(false);
  const { store, actions } = useContext(Context);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  useEffect(() => {
    // Obtén la contraseña recuperada del estado global cuando el componente se monte
    console.log(store.userInfo);
  }, []);

  const handleResetPassword = async (e) => {
    e.preventDefault();

    const serviceID = "service_wrzgalp"; //  Service ID de emailjs
    const templateID = "template_orrizgu"; // Template ID de emailjs
    const userID = "0uvEkZ3z_2b2oGDIZ"; //  User ID de emailjs

    try {
      const templateParams = {
        email,
        recoveredPassword // Incluye la contraseña recuperada en los parámetros del correo electrónico
      };

      const response = await emailjs.send(
        serviceID,
        templateID,
        templateParams,
        userID
      );

      if (response.status === 200) {
        console.log("Correo electrónico enviado con éxito");
        setIsEmailSent(true);
      } else {
        console.error("Error al enviar el correo electrónico");
      }
    } catch (error) {
      console.error("Error al enviar el correo electrónico", error);
    }
  };

  return (
    <div className="container">
      <a href="" data-bs-toggle="modal" data-bs-target="#exampleModal">
        Recuperar contraseña
      </a>
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Recuperar Contraseña
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="col-md-12">
                <div className="panel panel-default">
                  <div className="panel-body">
                    <div className="text-center">
                      <p>Escribe tu correo y te enviaremos tu contraseña.</p>
                      <div className="panel-body">
                          <fieldset>
                            <div className="form-group">
                              <input
                                className="form-control input-lg"
                                placeholder="E-mail"
                                name="email"
                                type="email"
                                value={email}
                                onChange={handleEmailChange}
                                required
                              />
                            </div>
                            <button
                              className="btn btn-lg btn-outline-primary btn-block mt-3"
                              type="submit"
                              onSubmit={handleResetPassword}
                            >
                              Enviar Contraseña
                            </button>
                          </fieldset>             
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPass;
