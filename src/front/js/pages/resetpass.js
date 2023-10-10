import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext";
import emailjs from "emailjs-com";

const ResetPass = () => {
  const [email, setEmail] = useState("");
  const [showSuccessAlert, setShowSuccessAlert] = useState(false); // Nuevo estado para la alerta de éxito
  const { store, actions } = useContext(Context);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const sendRecoveryEmail = async (emailAddress, recoverytoken) => {
    try {
      const serviceId = 'service_wrzgalp';
      const templateId = 'template_orrizgu';
      const userId = '0uvEkZ3z_2b2oGDIZ';
      
      const recoveryUrl = `${process.env.FRONTEND_URL}/changepassword?token=${recoverytoken}`;

      const templateParams = {
        to_email: emailAddress,
        recoveryLink: recoveryUrl,
      };

      const response = await emailjs.send(serviceId, templateId, templateParams, userId);

      if (response.status === 200) {
        console.log('Correo electrónico de recuperación enviado con éxito.');
        return true;
      } else {
        console.error('Error al enviar el correo electrónico de recuperación.');
        return false;
      }
    } catch (error) {
      console.error('Error al enviar el correo electrónico:', error);
      return false;
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const { resetPassword } = actions;
      console.log(email);
      let resp = await resetPassword(email);
      console.log('la respuesta es: ' + resp.data.recoveryToken)

      if (resp.code == 200) {
        // Llama a la función sendRecoveryEmail con el correo y el token de recuperación
        const recoveryResult = await sendRecoveryEmail(email, resp.data.recoveryToken);

        if (recoveryResult) {
          // Si el correo se envió con éxito, muestra la alerta de éxito
          setShowSuccessAlert(true);
        }
      } else {
        // Si hubo un error al restablecer la contraseña, puedes manejarlo aquí
        console.error('Error al restablecer la contraseña:', resp.error);
      }
    } catch (error) {
      console.error('Error al restablecer la contraseña:', error);
    }
  };

  useEffect(() => {
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
                Cerrar
              </button>
            </div>
            {showSuccessAlert && (
              <div className="alert alert-success" role="alert">
                Correo de recuperación enviado con éxito.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPass;
