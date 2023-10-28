import React from "react";
import Cards from "../component/cards";
import "../../styles/eventos.css";
import basket1 from '../../img/basket1.jpeg';
import basket3 from '../../img/basket3.jpeg';
import basket7 from '../../img/basket7.jpeg';
import basket8 from '../../img/basket8.jpeg';
import { Link } from "react-router-dom";

const Eventos=()=>{
	//modificando
	return (
		<div className="AppEventos text-center">
		<div className="row">
		  <div className="col-12">
			<h1 id="title">Eventos</h1>
			<div className="divider divider-default m-3"></div>
		  </div>
		</div>
		<div className="row">
		  <div className="col-12">
			<Link to="/nextEvent">
				<button id="button-event" type="button" className="btn btn-outline-primary">VER TODOS</button>
			</Link>
		  </div>
		</div>
		<div className="contEventos container">
		  <Cards
			src={basket8}
			day="06 Oct"
			title="JAM ON IT"
			time="06/10/2023 08:00 PM/ "
			location="México"
			description="Torneo de basketball estatal con categorías varoniles y femeniles. Se entregarán medallas a los tres primeros lugares y premios mvp de la categoría."
		  />
  			<Cards
			  src={basket7}
			  day="09 Nov"
			  title="THE BIG GAME"
			  time="09/11/2023 08:00 PM/ "
			  location="San José, Costa Rica"
			  description="Evento de basketball anual nacional en Costa Rica con categorías varoniles y femeniles. Se entregarán medallas a los tres primeros lugares y premios a mvp."
			/>
			<Cards
			  src={basket1}
			  day="21 Sep"
			  title="MIDNIGHT BASKETBALL TOURNAMENT"
			  time="21/09/2023 08:00 PM/ "
			  location="Medellín, Colombia"
			  description="Torneo de basketball nacional en Colombia con categorías varoniles y femeniles. Se entregarán medallas a los tres primeros lugares y premios a mvp."
			/>
			{/*<Cards
			  src={basket3}
			  day="25 Dec"
			  title="THE BIG GAME"
			  time="29/11/2023 08:00 PM/ "
			  location="2816 Cinamon Lane , San Antonio, Tx"
			  description="This event article, used for writing about and listing the events planned for the future on your website.You can edit all of this text from the Pages tab by clicking the edit button."
			/>*/}
		</div>
	  </div>
	);
}

export default Eventos;