import React, { useState, useEffect, useRef } from "react";
import inicioEjercicioSound from "./Inicio ejercicio.mp3";
import inicioDescansoSound from "./Inicio descanso.mp3";
import cuentaRegresivaSound from "./cuenta regresiva.mp3";
import inicioDescansoLargoSound from "./inicio desansolargo.mp3";
import aplausosSound from "./aplausos.mp3";
import style from "./tabata.module.css";
import Ejercicios from "../Ejercicios/ejercicios";

// Convierte el value de un input numérico en un entero >= 0 (evita NaN al vaciar el campo)
const toNonNegativeInt = (value) => {
  const parsed = parseInt(value, 10);
  return Number.isNaN(parsed) ? 0 : Math.max(0, parsed);
};

const TICK_MS = 200;

const Tabata = () => {
  //Estados de configuración
  const [preparationTime, setPreparationTime] = useState(5);
  const [workTime, setWorkTime] = useState(30);
  const [restTime, setRestTime] = useState(15);
  const [roundsPerBlock, setRoundsPerBlock] = useState(10);
  const [totalBlocks, setTotalBlocks] = useState(4);
  const [blockRestTime, setBlockRestTime] = useState(120);
  //
  const [currentBlock, setCurrentBlock] = useState(1);
  const [currentRound, setCurrentRound] = useState(1);
  const [currentInterval, setCurrentInterval] = useState("Preparacion");
  const [running, setRunning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(preparationTime);
  const [totalTimeRemaining, setTotalTimeRemaining] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [reset, setReset] = useState(false);

  // Lista de ejercicios (fuente de verdad, antes vivía en Redux/Ejercicios)
  const [exercises, setExercises] = useState([]);
  const currentExercise = exercises[currentRound - 1];

  // Los objetos Audio se crean una sola vez (antes se recreaban en cada render)
  const audiosRef = useRef(null);
  if (audiosRef.current === null) {
    audiosRef.current = {
      inicioEjercicio: new Audio(inicioEjercicioSound),
      inicioDescanso: new Audio(inicioDescansoSound),
      inicioDescansoLargo: new Audio(inicioDescansoLargoSound),
      aplausos: new Audio(aplausosSound),
      cuentaRegresiva: new Audio(cuentaRegresivaSound),
    };
  }
  const audios = audiosRef.current;

  const play = (audio) => {
    audio.currentTime = 0;
    audio.play().catch(() => {});
  };

  const intervalRef = useRef(null);
  const phaseDeadlineRef = useRef(null); // timestamp en que termina la fase actual
  const totalDeadlineRef = useRef(null); // timestamp en que termina toda la sesión
  const lastPhaseSecondRef = useRef(preparationTime);
  const lastTotalSecondRef = useRef(null);

  // Duración total de la sesión, en segundos
  const computeTotalDuration = () =>
    preparationTime +
    (workTime + restTime) * roundsPerBlock * totalBlocks +
    blockRestTime * (totalBlocks - 1);

  // Al cambiar la preparación (estando detenido) sincronizamos el display
  useEffect(() => {
    if (!running) {
      setTimeRemaining(preparationTime);
      lastPhaseSecondRef.current = preparationTime;
    }
  }, [preparationTime, running]);

  // Recalcula tiempo total y hora estimada de fin cuando cambia la config
  useEffect(() => {
    const totalDurationSec = computeTotalDuration();
    setTotalTimeRemaining(totalDurationSec);
    lastTotalSecondRef.current = totalDurationSec;

    const endTimeDate = new Date(Date.now() + totalDurationSec * 1000);
    setEndTime(endTimeDate.toLocaleTimeString());
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    if (running || currentInterval === "FIN") return;
    const now = Date.now();
    phaseDeadlineRef.current = now + (timeRemaining ?? 0) * 1000;
    totalDeadlineRef.current = now + (totalTimeRemaining ?? 0) * 1000;
    setRunning(true);
  };

  const pauseTimer = () => {
    setRunning(false);
  };

  const resetTimer = () => {
    setRunning(false);
    setTimeRemaining(preparationTime);
    lastPhaseSecondRef.current = preparationTime;
    setCurrentBlock(1);
    setCurrentRound(1);
    setCurrentInterval("Preparacion");
    setEndTime(null);
    phaseDeadlineRef.current = null;
    totalDeadlineRef.current = null;
    setReset((prev) => !prev);
  };

  // Motor del cronómetro: mide contra el reloj real para no acumular deriva
  // ni frenarse cuando la pestaña pasa a segundo plano.
  useEffect(() => {
    if (!running) return;

    const tick = () => {
      const now = Date.now();

      const totalRemaining = Math.max(
        0,
        Math.ceil((totalDeadlineRef.current - now) / 1000)
      );
      if (totalRemaining !== lastTotalSecondRef.current) {
        lastTotalSecondRef.current = totalRemaining;
        setTotalTimeRemaining(totalRemaining);
      }

      const phaseRemaining = Math.max(
        0,
        Math.ceil((phaseDeadlineRef.current - now) / 1000)
      );
      if (phaseRemaining !== lastPhaseSecondRef.current) {
        lastPhaseSecondRef.current = phaseRemaining;
        setTimeRemaining(phaseRemaining);
        if (phaseRemaining <= 3 && phaseRemaining > 0) {
          play(audios.cuentaRegresiva);
        }
      }
    };

    intervalRef.current = setInterval(tick, TICK_MS);
    return () => clearInterval(intervalRef.current);
  }, [running]); // eslint-disable-line react-hooks/exhaustive-deps

  // Máquina de estados: avanza de fase cuando el tiempo llega a 0
  useEffect(() => {
    if (!running || timeRemaining !== 0) return;

    // Arranca la nueva fase con la duración indicada y realinea el deadline real
    const beginPhase = (interval, seconds) => {
      setCurrentInterval(interval);
      setTimeRemaining(seconds);
      lastPhaseSecondRef.current = seconds;
      phaseDeadlineRef.current = Date.now() + seconds * 1000;
    };

    if (currentInterval === "Preparacion") {
      play(audios.inicioEjercicio);
      beginPhase("ejercicio", workTime);
    } else if (currentInterval === "ejercicio") {
      if (currentRound < roundsPerBlock) {
        play(audios.inicioDescanso);
        setCurrentRound((prev) => prev + 1);
        beginPhase("descanso", restTime);
      } else if (currentBlock < totalBlocks) {
        play(audios.inicioDescansoLargo);
        setCurrentBlock((prev) => prev + 1);
        setCurrentRound(1);
        beginPhase("descansoEntreBloques", blockRestTime);
      } else {
        play(audios.aplausos);
        setRunning(false);
        setCurrentInterval("FIN");
        setTimeRemaining(null);
        phaseDeadlineRef.current = null;
      }
    } else if (
      currentInterval === "descanso" ||
      currentInterval === "descansoEntreBloques"
    ) {
      play(audios.inicioEjercicio);
      beginPhase("ejercicio", workTime);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, timeRemaining, currentInterval, currentBlock, currentRound]);

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes < 10 ? "0" : ""}${minutes}:${
      seconds < 10 ? "0" : ""
    }${seconds}`;
  };

  const handleAddExercises = (list) => {
    if (list.length > 0) setRoundsPerBlock(list.length);
  };

  const calculateTotalProgress = () => {
    const totalDuration = computeTotalDuration();
    if (!totalDuration || totalTimeRemaining === null) return 0;
    const elapsed = totalDuration - totalTimeRemaining;
    return Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
  };

  const settings = [
    { label: "Preparación", value: preparationTime, setter: setPreparationTime },
    { label: "Ejercicio", value: workTime, setter: setWorkTime },
    { label: "Descanso", value: restTime, setter: setRestTime },
    { label: "Estaciones", value: roundsPerBlock, setter: setRoundsPerBlock },
    { label: "Bloques", value: totalBlocks, setter: setTotalBlocks },
    {
      label: "Descanso entre bloques",
      value: blockRestTime,
      setter: setBlockRestTime,
    },
  ];

  return (
    <div
      className={`${style.container} ${style[currentInterval.toLowerCase()]}`}
    >
      <div className={style.intervalContainer}>
        <span className={style.intervalTitle}>
          {currentInterval === "FIN"
            ? "¡Completado!"
            : `Bloque ${currentBlock}/${totalBlocks} · Ejercicio ${currentRound}/${roundsPerBlock}`}
        </span>
        {currentExercise && (
          <h1 className={style.exercise}>{currentExercise}</h1>
        )}
        {timeRemaining !== null ? (
          <div className={style.timeRemaining}>{timeRemaining}</div>
        ) : (
          <div className={style.finMark}>🏁</div>
        )}
        <span className={style.phaseTag}>
          {currentInterval === "Preparacion" && "Preparación"}
          {currentInterval === "ejercicio" && "Ejercicio"}
          {currentInterval === "descanso" && "Descanso"}
          {currentInterval === "descansoEntreBloques" && "Descanso entre bloques"}
          {currentInterval === "FIN" && "Buen trabajo"}
        </span>
      </div>
      <div className={style.progressBarContainer}>
        <div
          className={style.progressBarFill}
          style={{ width: `${calculateTotalProgress()}%` }}
        ></div>
      </div>
      <div className={style.totalTimeContainer}>
        <span className={style.totalTimeTitle}>Tiempo restante</span>
        {totalTimeRemaining !== null && (
          <span className={style.totalTime}>
            {formatTime(totalTimeRemaining)}
            {endTime && <em className={style.endTime}>termina {endTime}</em>}
          </span>
        )}
      </div>
      <div className={style.buttonsContainer}>
        <button className={style.startButton} onClick={startTimer}>
          ▶ Iniciar
        </button>
        <button className={style.pauseButton} onClick={pauseTimer}>
          ❚❚ Pausar
        </button>
        <button className={style.resetButton} onClick={resetTimer}>
          ↺ Reiniciar
        </button>
      </div>
      <div className={style.settingsGrid}>
        {settings.map(({ label, value, setter }) => (
          <label className={style.settingCard} key={label}>
            <span className={style.settingLabel}>{label}</span>
            <input
              className={style.settingInput}
              type="number"
              min="0"
              value={value}
              onChange={(e) => setter(toNonNegativeInt(e.target.value))}
            />
          </label>
        ))}
      </div>
      <div className={style.exercisesSection}>
        <Ejercicios
          exercises={exercises}
          setExercises={setExercises}
          handleAddExercises={handleAddExercises}
          currentRound={currentRound}
        />
      </div>
    </div>
  );
};

export default Tabata;
