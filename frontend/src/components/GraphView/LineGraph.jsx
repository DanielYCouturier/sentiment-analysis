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

function LineGraph({ interval, dataType }) {
  const { queryResult } = useAppContext();
  const chartRef = useRef(null);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
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
    return intervalItems.map(innerList => {
      if (innerList.length === 0) return 0;
  
      const sum = innerList.reduce((acc, item) => acc + item.sentiment, 0);
      return sum / innerList.length; 
    });
  };




  useEffect(() => {
    if (queryResult) {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Normalize to the start of today

      let minDate, maxDate, intervals;

      switch (interval) {
        case "ALL":
          const dates = queryResult.map(obj => new Date(obj.date));
          minDate = new Date(Math.min(...dates));
          maxDate = new Date(Math.max(...dates));
          intervals = getIntervals(minDate, maxDate, 15);
          break;

        case "DAY":
          minDate = new Date(today);
          maxDate = new Date(today);
          maxDate.setHours(23, 59, 59, 999);
          intervals = getIntervals(minDate, maxDate, 24);
          break;

        case "WEEK":
          minDate = new Date(today);
          minDate.setDate(today.getDate() - 6);
          maxDate = new Date(today);
          maxDate.setHours(23, 59, 59, 999);
          intervals = getIntervals(minDate, maxDate, 7);
          break;

        case "MONTH":
          minDate = new Date(today);
          minDate.setDate(today.getDate() - 29);
          maxDate = new Date(today);
          maxDate.setHours(23, 59, 59, 999);
          intervals = getIntervals(minDate, maxDate, 30);
          break;

        case "YEAR":
          minDate = new Date(today);
          minDate.setFullYear(today.getFullYear() - 1);
          maxDate = new Date(today);
          maxDate.setHours(23, 59, 59, 999);
          intervals = getIntervals(minDate, maxDate, 12);
          break;

        case "YTD":
          minDate = new Date(today.getFullYear(), 0, 1); // January 1st of the current year
          maxDate = new Date(today.getFullYear(), 11, 31, 23, 59, 59, 999); // December 31st of the current year
          intervals = getIntervals(minDate, maxDate, 12).filter(interval => interval.start <= today);
          break;

        default:
          intervals = [];
          break;
      }

      const intervalItems = getIntervalItems(intervals)
      let yAxis, chartTitle
      switch (dataType) {
        case "TOTAL":
          yAxis = getIntervalItemCount(intervalItems)
          chartTitle = "Total Count"
          break;
        case "SENTIMENT":
          yAxis = getAverageSentiment(intervalItems)
          chartTitle = "Average Sentiment"
          break
        default:
          yAxis = []
          break;
      }

      setChartData({
        labels: intervals.map(interval => {
          return `${interval.start.toLocaleDateString()} - ${interval.end.toLocaleDateString()}`;
        }),
        datasets: [{
          label: chartTitle,
          data: yAxis,
          borderColor: 'rgba(75,192,192,1)',
          tension: 0.1,
        }]
      });
    }
  }, [queryResult, interval, dataType]);
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
