import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext";
import emailjs from "emailjs-com";

const ResetPass = () => {
  const [email, setEmail] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const { store, actions } = useContext(Context);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch('/recoverpassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });
  
      if (response.status === 200) {
        const data = await response.json();
  
        // Enviar el token de recuperación por correo electrónico
        const serviceID = "service_wrzgalp"; // Reemplaza con tu Service ID de emailjs
        const templateID = "template_orrizgu"; // Reemplaza con tu Template ID de emailjs
        const userID = "t0uvEkZ3z_2b2oGDIZ"; // Reemplaza con tu User ID de emailjs
  
        const templateParams = {
          email: email,
          recoveryLink: data.recoveryToken
        };
  
        const emailResponse = await emailjs.send(
          serviceID,
          templateID,
          templateParams,
          userID
        );
  
        if (emailResponse.status === 200) {
          console.log("Correo electrónico enviado con éxito");
          setIsEmailSent(true);
        } else {
          console.error("Error al enviar el correo electrónico");
        }
      } else {
        console.error("Error al enviar la solicitud al backend");
      }
    } catch (error) {
      console.error("Error al enviar la solicitud al backend", error);
    }
  };

  useEffect(() => {
    // Obtén la contraseña recuperada del estado global cuando el componente se monte
    console.log(store.userInfo);
  }, []);

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
                        <form onSubmit={handleResetPassword}>
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
                            >
                              Enviar Contraseña
                            </button>
                          </fieldset>
                        </form>
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
