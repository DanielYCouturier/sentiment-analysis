import { useState, React } from 'react';
import ReactMarkdown from 'react-markdown';  // Import react-markdown
import styles from "./ContentCard.module.css";
import { useAppContext } from '../AppContext';

function ContentCard({ json }) {

    const sendCorrectionToBackend = async (url, sentiment) => {
        try {
            const response = await fetch('http://localhost:5000/correct_sentiment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url, sentiment }),
            });
    
            const result = await response.json();
            console.log('Backend response:', result);
        } catch (error) {
            console.error('Failed to send correction:', error);
        }
    };



    const { corrections, setCorrections} = useAppContext();
    const [showDropdown, setShowDropdown] = useState(false);

    const handleCorrection = (value) => {
        console.log("Correction selected:", value);
        setCorrections(prev => ({
            ...prev,
            [json.source_url]: value
        }));
        sendCorrectionToBackend(json.source_url, value);
        setShowDropdown(false);
    };
    const displaySentiment = corrections[json.source_url] !== undefined
    ? corrections[json.source_url]
    : json.sentiment;

    const getBorderColor = (sentiment) => {
        const hue = sentiment > 0 ? 120 : 0;
        const saturation = Math.round(Math.abs(sentiment) * 75);
        const lightness = 50;
        return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    };
    const borderColor = getBorderColor(displaySentiment);
    const getVerboseSentiment = (score) => {
        if (score == 1) {
            return "Positive";
        } else if (score == -1) {
            return "Negative";
        } else {
            return "Neutral";
        }
    };

    return (
        <div className={styles.card} style={{ borderColor: borderColor }}>
            <div className={styles.sourceContainer}>
                {json.source === "BUGZILLA" && <img src='https://www.bugzilla.org/assets/img/banner.png' title='Bugzilla' />}
                {json.source === "REDDIT" && <img src='https://upload.wikimedia.org/wikipedia/en/thumb/1/1f/Reddit_logo_2023.svg/512px-Reddit_logo_2023.svg.png?20231130022927' title='Reddit' />}
                {json.source === "GITHUB" && <img src='https://media2.dev.to/dynamic/image/width=1000,height=420,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fi%2Fkztm003o38g4q5x7vm4l.png' title='GitHub' />}
            </div>
            <p className={styles.title}>{json.title}</p>
            {json.username && json.username !== "N/A" && <p className={styles.username}> by {json.username}</p>}

            {json.source === "GITHUB" ? (
                <ReactMarkdown>{json.content_body}</ReactMarkdown>
            ) : (
                <p>{json.content_body}</p>
            )}

            <p>{new Date(json.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
            })}</p>
            <p>Sentiment: {getVerboseSentiment(displaySentiment)} ({parseFloat(displaySentiment).toFixed(2) ?? "Loading..."})</p>
            <p><a href={json.source_url} target="_blank" rel="noopener noreferrer">{json.source_url}</a></p>

            <div className={styles.dropdownContainer}>
                <button onClick={() => setShowDropdown(prev => !prev)} className={styles.correctButton}>
                    Correct Analysis
                </button>
                {showDropdown && (
                    <div className={styles.dropdown}>
                        <button onClick={() => handleCorrection(-1)}>Negative</button>
                        <button onClick={() => handleCorrection(0)}>Neutral</button>
                        <button onClick={() => handleCorrection(1)}>Positive</button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ContentCard;