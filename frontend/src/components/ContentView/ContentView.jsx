import React from 'react';
import { useAppContext } from '../AppContext';
import ContentCard from '../ContentCard/ContentCard';
import styles from "./ContentView.module.css"
function ContentView() {
    const { queryResult, setViewState } = useAppContext();


    const switchToGraph = () => {
        setViewState("GRAPH")
    }

    return (
        <div className={styles.contentContainer}>

            <button onClick={switchToGraph} className={styles.graphButton}>View Graph</button>
            <h2>Content View</h2>
            {queryResult && Array.isArray(queryResult) && queryResult.length > 0 ? (
                queryResult.map((json, index) => (
                    <ContentCard key={index} json={json} />
                ))
            ) : (
                <p>No data received yet.</p>
            )}
        </div>
    );
}


export default ContentView;