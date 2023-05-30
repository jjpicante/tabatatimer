import Tabata from "./Components/Tabata/tabata";
import style from "./App.module.css";
import Youtube from "./Components/Youtube/youtube";

function App() {
  return (
    <div className={style.container}>
      <div className={style.column}>
      </div>
      <div className={style.column}>
        <Tabata />
      </div>
      <div className={style.column}>
        <Youtube />
      </div>
    </div>
  );
}

export default App;
