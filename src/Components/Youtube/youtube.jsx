import React, { useState, useRef } from "react";
import style from "./youtube.module.css";

const Youtube = () => {
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [videoList, setVideoList] = useState([]);
  const videoRef = useRef(null);

  const handleYoutubeUrlChange = (e) => {
    setYoutubeUrl(e.target.value);
  };

  function transformarURL(link) {
    var id;
    var regex1 = /(?:\?v=|\/embed\/|\.be\/|\/v\/|\/vi\/|\/user\/\S+\/\S+\/|\/e\/|\/embed\/|\/v\/|\/watch\?v=|&v=|youtu\.be\/|\/\d{4}\/\d{1,2}\/\S+)([^#\&\?\n<>\"]+)/;
    var regex2 = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?\n<>\"]+).*/;

    if (regex1.test(link)) {
      id = link.match(regex1)[1];
    } else if (regex2.test(link)) {
      id = link.match(regex2)[7];
    }

    if (id) {
      return "https://www.youtube.com/embed/" + id.substring(0, 11);
    } else {
      return null;
    }
  }

  const handleClick = () => {
    const video = {
      url: youtubeUrl,
      embedCode: transformarURL(youtubeUrl),
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
        className={style.inputStyle}
      />
      <button onClick={handleClick} className={style.buttonStyle}>
        Agregar video
      </button>
      <div>
        {videoList.map((video, index) => (
          <div key={index} className={style.iframeContainer}>
            <iframe 
              title="Musica para entrenar"
              width="580"
              height="298.13"
              src={video.embedCode}
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              ref={index === 0 ? videoRef : null}
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
