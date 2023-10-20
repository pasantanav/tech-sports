import React, { useContext, useState, useEffect } from 'react';
import { BrowserRouter as Router, Link, useNavigate } from 'react-router-dom';
import { Context } from "../store/appContext";
import tournament from "../../img/perfil/tournament.jpg";
import teamlist from "../../img/perfil/teamlist.jpg";
import eventlist from "../../img/perfil/eventlist.jpg";
import imgLogo from "../../img/LogoTS.jpg";
import imgRegistros from "../../img/perfil/registros.jpg";
import img1 from "../../img/carrusel/imagen1.png"
import img2 from "../../img/carrusel/imagen2.png"
import img3 from "../../img/carrusel/imagen3.png"
import imgPagos from "../../img/perfil/pagos.jpg";
import * as filestack from 'filestack-js';
import "../../styles/perfil.css";
import Slider from 'react-slick'
import { Modal, Button, Form } from 'react-bootstrap';

const Perfil = () => {
  const { store, actions } = useContext(Context);
  const [userData, setUserData] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const profileData = { ...store.userInfo };
  const [profileImage, setProfileImage] = useState(
    null
  );
  const [name, setName] = useState(profileData.name);
  const [email, setEmail] = useState(profileData.email);
  const [phone, setPhone] = useState(profileData.phone);
  const [address, setAddress] = useState(profileData.address);
  const [password, setPassword] = useState(profileData.password);
  const navigate = useNavigate()
  const filestackClient = filestack.init('ApcaRKG5TSEuvL2v2O2Dnz');
  const [currentSlide, setCurrentSlide] = useState(0);
  // Manejar la selección de archivos y actualización de imagen de perfil
  useEffect(() => {
    setProfileImage(profileData.url_perfil)
  }, [profileData.url_perfil]);

  //cuando cargue llamamos a getuserinfo y enviamos la data al userData
  useEffect(() => {
    if (store.accessToken) {
      actions.getUserInfo().then(data => {
        setUserData(data);
        if (store.userInfo.email == "admin@techsports.com")
          navigate("/perfilAdmin");
        // Verificar si el usuario tiene una imagen de perfil y establecerla
        //if (data && data.profileImage) {
        // setProfileImage(data.profileImage);
        //  }
      });
    } else {
      //alert("Sesión expirada");
      navigate("/cuenta");
    }
  }, [store.accessToken]);

  const openEditModal = () => {
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
  };
  const images = [
    img1,
    img2,
    img3,
  ];

  const nextSlide = () => {
    setCurrentSlide((currentSlide + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentSlide((currentSlide - 1 + images.length) % images.length);
  };

  const handleEditProfile = (e) => {
    e.preventDefault();


    const updatedProfileData = {
      name,
      email,
      phone,
      address
    };

    if (name === '') {
      alert('El campo de nombre no puede estar en blanco');
      return;
    }
    // Lógica para actualizar los datos del perfil aquí...
    actions.editProfile(updatedProfileData).then(() => {
      setIsEditModalOpen(false);

      // Actualizar el estado de la aplicación con los nuevos datos editados
      setUserData(updatedProfileData);

      // Llamar a getUserInfo nuevamente para obtener los datos actualizados
      actions.getUserInfo().then(data => {
      }).catch(error => {
        console.error(error);
      });
    }).catch(error => {
      console.error(error);
    });
  };
  useEffect(() => {
    // Función para avanzar automáticamente cada 5 segundos
    const autoAdvance = () => {
      nextSlide();
    };

    // Configura el avance automático cada 5 segundos
    const interval = setInterval(autoAdvance, 5000);

    // Limpia el intervalo cuando el componente se desmonta
    return () => clearInterval(interval);
  }, [currentSlide]);

  const handleOpenFilePicker = () => {
    const options = {
      onUploadDone: (res) => {
        const newImageUrl = res.filesUploaded[0].url;
        //console.log('la URL de la imagen es:', newImageUrl)
        actions.updateProfileImage(newImageUrl).then(() => {
          setProfileImage(newImageUrl);
        }).catch(error => {
          console.error(error)
        })
      }
    };

    filestackClient.picker(options).open().then(response => {
      // Verifica si se seleccionó una imagen antes de continuar
      if (response.filesUploaded && response.filesUploaded.length > 0) {
        // Obtén la URL de la imagen seleccionada
        const imageUrl = response.filesUploaded[0].url;
        // Actualiza el estado con la nueva imagen
        setSelectedImage(imageUrl);
      }
    }).catch(error => {
      console.error('Filestack error:', error);
    });
  };

  return (
    <div className="contSuperior mx-3">
      <div className="row">
        <div className="col-lg-4">
          <div className="card mb-4">
            <div className="card-body text-center">
              <img
                src={profileImage == "" ? imgLogo : profileImage}
                alt="avatar"
                className="rounded-circle img-fluid"
                style={{ width: '150px' }}
              />
              <h5 className="my-3">{profileData.name}</h5>
              <p className="text-muted mb-4">{profileData.address}</p>
              <div>
                <button type="button" className="btn btn-primary my-2" onClick={handleOpenFilePicker}>
                  Cambiar imagen de perfil
                </button>
              </div>
              <div>
                <button className='btn btn-outline-primary ms-1' onClick={() => actions.logout()}>
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>
          <div className="card mb-4">
            <div className="card-body text-center">
              <div className="card mb-4 mb-lg-0" id='carousel-container'>
                <div className="card-body p-0">
                  <div className="carousel-containerr">
                    <img className='carousel img-fluid' src={images[currentSlide]} alt={`Imagen ${currentSlide + 1}`} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-8">
          <div className="card mb-3">
            <div className="card-body">
              <div className="row">
                <div className="col-sm-3">
                  <p className="mb-0">Nombre completo</p>
                </div>
                <div className="col-sm-9">
                  <p className="text-muted mb-0">{profileData.name}</p>
                </div>
              </div>
              <hr />
              <div className="row">
                <div className="col-sm-3">
                  <p className="mb-0">Email</p>
                </div>
                <div className="col-sm-9">
                  <p className="text-muted mb-0">{profileData.email}</p>
                </div>
              </div>
              <hr />
              <div className="row">
                <div className="col-sm-3">
                  <p className="mb-0">Télefono</p>
                </div>
                <div className="col-sm-9">
                  <p className="text-muted mb-0">{profileData.phone}</p>
                </div>
              </div>
              <hr />
              <div className="row">
                <div className="col-sm-3">
                  <p className="mb-0">Dirección</p>
                </div>
                <div className="col-sm-9">
                  <p className="text-muted mb-0">{profileData.address}</p>
                </div>
              </div>
                <hr />
              <div>
                <div className='text-center'>
                  <button type="button" className="btn btn-primary" onClick={openEditModal}>
                    Editar Datos
                  </button>
        
                  <Modal show={isEditModalOpen} onHide={closeEditModal}>
                    <Modal.Header closeButton>
                      <div className='Modal-header-container'>
                      <Modal.Title>Editar Datos</Modal.Title>
                      </div>
                      
                    </Modal.Header>
                    <Modal.Body>
                      <Form onSubmit={handleEditProfile}>
                        <Form.Group controlId="name">
                          <Form.Label>Nombre</Form.Label>
                          <Form.Control
                            type="text"
                            defaultValue={profileData.name}
                            onChange={(e) => setName(e.target.value)}
                          />
                        </Form.Group>
                        <Form.Group controlId="email">
                          <Form.Label>Email</Form.Label>
                          <Form.Control
                            type="email"
                            defaultValue={profileData.email}
                            disabled
                          />
                          <p className="text-muted">Para modificar tu correo electrónico, por favor, contáctanos.</p>
                        </Form.Group>
                        <Form.Group controlId="phone">
                          <Form.Label>Télefono</Form.Label>
                          <Form.Control
                            type="text"
                            defaultValue={profileData.phone}
                            onChange={(e) => setPhone(e.target.value)}
                            pattern="^\S.*" 
                          />
                        </Form.Group>
                        <Form.Group controlId="address">
                          <Form.Label>Dirección</Form.Label>
                          <Form.Control
                            type="text"
                            defaultValue={profileData.address}
                            onChange={(e) => setAddress(e.target.value)}
                            pattern="^\S.*" 
                          />
                        </Form.Group>
                        <Form.Group controlId="password">
                          
                        </Form.Group>
                        <div className='Modal-button-container'>
                          <Button variant="primary" type="submit " id='sendButton'>
                            Guardar Cambios
                          </Button>
                        </div>
                        
                      </Form>
                    </Modal.Body>
                  </Modal>
                </div>
              </div>

              <div className='text-center'>

                <Modal show={isEditModalOpen} onHide={closeEditModal}>
                  <Modal.Header closeButton>
                    <Modal.Title>Editar Datos</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <Form onSubmit={handleEditProfile}>
                      <Form.Group controlId="name">
                        <Form.Label>Nombre</Form.Label>
                        <Form.Control
                          type="text"
                          defaultValue={profileData.name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </Form.Group>
                      <Form.Group controlId="email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                          type="email"
                          defaultValue={profileData.email}
                          disabled
                        />
                        <p className="text-muted">Para modificar tu correo electrónico, por favor, contáctanos.</p>
                      </Form.Group>
                      <Form.Group controlId="phone">
                        <Form.Label>Télefono</Form.Label>
                        <Form.Control
                          type="text"
                          defaultValue={profileData.phone}
                          onChange={(e) => setPhone(e.target.value)}
                        />
                      </Form.Group>
                      <Form.Group controlId="address">
                        <Form.Label>Dirección</Form.Label>
                        <Form.Control
                          type="text"
                          defaultValue={profileData.address}
                          onChange={(e) => setAddress(e.target.value)}
                        />
                      </Form.Group>
                      <Form.Group controlId="password">

                      </Form.Group>
                      <div className="my-3 text-center">
                        <Button variant="primary" type="submit">
                          Guardar Cambios
                        </Button>
                      </div>
                    </Form>
                  </Modal.Body>
                </Modal>
              </div>
            </div>
          </div>
          <div className="col-lg-4 w-100">
            <div className="card d-flex mb-4">
              <div className="card-body d-flex flex-column flex-lg-row justify-content-between">
                <div className="col-lg-2 col-sm-8 mx-auto  col-12">
                  <div className="card text-center" style={{ maxWidth: "17.5rem" }}>
                    <Link to={"/eventolista/" + profileData.userId}>
                      <div className="contImage">
                        <img src={tournament} className="d-block w-100 h-auto rounded-top" alt="Eventos" />
                        <div className="overlay small">
                          <div className="textOverlay">Crea, modifica o elimina tus eventos.</div>
                        </div>
                      </div>
                    </Link>
                    <div className="card-body">
                      <div>
                        <Link to={"/eventolista/" + profileData.userId}>
                          <button className="btn btn-outline-primary w-100">Administra Eventos</button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-2 col-sm-8 mx-auto  col-12">
                  <div className="card text-center" style={{ maxWidth: "17.5rem" }}>
                    <Link to="/teamlist">
                      <div className="contImage">
                        <img src={teamlist} className="d-block w-100 h-auto rounded-top" alt="Equipos" />
                        <div className="overlay small">
                          <div className="textOverlay">Crea, modifica o elimina tus equipos.</div>
                        </div>
                      </div>
                    </Link>
                    <div className="card-body">
                      <Link to="/teamlist" className="btn btn-outline-primary w-100">Administra Equipos</Link>
                    </div>
                  </div>
                </div>
                <div className="col-lg-2 col-sm-8 mx-auto  col-12">
                  <div className="card text-center" style={{ maxWidth: "17.5rem" }}>
                    <Link to="/nextEvent">
                      <div className="contImage">
                        <img src={eventlist} className="d-block w-100 h-auto rounded-top" alt="Registrar" />
                        <div className="overlay small">
                          <div className="textOverlay">Consulta los eventos y paga.</div>
                        </div>
                      </div>
                    </Link>
                    <div className="card-body">
                      <Link to="/nextEvent" className="btn btn-outline-primary w-100">Registra Equipos</Link>
                    </div>
                  </div>
                </div>
                <div className="col-lg-2 col-sm-8 mx-auto  col-12">
                  <div className="card text-center" style={{ maxWidth: "17.5rem" }}>
                    <Link to="/registroEquipos">
                      <div className="contImage">
                        <img src={imgRegistros} className="d-block w-100 h-auto rounded-top" alt="Registros" />
                        <div className="overlay small">
                          <div className="textOverlay">Registra equipos a eventos.</div>
                        </div>
                      </div>
                    </Link>
                    <div className="card-body">
                      <Link to="/registroEquipos" className="btn btn-outline-primary w-100">Administra Registros</Link>
                    </div>
                  </div>
                </div>
                <div className="col-lg-2 col-sm-8 mx-auto  col-12">
                  <div className="card text-center" style={{ maxWidth: "17.5rem" }}>
                    <Link to="/consultapagos">
                      <div className="contImage">
                        <img src={imgPagos} className="d-block w-100 h-auto rounded-top" alt="Pagos" />
                        <div className="overlay small">
                          <div className="textOverlay">Consulta los pagos realizados.</div>
                        </div>
                      </div>
                    </Link>
                    <div className="card-body">
                      <Link to="/consultapagos" className="btn btn-outline-primary w-100">Consulta Pagos</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

export default Perfil;
