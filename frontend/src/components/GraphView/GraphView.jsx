import styles from './GraphView.module.css';
import LineGraph from './LineGraph';
import StatisticsView from './StatisticsView/StatisticsView';
import { useAppContext } from '../AppContext';
import React, { useState } from 'react';


function GraphView() {
  const { queryResult, setViewState } = useAppContext();
  const [statisticsVisible, setStatisticsVisible] = useState(false)
  const switchToContent = () => {
    setViewState("CONTENT")
  }
  const openStatistics = () => {
    setStatisticsVisible(true)
  }
  const closeStatistics = () => {
    setStatisticsVisible(false)
  }

  return (
    <div className={styles.container}>
      <button onClick={switchToContent} className={styles.switchView}>View Content</button>
      <h2>Graph View</h2>
      <div className={styles.canvas}>
        <LineGraph />
      </div>

      {queryResult &&
        (statisticsVisible
          ? <StatisticsView close={closeStatistics} />
          : <button onClick={openStatistics} className={styles.detailsButton}>View Details</button>
        )
      }

    </div>
  );
}

export default GraphView;
