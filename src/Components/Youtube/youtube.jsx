import React, { useState } from "react";
import style from "./youtube.module.css";

// Extrae el ID de un video de YouTube desde las formas más comunes de URL
// (watch?v=, youtu.be/, /embed/, /shorts/) y devuelve la URL de embed o null.
function transformarURL(link) {
  try {
    const url = new URL(link.trim());
    const host = url.hostname.replace(/^www\./, "");
    let id = null;

    if (host === "youtu.be") {
      id = url.pathname.slice(1);
    } else if (host.endsWith("youtube.com")) {
      if (url.searchParams.get("v")) {
        id = url.searchParams.get("v");
      } else {
        const match = url.pathname.match(/\/(embed|shorts|v)\/([^/?]+)/);
        if (match) id = match[2];
      }
    }

    if (id && /^[A-Za-z0-9_-]{11}$/.test(id)) {
      return "https://www.youtube.com/embed/" + id;
    }
    return null;
  } catch {
    return null;
  }
}

const Youtube = () => {
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [videoList, setVideoList] = useState([]);
  const [error, setError] = useState("");

  const handleYoutubeUrlChange = (e) => {
    setYoutubeUrl(e.target.value);
    if (error) setError("");
  };

  const handleClick = () => {
    const embedCode = transformarURL(youtubeUrl);
    if (!embedCode) {
      setError("URL de YouTube no válida.");
      return;
    }
    setVideoList([...videoList, { id: `${Date.now()}`, embedCode }]);
    setYoutubeUrl("");
  };

  const handleDelete = (index) => {
    setVideoList(videoList.filter((_, i) => i !== index));
  };

  return (
    <div className={style.container}>
      <h4>Música de YouTube</h4>
      <input
        type="text"
        value={youtubeUrl}
        onChange={handleYoutubeUrlChange}
        placeholder="Ingrese la URL del video de YouTube"
        className={style.inputStyle}
      />
      <button onClick={handleClick} className={style.buttonStyle}>
        Agregar video
      </button>
      {error && <p className={style.error}>{error}</p>}
      <div>
        {videoList.map((video, index) => (
          <div key={video.id} className={style.iframeContainer}>
            <iframe
              title="Musica para entrenar"
              src={video.embedCode}
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
            <button onClick={() => handleDelete(index)} className={style.deleteButton}>
              X
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Youtube;
