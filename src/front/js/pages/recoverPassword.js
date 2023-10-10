import React, { useContext, useState } from 'react';
import { Context } from '../store/appContext';
import { useSearchParams } from 'react-router-dom';
import '../../styles/passwordform.css'

function RecoverPassword() {
  const { store, actions } = useContext(Context);
  const [searchParams, setSearchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const newPassword = data.get("newPassword")
    const confirmPassword = data.get("confirmPassword")
    const tokenPassword = searchParams.get("token");
    console.log(newPassword)
    // Verificar si las contraseñas coinciden antes de enviar la solicitud
    if (newPassword === confirmPassword) {
      try {
        console.log('Contraseña enviada:', newPassword)
        const resp = await actions.changePasswordRecovery(tokenPassword, newPassword);
       
        // Contraseña restablecida con éxito
        setSuccessMessage('Contraseña restablecida con éxito.');
        setErrorMessage(''); // Borrar cualquier mensaje de error previo
      } catch (error) {
        // Ocurrió un error al restablecer la contraseña
        setSuccessMessage('Contraseña restablecida con exito');
        setErrorMessage(''); // Borrar cualquier mensaje de éxito previo
      }
    } else {
      // Si las contraseñas no coinciden, muestra un mensaje de error
      setPasswordsMatch(false);
      setSuccessMessage(''); // Borrar cualquier mensaje de éxito previo
      setErrorMessage('Las contraseñas no coinciden.');
    }
  };

  return (
    <div className="passwrd-container">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h2>Recuperación de contraseña</h2>
          {successMessage && (
            <div className="alert alert-success" role="alert">
              {successMessage}
            </div>
          )}

          {errorMessage && (
            <div className="alert alert-danger" role="alert">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="newPassword" className="form-label">
                Nueva contraseña:
              </label>
              <input
                type="password"
                className="form-control"
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="confirmPassword" className="form-label">
                Confirmar contraseña:
              </label>
              <input
                type="password"
                className="form-control"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              {!passwordsMatch && (
                <p className="text-danger">Las contraseñas no coinciden.</p>
              )}
            </div>
            <button type="submit" className="btn btn-primary">
              Enviar solicitud
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RecoverPassword;
