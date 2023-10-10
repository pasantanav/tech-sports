import React, { useContext, useState } from 'react';
import { Context } from '../store/appContext';
import { useSearchParams } from 'react-router-dom';

function RecoverPassword() {
  const {store, actions} = useContext(Context)
  const [searchParams, setSearchParams] = useSearchParams()
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  const [passwordsMatch, setPasswordsMatch] = useState(true);
  
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = formData;
    const tokenPassword=searchParams.get("token")
    // Verificar si las contraseñas coinciden antes de enviar la solicitud
    if (data.newPassword === data.confirmPassword) {
      let resp =  actions.changePasswordRecovery(tokenPassword, data.newPassword, )
      console.log('Contraseña enviada:', data.newPassword);
    }
    
     else {
      // Si las contraseñas no coinciden, muestra un mensaje de error
      setPasswordsMatch(false);
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h2>Recuperación de contraseña</h2>
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
