import styles from './GraphView.module.css';
import LineGraph from './LineGraph';
import StatisticsView from '../StatisticsView/StatisticsView';
import { useAppContext } from '../AppContext';
import React, { useState } from 'react';


function GraphView() {
  const { queryResult } = useAppContext();
  const [statisticsVisible, setStatisticsVisible] = useState(false)

  const openStatistics = () => {
    setStatisticsVisible(true)
  }
  const closeStatistics = () => {
    setStatisticsVisible(false)
  }

  return (
    <div className={styles.container}>
      <div className={styles.canvas}>
        <LineGraph />
      </div>
      {queryResult &&
        (statisticsVisible
          ? <div className={styles.statisticsContainer}>
            <StatisticsView close={closeStatistics} />
          </div>
          : <button onClick={openStatistics} className={styles.detailsButton}>View Details</button>
        )
      }
    </div>
  );
}

export default GraphView;
