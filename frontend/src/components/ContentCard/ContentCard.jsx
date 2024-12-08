import React from 'react';
import styles from "./ContentCard.module.css"
function ContentCard({ json }) {
    return (
        <div className={styles.card}>
            <h3>{json.title}</h3>
            <h4>{json.username}</h4>
            <p><strong>Content:</strong> {json.content_body}</p>
            <p><strong>Date:</strong> {json.date}</p>
            <p>{json.source}</p>
            <p><strong>Source URL:</strong> <a href={json.source_url} target="_blank" rel="noopener noreferrer">{json.source_url}</a></p>
            <p><strong>Explicit:</strong> {json.explicit}</p>
            <p><strong>Sentiment:</strong> {json.sentiment}</p>
        </div>
    );
}

export default ContentCard;