import React, { useState } from 'react';
import { useAppContext } from '../AppContext';
import ContentCard from '../ContentCard/ContentCard';
import styles from "./ContentView.module.css";

const ITEMS_PER_PAGE = 10;

function ContentView() {
    const { queryResult } = useAppContext();
    const [sortConfig, setSortConfig] = useState({ key: "date", ascending: false });
    const [currentPage, setCurrentPage] = useState(1);

    const sortedResults = () => {
        if (!queryResult || !Array.isArray(queryResult)) return null;

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

    const paginatedResults = () => {
        const sorted = sortedResults();
        if (sorted === null) {
            return null
        }
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return sorted.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    };

    const totalPages = Math.ceil((queryResult?.length || 0) / ITEMS_PER_PAGE);

    const toggleSort = (key) => {
        setSortConfig(prev => ({
            key,
            ascending: prev.key === key ? !prev.ascending : false
        }));
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
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
                {paginatedResults() === null ? (
                    <div className={styles.loader}></div>

                ) : paginatedResults().length === 0 ? (
                    <p>No data received yet.</p>
                ) : (
                    paginatedResults().map((json, index) => (
                        <ContentCard key={index} json={json} />
                    ))
                )}
            </div>


            {totalPages > 1 && (
                <div className={styles.paginationContainer}>
                    <button
                        className={styles.pageButton}
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                    <span>Page {currentPage} of {totalPages}</span>
                    <button
                        className={styles.pageButton}
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}

export default ContentView;
