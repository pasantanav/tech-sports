import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
//import { BackendURL } from "./component/backendURL";

import { Home } from "./pages/home";

import { Servicios } from "./pages/servicios";
import RecoverPassword from "./pages/recoverPassword.js"
//import { Single } from "./pages/single";
//import Payment from "./pages/payment";
import injectContext from "./store/appContext";
import { Navbar } from "./component/navbar";
import { Footer } from "./component/footer";
import Eventos from "./pages/eventos";
import Galeria from "./component/galeria";
import Perfil from "./pages/perfil";
import ContactPage from "./pages/contacto";
import AccountPage from "./pages/cuenta";
import NextEvent from "./component/nextEvent";
import Registrarse from "./component/registrarse";
import Organizadores from "./pages/organizadores";
//import UserProfile from "./pages/perfil";
import TeamList from "./pages/equiposparticipantes";
import UserPage from "./pages/perfil";
import PerfilOrganizador from "./pages/perfilorganizador";
import EventoLista from "./pages/eventoLista";
import TeamLista from "./pages/teamlist";
//import ModalTeams from "./component/modalteams";
import RegistroEquipos from "./pages/registroEquipos";

//create your first component
const Layout = () => {
    //the basename is used when your project is published in a subdirectory and not in the root of the domain
    // you can set the basename on the .env file located at the root of this project, E.g: BASENAME=/react-hello-webapp/
    const basename = process.env.BASENAME || "";

    //if(!process.env.BACKEND_URL || process.env.BACKEND_URL == "") return <BackendURL/ >;

    return (
        <div>
            <BrowserRouter basename={basename}>
                <ScrollToTop>
                    <Navbar />
                    <Routes>
                        <Route element={<TeamList />} path="/teams" />
                        <Route element={<RecoverPassword/>} path="/changepassword" />
                        <Route element={<Home />} path="/" />
                        <Route element={<Servicios />} path="/servicios" />
                        <Route element={<h1>Not found!</h1>} />
                        <Route element={<Eventos />} path="/eventos" />
                        <Route element={<Galeria />} path="/galeria" />
                        <Route element={<Perfil />} path="/perfil" />
                        <Route element={<ContactPage />} path="/contacto" />
                        <Route element={<AccountPage />} path="/cuenta" />
                        <Route element={<NextEvent />} path="/nextEvent" />
                        <Route element={<Registrarse />} path="/registrarse/:index" />
                        <Route element={<Organizadores />} path="/organizadores" />
                        <Route element={<PerfilOrganizador />} path="/perfilorganizador" />
                        <Route element={<Perfil />} path="/perfil" />
                        <Route element={<EventoLista />} path="/eventolista/:id" />
                        <Route element={<TeamLista />} path="/teamlist" />
                        <Route element={<RegistroEquipos />} path="/registroEquipos" />
                        {/*<Route element={<ModalTeams />} path="/modalteams" />*/}
                    </Routes>
                    <Footer />
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);