import React, { useState } from 'react';

function PasswordRecoveryForm() {
  const [formData, setFormData] = useState({
    email: '',
    newPassword: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  

  const handleSubmit = (e) => {

    
    e.preventDefault();
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h2>Recuperación de contraseña</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Correo electrónico
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="newPassword" className="form-label">
                Nueva contraseña
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
            <button type="submit" className="btn btn-primary">
              Enviar solicitud
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PasswordRecoveryForm;
