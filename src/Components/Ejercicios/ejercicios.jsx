import React, { useState } from "react";
import style from "./ejercicios.module.css"

const Ejercicios = ({ handleAddExercises, currentRound }) => {
  const [exercises, setExercises] = useState([]);
  const [inputExercise, setInputExercise] = useState("");

  const addExercise = () => {
    if (inputExercise.trim() !== "") {
      const newExercises = inputExercise.split("\n").map((exercise) => exercise.trim());
      setExercises([...exercises, ...newExercises]);
      setInputExercise("");
    }
  };

  const removeExercise = (index) => {
    const updatedExercises = [...exercises];
    updatedExercises.splice(index, 1);
    setExercises(updatedExercises);
  };

  return (
    <div>
      <h4>Agregar ejercicios</h4>
      <div className={style.containertxtarea}>
        <textarea
          value={inputExercise}
          placeholder="Agregue uno o varios ejercicios (uno por línea)"
          onChange={(e) => setInputExercise(e.target.value)}
        />
        <button onClick={addExercise}>Agregar</button>
      </div>
      <div>
        {exercises?.map((e, i) => (
          <div key={i}>
            <p>{i + 1}- {e}</p>
            <button onClick={() => removeExercise(i)}>x</button>
          </div>
        ))}
      </div>
      {exercises.length ? (
        <div className={style.ejercicios}>
          {exercises?.map((e, i) => (
            <div key={i}>
              <p className={`${style.ejercicio} ${i + 1 === currentRound ? style.currentRound : ""}`}>
                {i + 1}- {e}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div></div>
      )}
      <button onClick={() => handleAddExercises(exercises)}>Coordinar con el tabata</button>
    </div>
  );
};

export default Ejercicios;
