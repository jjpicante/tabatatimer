import React, { useState } from "react";
import style from "./youtube.module.css"

const Youtube = () => {
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [videoList, setVideoList] = useState([]);

  const handleYoutubeUrlChange = (e) => {
    setYoutubeUrl(e.target.value);
  };

  const transformarURL = (url) => {
    const fragmentoReemplazado = "/watch?v=";
    const fragmentoNuevo = "/embed/";

    const indiceReemplazo = url.indexOf(fragmentoReemplazado);
    if (indiceReemplazo === -1) {
      // El fragmento a reemplazar no se encuentra en la URL
      return url;
    }

    var nuevaURL = url.replace(fragmentoReemplazado, fragmentoNuevo);

    // Eliminar cualquier contenido adicional después de los 11 caracteres siguientes a "/embed/"
    const indiceAmpersand = nuevaURL.indexOf("&");
    if (indiceAmpersand !== -1) {
      nuevaURL = nuevaURL.substring(0, indiceAmpersand);
    }

    return nuevaURL;
  };

  const handleClick = () => {
    const video = {
      url: youtubeUrl,
      embedCode: (
        <iframe
          title="Musica para entrenar"
          width="580"
          height="300"
          src={transformarURL(youtubeUrl)}
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      )
    };
    setVideoList([...videoList, video]);
    setYoutubeUrl("");
  };

  const handleDelete = (index) => {
    const updatedVideoList = [...videoList];
    updatedVideoList.splice(index, 1);
    setVideoList(updatedVideoList);
  };

  return (
    <div className={style.container}>
      <h4>Música de YouTube</h4>
      <input
        type="text"
        value={youtubeUrl}
        onChange={handleYoutubeUrlChange}
        placeholder="Ingrese la URL del video de YouTube"
        className={style.inputStyle} // Agrega la clase CSS al input
      />
      <button onClick={handleClick} className={style.buttonStyle}>Agregar video</button>
      <div>
        {videoList.map((video, index) => (
          <div key={index}>
            {video.embedCode}
            <button onClick={() => handleDelete(index)}>X</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Youtube;
