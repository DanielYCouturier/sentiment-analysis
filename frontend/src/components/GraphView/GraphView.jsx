import styles from './GraphView.module.css';
import LineGraph from './LineGraph';
import StatisticsView from '../StatisticsView/StatisticsView';
import { useAppContext } from '../AppContext';
import React, { useState } from 'react';


function GraphView() {
  const { queryResult } = useAppContext();
  const [statisticsVisible, setStatisticsVisible] = useState(false)
  const [interval, setInterval] = useState("ALL");
  const [dataType, setDataType] = useState("TOTAL");

  const openStatistics = () => {
    setStatisticsVisible(true)
  }
  const closeStatistics = () => {
    setStatisticsVisible(false)
  }

  return (
    <div className={styles.container}>
      <div className={styles.canvas}>
        <LineGraph interval={interval} dataType={dataType} />
      </div>
      <div className={styles.optionsContainer}>
      <div className={styles.options}>
        <label htmlFor="intervalOption" className={styles.label}>Show results by:</label>
        <select id="intervalOption" value={interval} onChange={(e) => setInterval(e.target.value)}>
          <option value="ALL">All</option>
          <option value="DAY">Past Day</option>
          <option value="WEEK">Past Week</option>
          <option value="MONTH">Past Month</option>
          <option value="YEAR">Past 365 days</option>
          <option value="YTD">YTD</option>

        </select>
      </div>

      <div className={styles.options}>
        <label htmlFor="dataOption" className={styles.label}>Display:</label>
        <select id="dataOption" value={dataType} onChange={(e) => setDataType(e.target.value)} >
          <option value="TOTAL">Total</option>
          <option value="SENTIMENT">Sentiment</option>
        </select>
      </div>
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
