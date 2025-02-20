import ContentView from "../ContentView/ContentView";
import QueryView from "../QueryView/QueryView";
import { useAppContext } from "../AppContext";
import styles from "./App.module.css";
import GraphView from "../GraphView/GraphView";
import TopBar from "../TopBar/TopBar";

function App() {
  const { viewState } = useAppContext();

  return (
    <div className={styles.root}>
      <div className={styles.topBar}>
        <TopBar/>
      </div>
      <div className={styles.body}>
        <div className={styles.queryWrapper}>
          <QueryView />
        </div>
        <div className={styles.contentWrapper}>
          {viewState === "CONTENT" && <ContentView />}
          {viewState === "GRAPH" && <GraphView />}
        </div>
      </div>
    </div>
  );
}

export default App;