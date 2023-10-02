import React, { useState } from "react";
import '../../styles/contacto.css';
import emailjs from 'emailjs-com'

function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    sendCopy: false,
  });

  const [isEmailSent, setIsEmailSent] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 

    const serviceID = 'service_wrzgalp'; // Reemplaza con tu Service ID de emailjs
    const templateID = 'template_r0ko4dy'; // Reemplaza con tu Template ID de emailjs
    const userID = '0uvEkZ3z_2b2oGDIZ'; // Reemplaza con tu User ID de emailjs

    try {
      const response = await emailjs.sendForm(serviceID, templateID, e.target, userID);

      if (response.status === 200) {
        console.log("Mensaje enviado con éxito");
        setIsEmailSent(true);
      } else {
        console.error("Error al enviar el mensaje");
      }
    } catch (error) {
      console.error("Error al enviar el mensaje", error);
    }
  };

  return (
    <div>
      <form className="formContact" onSubmit={handleSubmit}>
        <div className="form-outline mb-4">
          <label className="form-label" htmlFor="name">Nombre</label>
          <input 
            type="text"
            id="name"
            name="name"
            className="fcContact form-control white-background-input"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-outline mb-4">
          <label className="form-label" htmlFor="email">Dirección de correo electrónico</label>
          <input
            type="email"
            id="email"
            name="email"
            className="fcContact form-control white-background-input"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-outline mb-4">
          <label className="form-label" htmlFor="message">Mensaje</label>
          <textarea
            className="fcContact form-control white-background-input"
            id="message"
            name="message"
            rows="4"
            value={formData.message}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        

        <button type="submit" className="btn btn-primary btn-block mb-4">
          Enviar
        </button>
      </form>
      {isEmailSent && <div className="alert alert-success">Mensaje enviado con éxito</div>}
    </div>
  );
}

export default ContactForm;
