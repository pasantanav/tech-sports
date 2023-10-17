import React, { useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import "../../styles/home.css";
import basket from "../../img/basket7.jpeg";
import basket5 from "../../img/basket5.jpeg";
import basket12 from "../../img/basket12.jpg";
import basket13 from "../../img/basket13.jpg";
import basket14 from "../../img/basket14.jpeg";
import basket15 from "../../img/basket15.jpg";
import basket16 from "../../img/basket16.jpg";
import lebron17 from "../../img/lebron17.jpg";
import basket6 from "../../img/basket6.jpeg";
import basket22 from "../../img/basket22.jpeg";
import basket23 from "../../img/basket23.jpeg";
import basket25 from "../../img/basket25.jpeg";
import basket26 from "../../img/basket26.jpeg";
import basket28 from "../../img/basket28.jpeg";
import basket29 from "../../img/basket29.jpeg";
import basket31 from "../../img/basket31.jpeg";
import basket32 from "../../img/basket32.jpeg";
import basket33 from "../../img/basket33.jpeg";
import basket34 from "../../img/basket34.jpeg";
import basket35 from "../../img/basket35.jpeg";
import basket36 from "../../img/basket36.jpeg";
import basket37 from "../../img/basket37.jpeg";
import mascotas from "../../img/mascotas.jpeg";
import mascotas2 from "../../img/mascotas2.jpeg";
import mascotas3 from "../../img/mascotas3.jpeg";
import mascotas4 from "../../img/mascotas4.jpeg";
import mascotas5 from "../../img/mascotas5.jpeg";
import mascotas6 from "../../img/mascotas6.jpeg";
import mascotas7 from "../../img/mascotas7.jpeg";

const Galeria = () => {
  const [open, setOpen] = React.useState(false);
  const images = [

    { id: "basket5", src: require("../../img/basket5.jpeg"), alt: "Gallery basket 1" },
    { id: "basket12", src: require("../../img/basket12.jpg"), alt: "Gallery basket 12" },
    { id: "basket13", src: require("../../img/basket13.jpg"), alt: "Gallery basket 13" },
    { id: "basket14", src: require("../../img/basket14.jpeg"), alt: "Gallery basket 14" },
    { id: "basket15", src: require("../../img/basket15.jpg"), alt: "Gallery basket 15" },
    { id: "basket31", src: require("../../img/basket31.jpeg"), alt: "Gallery image 31" },
    { id: "basket34", src: require("../../img/basket34.jpeg"), alt: "Gallery image 17" },
    { id: "mascotas3", src: require("../../img/mascotas3.jpeg"), alt: "mascotas3" },
  ]

  return (
    <div className="contSuperior container">
      <div className="ecommerce-gallery" data-mdb-zoom-effect="true" data-mdb-auto-height="true">
        <div className="row">
          <div style={{ textAlign: "center" }} className="col-12">
            <h1>Galería</h1>
            <div className="divider divider-default m-3"></div>
          </div>
        </div>
        <div className="row py-3 shadow-5">
          {images.map((image, index) => (
            <img
              key={index}
              id={image.id}
              src={image.src.default}
              alt={image.alt}
              style={{padding:"1%"}}
              className="ecommerce-gallery-main-img active w-25"
            />
          ))}

   

          <button className="btn btn-primary" style={{ height: "100%", margin: "-118", display: "flex", justifyContent: "center", alignItems: "center", marginTop: "2rem" }} type="button" onClick={() => setOpen(true)}>
            Ver más
          </button>
        </div>

      </div>
                


      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={[
          { src: lebron17 },
          { src: basket34 },
          { src: basket15 },
          { src: basket25 },
          { src: basket26 },
          { src: basket22 },
          { src: basket23 },
          { src: basket25 },
          { src: basket28 },
          { src: basket29 },
          { src: basket31 },
          { src: basket32 },
          { src: basket35 },
          { src: basket36 },
          { src: basket37 },
          { src: mascotas },
          { src: mascotas2 },
          { src: mascotas3 },
          { src: mascotas4 },
          { src: mascotas5 },
          { src: mascotas6 },
          { src: mascotas7 },
          { src: basket33 }
        ]}
      />
    </div>
  );
}

export default Galeria;
