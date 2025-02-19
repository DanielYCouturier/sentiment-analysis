import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../AppContext';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import ChartZoom from 'chartjs-plugin-zoom';

// Register chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartZoom
);

function LineGraph() {
  const { queryResult } = useAppContext();
  const chartRef = useRef(null);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Count in Interval',
        data: [],
        borderColor: 'rgba(75,192,192,1)',
        tension: 0.1,
      },
    ],
  })
  const [chartOptions, setChartOptions] = useState({
    // plugins: {
      // zoom: {
      //   zoom: {
      //     wheel: {
      //       enabled: true,
      //       speed: 0.001, 
      //     },
      //     pinch: {
      //       enabled: true,
      //       speed: 0.001, 
      //     },
      //     mode: 'x',
      //     onZoomComplete: function ({ chart }) {
      //       const { min, max } = chart.scales.x;
      //       if (max - min < 2) {
      //         chart.options.scales.x.min = Math.max(0, min);
      //         chart.options.scales.x.max = min + 2;
      //         chart.update();
      //       }
      //     },
      // },
      // },
    // },
    responsive: true,
    maintainAspectRatio: true, 
  });

  const getIntervals = (minDate, maxDate, intervalCount) => {
    const intervals = [];
    const intervalDuration = (maxDate - minDate) / intervalCount;

    for (let i = 0; i < intervalCount; i++) {
      const start = new Date(minDate.getTime() + i * intervalDuration);
      const end = new Date(minDate.getTime() + 1 + (i + 1) * intervalDuration);
      intervals.push({ start, end });
    }
    return intervals;
  };

  const getIntervalItems = (intervals) => {
    const outerList = Array.from({ length: intervals.length }, () => []);
    queryResult.forEach(obj => {
      intervals.forEach((dateRange, index) => {
        const dateStart = dateRange.start
        const dateEnd = dateRange.end
        const objDate = new Date(obj.date)
        if (dateStart <= objDate && objDate < dateEnd) {
          outerList[index].push(obj)
        }
      })
    });
    return outerList
  };

  const getIntervalItemCount = (intervalItems) => {
    return intervalItems.map(innerList => innerList.length);
  };
  const getAverageSentiment = (intervalItems) => {
    const sentimentMap = {
      "NEGATIVE": -1,
      "NEUTRAL": 0,
      "POSITIVE": 1
    };

    return intervalItems.map(innerList => {
      if (innerList.length === 0) return 0;

      const sum = innerList.reduce((acc, item) => acc + sentimentMap[item.sentiment], 0);
      return sum;
    });
  };


  const INTERVAL_COUNT = 15;



  useEffect(() => {
    if (queryResult) {
      const dates = queryResult.map(obj => new Date(obj.date));
      const minDate = new Date(Math.min(...dates));
      const maxDate = new Date(Math.max(...dates));

      const intervals = getIntervals(minDate, maxDate, INTERVAL_COUNT)
      const intervalItems = getIntervalItems(intervals)
      const counts = getIntervalItemCount(intervalItems)
      const average = getAverageSentiment(intervalItems)
      setChartData({
        labels: intervals.map(interval => {
          return `${interval.start.toLocaleDateString()} - ${interval.end.toLocaleDateString()}`;
        }),
        datasets: [{
          label: 'Count in Interval',
          data: counts,
          borderColor: 'rgba(75,192,192,1)',
          tension: 0.1,
        }]
      });
    }
  }, [queryResult]);
  return (
    queryResult ?
      <Line
        ref={chartRef} 
        data={chartData}
        options={chartOptions}
        style={{ width: '100%', height: '100%' }}
      />
      : <h3 style={{ width: '100px' }}>No Data</h3>
  )
}

export default LineGraph;
