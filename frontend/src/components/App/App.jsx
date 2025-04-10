import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import ContentView from "../ContentView/ContentView";
import QueryView from "../QueryView/QueryView";
import styles from "./App.module.css";
import GraphView from "../GraphView/GraphView";
import TopBar from "../TopBar/TopBar";
import DocView from '../DocView/DocView';

function App() {
  const location = useLocation();
  return (
    <div className={styles.root}>
      <div className={styles.topBar}>
        <TopBar />
      </div>
      <div className={styles.body}>
        {location.pathname !== "/home" && (
          <div className={styles.queryWrapper}>
            <QueryView />
          </div>
        )}
        <div className={styles.contentWrapper}>
          <Routes >
            <Route path="*" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<DocView/>} />
            <Route path="/search" element={<ContentView />} />
            <Route path="/trends" element={<GraphView />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
