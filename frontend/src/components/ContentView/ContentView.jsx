import React from 'react';
import { useQueryResult } from '../QueryResultContext';
import ContentCard from '../ContentCard/ContentCard'; 
import styles from "./ContentView.module.css" 
function ContentView() {
    const { result } = useQueryResult();

    return (
        <div className={styles.contentContainer}>
            <h2>Content View</h2>
            {result && Array.isArray(result) && result.length > 0 ? (
                result.map((json, index) => (
                    <ContentCard key={index} json={json} /> 
                ))
            ) : (
                <p>No data received yet.</p>
            )}
        </div>
    );
}

export default ContentView;