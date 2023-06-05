import React, { useState, useEffect } from "react";
import inicioEjercicioSound from "./Inicio ejercicio.mp3";
import inicioDescansoSound from "./Inicio descanso.mp3";
import cuentaRegresivaSound from "./cuenta regresiva.mp3";
import inicioDescansoLargoSound from "./inicio desansolargo.mp3";
import aplausosSound from "./aplausos.mp3";
import style from "./tabata.module.css";
import Ejercicios from "../Ejercicios/ejercicios";

const Tabata = () => {
  //Estados de configuración
  const [preparationTime, setPreparationTime] = useState(5);
  const [workTime, setWorkTime] = useState(20);
  const [restTime, setRestTime] = useState(15);
  const [roundsPerBlock, setRoundsPerBlock] = useState(8);
  const [totalBlocks, setTotalBlocks] = useState(4);
  const [blockRestTime, setBlockRestTime] = useState(120);
  //
  const [currentBlock, setCurrentBlock] = useState(1);
  const [currentRound, setCurrentRound] = useState(1);
  const [currentInterval, setCurrentInterval] = useState("Preparacion");
  const [timer, setTimer] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(preparationTime);
  const [totalTimeRemaining, setTotalTimeRemaining] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [reset, setReset] = useState(false)

  const inicioEjercicioAudio = new Audio(inicioEjercicioSound);
  const inicioDescansoAudio = new Audio(inicioDescansoSound);
  const inicioDescansoLargoAudio = new Audio(inicioDescansoLargoSound);
  const aplausos = new Audio(aplausosSound);
  const cuentaRegresivaAudio = new Audio(cuentaRegresivaSound);
  
  useEffect(() => {
    setTimeRemaining(preparationTime);
  }, [preparationTime]);
  
  useEffect(() => {
    const totalDuration =
    preparationTime * 1000 +
    (workTime + restTime) * roundsPerBlock * totalBlocks * 1000 +
    blockRestTime * (totalBlocks - 1) * 1000;
    setTotalTimeRemaining(totalDuration / 1000);

    const now = new Date();
    const endTimeDate = new Date(now.getTime() + totalDuration);
    setEndTime(endTimeDate.toLocaleTimeString());
  }, [
    preparationTime,
    workTime,
    restTime,
    roundsPerBlock,
    totalBlocks,
    blockRestTime,
    reset,
  ]);

  const startTimer = () => {
    if (timer) return;
    
    setTimer(
      setInterval(() => {
        setTimeRemaining((prevTime) => {
          const newTime = prevTime - 1;
          setTotalTimeRemaining((prevTotalTime) => prevTotalTime - 1);
          if (newTime <= 3 && newTime > 0) {
            cuentaRegresivaAudio.play();
          }
          return newTime;
        });
      }, 1000)
      );
    };
    
    const pauseTimer = () => {
      clearInterval(timer);
      setTimer(null);
    };
    
    const resetTimer = () => {
      clearInterval(timer);
      setTimer(null);
      setTimeRemaining(preparationTime);
      setCurrentBlock(1);
      setCurrentRound(1);
      setCurrentInterval("Preparacion");
      setTotalTimeRemaining(null);
      setEndTime(null);
      setReset(!reset)
    };

  useEffect(() => {
    if (timeRemaining === 0) {
      if (currentInterval === "Preparacion") {
        inicioEjercicioAudio.play();
        setTimeRemaining(workTime);
        setCurrentInterval("ejercicio");
      } else if (currentInterval === "ejercicio") {
        inicioDescansoAudio.play();
        setCurrentInterval("descanso");
        setTimeRemaining(restTime);
        if (currentRound < roundsPerBlock) {
          setCurrentRound((prevRound) => prevRound + 1);
        } else {
          if (currentBlock < totalBlocks) {
            setCurrentBlock((prevBlock) => prevBlock + 1);
            setCurrentRound(1);
            inicioDescansoLargoAudio.play();
            setCurrentInterval("descansoEntreBloques");
            setTimeRemaining(blockRestTime);
          } else {
            clearInterval(timer);
            aplausos.play();
            setCurrentInterval("FIN");
            setTimeRemaining(null);
          }
        }
      } else if (
        currentInterval === "descanso" ||
        currentInterval === "descansoEntreBloques"
      ) {
        inicioEjercicioAudio.play();
        setCurrentInterval("ejercicio");
        setTimeRemaining(workTime);
      }
    }
  }, [
    timeRemaining,
    currentInterval,
    currentBlock,
    currentRound,
    preparationTime,
    workTime,
    restTime,
    roundsPerBlock,
    totalBlocks,
    blockRestTime,
    timer,
  ]);

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes < 10 ? "0" : ""}${minutes}:${
      seconds < 10 ? "0" : ""
    }${seconds}`;
  };

  const handleAddExercises = (exercises) => {
    setRoundsPerBlock(exercises.length);
  };

  const calculateTotalProgress = () => {
    const totalDuration1 =
      preparationTime * 1000 +
      (workTime + restTime) * roundsPerBlock * totalBlocks * 1000 +
      blockRestTime * (totalBlocks - 1) * 1000;

    const elapsedTime = totalDuration1 - totalTimeRemaining * 1000;

    return (elapsedTime / totalDuration1) * 100;
  };

  return (
    <div
      className={`${style.container} ${style[currentInterval.toLowerCase()]}`}
    >
      <div className={style.intervalContainer}>
        <h2 className={style.intervalTitle}>
          {currentInterval === "FIN"
            ? "FIN"
            : `Bloque ${currentBlock}/${totalBlocks} - Ejercicio ${currentRound}/${roundsPerBlock}`}
        </h2>
        {timeRemaining !== null && (
          <h3 className={style.timeRemaining}>{timeRemaining}</h3>
        )}
      </div>
          <div className={style.progressBarContainer}>
            <div
              className={style.progressBarFill}
              style={{ width: `${calculateTotalProgress()}%` }}
            ></div>
          </div>
      <div className={style.totalTimeContainer}>
        <h4 className={style.totalTimeTitle}>Tiempo total:</h4>
        {totalTimeRemaining !== null && (
          <h3 className={style.totalTime}>
            {formatTime(totalTimeRemaining)} - {endTime}
          </h3>
        )}
      </div>
      <div className={style.buttonsContainer}>
        <button
          className={`${style.startButton} ${style.button}`}
          onClick={startTimer}
        >
          Start
        </button>
        <button
          className={`${style.pauseButton} ${style.button}`}
          onClick={pauseTimer}
        >
          Pause
        </button>
        <button
          className={`${style.resetButton} ${style.button}`}
          onClick={resetTimer}
        >
          Reset
        </button>
      </div>
      <div className={style.settingsContainer}>
        <h4>Preperación</h4>
        <input
          type="number"
          min="0"
          value={preparationTime}
          onChange={(e) => setPreparationTime(parseInt(e.target.value))}
        />
      </div>
      <div className={style.settingsContainer}>
        <h4>Ejercicio</h4>
        <input
          type="number"
          min="0"
          value={workTime}
          onChange={(e) => setWorkTime(parseInt(e.target.value))}
        />
      </div>
      <div className={style.settingsContainer}>
        <h4>Descanso</h4>
        <input
          type="number"
          min="0"
          value={restTime}
          onChange={(e) => setRestTime(parseInt(e.target.value))}
        />
      </div>
      <div className={style.settingsContainer}>
        <h4>Estaciones</h4>
        <input
          type="number"
          min="0"
          value={roundsPerBlock}
          onChange={(e) => setRoundsPerBlock(parseInt(e.target.value))}
        />
      </div>
      <div className={style.settingsContainer}>
        <h4>Bloques</h4>
        <input
          type="number"
          min="0"
          value={totalBlocks}
          onChange={(e) => setTotalBlocks(parseInt(e.target.value))}
        />
      </div>
      <div className={style.settingsContainer}>
        <h4>Descanso entre bloques</h4>
        <input
          type="number"
          min="0"
          value={blockRestTime}
          onChange={(e) => setBlockRestTime(parseInt(e.target.value))}
        />
      </div>
      <div className={style.settingsContainer}>
        <Ejercicios
          handleAddExercises={handleAddExercises}
          currentRound={currentRound}
        />
      </div>
    </div>
  );
};

export default Tabata;
