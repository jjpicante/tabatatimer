import Tabata from "./Components/Tabata/tabata";
import style from "./App.module.css";
import Youtube from "./Components/Youtube/youtube";

function App() {
  return (
    <div className={style.container}>
      <div className={style.timerColumn}>
        <Tabata />
      </div>
      <div className={style.mediaColumn}>
        <Youtube />
      </div>
    </div>
  );
}

export default App;
