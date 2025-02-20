import React, { useState } from 'react';
import { useAppContext } from '../AppContext';
import ContentCard from '../ContentCard/ContentCard';
import styles from "./ContentView.module.css"
function ContentView() {
    const { queryResult } = useAppContext();
    const [sortConfig, setSortConfig] = useState({ key: "date", ascending: false })

    const sortedResults = () => {
        if (!queryResult || !Array.isArray(queryResult)) return [];

        return [...queryResult].sort((a, b) => {
            if (!sortConfig.key) return 0;

            let valueA, valueB;
            if (sortConfig.key === "date") {
                valueA = new Date(a.date);
                valueB = new Date(b.date);
            } else if (sortConfig.key === "sentiment") {
                valueA = a.sentiment;
                valueB = b.sentiment;
            }

            if (valueA < valueB) return sortConfig.ascending ? -1 : 1;
            if (valueA > valueB) return sortConfig.ascending ? 1 : -1;
            return 0;
        });
    };
    const toggleSort = (key) => {
        setSortConfig(prev => ({
            key,
            ascending: prev.key === key ? !prev.ascending : false
        }));
    };

    return (
        <div className={styles.contentContainer}>
            <div className={styles.sortByContainer}>
                <button className={styles.sortButton} onClick={() => toggleSort("date")}>
                    Date {sortConfig.key === "date" ? (sortConfig.ascending ? "▲" : "▼") : ""}
                </button>
                <button className={styles.sortButton} onClick={() => toggleSort("sentiment")}>
                    Sentiment {sortConfig.key === "sentiment" ? (sortConfig.ascending ? "▲" : "▼") : ""}
                </button>
            </div>

            <div className={styles.cardList}>
                {sortedResults().length > 0 ? (
                    sortedResults().map((json, index) => (
                        <ContentCard key={index} json={json} />
                    ))
                ) : (
                    <p>No data received yet.</p>
                )}
            </div>
        </div>
    );
}


export default ContentView;