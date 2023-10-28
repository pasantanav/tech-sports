import React, { Component } from "react";
import "../../styles/footer.css";
import { Link } from "react-router-dom";
let menu = [
	{label: 'Inicio', url: '/'},
	{label: 'Servicios', url: '/servicios'},
	{label: 'Eventos', url: '/eventos'},
	{label: 'Galería', url: '/galeria'},
	{label: 'Organizadores', url: '/organizadores'},
	{label: 'Contacto', url: '/contacto'},
	{label: 'Cuenta', url: '/cuenta'}
];

export const Footer = () => (
	<footer className="pie  bg-light border-top font-small " style={{paddingLeft:"0px"}}>
		<div className="d-flex justify-content-end">
			<ul className="nav col-md-5 text-end">
				{menu.map((item) => {
					return (
						<li className="nav-item" key={item.label}>
							<a href={item.url} className="nav-link px-2 text-body-secondary">{item.label}</a>
						</li>
					);
				})}
			</ul>
		</div>
		<Link to="/">
			<div className="d-flex justify-content-center footer-copyright text-center align-items-center py-1" style={{ background: "#0D6EFD", color:"white"}}>© 2023 TechSports, Inc.</div>
		</Link>
	</footer>
);