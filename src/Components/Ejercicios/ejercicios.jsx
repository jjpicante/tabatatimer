import React, { useState } from "react";
import style from "./ejercicios.module.css";

const Ejercicios = ({ exercises, setExercises, handleAddExercises, currentRound }) => {
  const [inputExercise, setInputExercise] = useState("");

  const addExercise = () => {
    if (inputExercise.trim() !== "") {
      const newExercises = inputExercise
        .split("\n")
        .map((exercise) => exercise.trim())
        .filter((exercise) => exercise !== "");
      setExercises([...exercises, ...newExercises]);
      setInputExercise("");
    }
  };

  const removeExercise = (index) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  return (
    <div className={style.wrapper}>
      <h4 className={style.heading}>Ejercicios</h4>
      <div className={style.containertxtarea}>
        <textarea
          className={style.textarea}
          value={inputExercise}
          placeholder="Agregá uno o varios ejercicios (uno por línea)"
          onChange={(e) => setInputExercise(e.target.value)}
        />
        <button className={style.addButton} onClick={addExercise}>
          Agregar
        </button>
      </div>

      {exercises.length > 0 && (
        <ul className={style.list}>
          {exercises.map((e, i) => (
            <li
              key={`${i}-${e}`}
              className={`${style.item} ${
                i + 1 === currentRound ? style.currentRound : ""
              }`}
            >
              <span className={style.itemIndex}>{i + 1}</span>
              <span className={style.itemName}>{e}</span>
              <button
                className={style.removeButton}
                aria-label={`Quitar ${e}`}
                onClick={() => removeExercise(i)}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}

      {exercises.length > 0 && (
        <button
          className={style.syncButton}
          onClick={() => handleAddExercises(exercises)}
        >
          Usar {exercises.length} ejercicios como estaciones
        </button>
      )}
    </div>
  );
};

export default Ejercicios;
