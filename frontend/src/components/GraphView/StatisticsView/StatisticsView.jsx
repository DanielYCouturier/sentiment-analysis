import styles from "./StatisticsView.module.css";
import { useAppContext } from '../../AppContext';


function StatisticsView({ close }) {
    const { queryResult } = useAppContext();
    const dates = queryResult.map(obj => new Date(obj.date));
    const minDate = new Date(Math.min(...dates));
    const maxDate = new Date(Math.max(...dates));
    const total = queryResult.length;
    const dateRange = `${minDate.toLocaleDateString()} - ${maxDate.toLocaleDateString()}`;

    console.log(queryResult)
    const positiveCount = queryResult.filter(obj => obj.sentiment === 'POSITIVE').length;
    const negativeCount = queryResult.filter(obj => obj.sentiment === 'NEGATIVE').length;
    const neutralCount = queryResult.filter(obj => obj.sentiment === 'NEUTRAL').length;

    const sentimentValues = queryResult.map(obj => {
        if (obj.sentiment === 'POSITIVE') return 1;
        if (obj.sentiment === 'NEGATIVE') return -1;
        return 0; // for neutral
    });

    const getVerboseSentiment = (val) => {
        const absVal = val < 0 ? val * -1 : val
        let output = ""
        if (absVal <= 0.25) {
            return "Neutral"
        } else if (absVal < 0.5) {
            output += "Slightly "
        } else if (absVal >= 0.75) {
            output += "Overwhelmingly "
        }
        output += val > 0 ? "Positive" : "Negative"
        return output
    }

    const averageSentiment = sentimentValues.reduce((sum, value) => sum + value, 0) / total;
    const verboseSentiment = getVerboseSentiment(averageSentiment)


    return (
        <div className={styles.container}>
            <button className={styles.closeButton} onClick={close}>⌵ </button>

            <div className={styles.statsGrid}>
                <p><strong>Total: </strong>{total}</p>
                <p><strong>Results from:</strong> {dateRange}</p>
                <p><strong>Positive Sentiment: </strong>{positiveCount}</p>
                <p><strong>Negative Sentiment: </strong>{negativeCount}</p>
                <p><strong>Neutral Sentiment: </strong>{neutralCount}</p>
                <p><strong>Average Sentiment: </strong>{verboseSentiment} ({averageSentiment}) </p>
            </div>
        </div>
    );
}

export default StatisticsView;
