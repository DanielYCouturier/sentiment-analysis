import styles from "./GraphView.module.css";
import React from 'react';
import { useAppContext } from '../AppContext';
import ContentCard from '../ContentCard/ContentCard';

function GraphView() {
  const { queryResult, setViewState } = useAppContext();


  const switchToContent = () => {
    setViewState("CONTENT")
  }

  return (
    <div>

      <button onClick={switchToContent}>View Content</button>
      <h2>Graph View</h2>
    </div>
  );
}

export default GraphView;
