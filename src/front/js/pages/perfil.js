import React, { useContext, useState, useEffect } from 'react';
import { BrowserRouter as Router, Link, useNavigate } from 'react-router-dom';
import { Context } from "../store/appContext";
import tournament from "../../img/perfil/tournament.jpg";
import teamlist from "../../img/perfil/teamlist.jpg";
import eventlist from "../../img/perfil/eventlist.jpg";
import imgLogo from "../../img/LogoTS.jpg";
import imgRegistros from "../../img/perfil/registros.jpg";
import imgPagos from "../../img/perfil/pagos.jpg";
import * as filestack from 'filestack-js';
import "../../styles/perfil.css";
import { Modal, Button, Form } from 'react-bootstrap';

const Perfil = ()=>{
  const { store, actions } = useContext(Context);
  const [userData, setUserData] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const profileData = {...store.userInfo};
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
 // Manejar la selección de archivos y actualización de imagen de perfil
 useEffect(()=>{
  setProfileImage(profileData.url_perfil)
}, [profileData.url_perfil]);
  
  //cuando cargue llamamos a getuserinfo y enviamos la data al userData
  useEffect(() => {
    if (store.accessToken) {
      actions.getUserInfo().then(data => {
        setUserData(data);
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

  
  
  const handleEditProfile = (e) => {
    e.preventDefault();
    
    const updatedProfileData = {
      name,
      email,
      phone,
      address
    };
  
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
      console.error(error) ;
    });
  };
  


  const handleOpenFilePicker = () => {
    const options = {
      onUploadDone: (res) => {
        const newImageUrl = res.filesUploaded[0].url;
        //console.log('la URL de la imagen es:', newImageUrl)
        actions.updateProfileImage(newImageUrl).then(()=>{

          setProfileImage(newImageUrl);
        }).catch(error=>{
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
                  src={profileImage==""? imgLogo: profileImage}
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
            <div className="card mb-4 mb-lg-0">
              <div className="card-body p-0">
                <ul className="list-group list-group-flush rounded-3">
                  <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                    <i className="fas fa-globe fa-lg text-warning"></i>
                    <p className="mb-0">https://mdbootstrap.com</p>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                    <i className="fab fa-github fa-lg" style={{ color: '#333333' }}></i>
                    <p className="mb-0">mdbootstrap</p>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                    <i className="fab fa-twitter fa-lg" style={{ color: '#55acee' }}></i>
                    <p className="mb-0">@mdbootstrap</p>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                    <i className="fab fa-instagram fa-lg" style={{ color: '#ac2bac' }}></i>
                    <p className="mb-0">mdbootstrap</p>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center p-3">
                    <i className="fab fa-facebook-f fa-lg" style={{ color: '#3b5998' }}></i>
                    <p className="mb-0">mdbootstrap</p>
                  </li>
                </ul>
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
                
                <hr />
                <div className='text-center'>
                <button type="button" className="btn btn-primary" onClick={openEditModal}>
                Editar Datos
              </button>
        

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
                            onChange={(e) => setEmail(e.target.value)}
                          />
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
                        <Button variant="primary" type="submit">
                          Guardar Cambios
                        </Button>
                      </Form>
                    </Modal.Body>
                  </Modal>
                </div>
              </div>
            </div>
            <div className="col-lg-4 w-100">
              <div className="card d-flex mb-4">
                {/*<div className="card-body d-flex justify-content-between align-items-stretch">*/}
                <div className="card-body d-flex justify-content-between">
                    <div className="col">
                      <div className="card text-center" style={{maxWidth: "17.5rem"}}>
                        <Link to={"/eventolista/"+profileData.userId}>
                          <div className="contImage">
                            <img src={tournament} className="d-block w-100 h-auto" alt="Eventos"/>
                            <div className="overlay">
                              <div className="textOverlay">Crea, modifica o elimina tus eventos.</div>
                            </div>
                          </div>
                        </Link>
                        <div className="card-body">  
                          <div>
                            <Link to={"/eventolista/"+profileData.userId}>
                              <button className="btn btn-outline-primary w-100">Administrar Eventos</button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col mx-2">
                      <div className="card text-center" style={{maxWidth: "17.5rem"}}>
                        <Link to="/teamlist">
                          <div className="contImage">
                            <img src={teamlist} className="d-block w-100 h-auto" alt="Equipos"/>
                            <div className="overlay">
                              <div className="textOverlay">Crea, modifica o elimina tus equipos.</div>
                            </div>
                          </div>
                        </Link>
                        <div className="card-body">
                          <Link to="/teamlist" className="btn btn-outline-primary w-100">Administrar Equipos</Link>
                        </div>
                      </div>
                    </div>
                    <div className="col">
                      <div className="card text-center" style={{maxWidth: "17.5rem"}}>
                        <Link to="/nextEvent">
                          <div className="contImage">
                            <img src={eventlist} className="d-block w-100 h-auto" alt="Registrar"/>
                            <div className="overlay">
                              <div className="textOverlay">Consulta los eventos y paga.</div>
                            </div>
                          </div>
                        </Link>
                        <div className="card-body">
                          <Link to="/nextEvent" className="btn btn-outline-primary w-100">Registrar Equipos</Link>
                        </div>
                      </div>
                    </div>
                    <div className="col mx-2">
                      <div className="card text-center" style={{maxWidth: "17.5rem"}}>
                        <Link to="/registroEquipos">
                            <div className="contImage">
                              <img src={imgRegistros} className="d-block w-100 h-auto" alt="Registros"/>
                              <div className="overlay">
                                <div className="textOverlay">Registra equipos a eventos.</div>
                              </div>
                            </div>
                          </Link>
                          <div className="card-body">
                            <Link to="/registroEquipos" className="btn btn-outline-primary w-100">Administrar Registros</Link>
                          </div>
                      </div>
                    </div>
                    <div className="col">
                      <div className="card text-center" style={{maxWidth: "17.5rem"}}>
                        <Link to="/consultapagos">
                          <div className="contImage">
                            <img src={imgPagos} className="d-block w-100 h-auto" alt="Pagos"/>
                            <div className="overlay">
                              <div className="textOverlay">Consulta los pagos realizados.</div>
                            </div>
                          </div>
                        </Link>
                        <div className="card-body">
                          <Link to="/consultapagos" className="btn btn-outline-primary w-100">Consultar Pagos</Link>
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
