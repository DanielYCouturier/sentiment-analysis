import ContentView from "../ContentView/ContentView"
import QueryView from "../QueryView/QueryView"
import { QueryResultProvider } from "../QueryResultContext"
import styles from "./App.module.css"
function App() {

  return (
    <QueryResultProvider>
      <div className={styles.root}>
        <div className={styles.queryWrapper}>
          <QueryView />
        </div>
        <div className={styles.contentWrapper}>
          <ContentView />
        </div>
      </div>
    </QueryResultProvider>
  )
}

export default App
