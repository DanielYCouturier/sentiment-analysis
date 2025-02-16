import { useAppContext } from '../AppContext';
import styles from './QueryView.module.css';

function QueryView() {
    const { setQueryResult } = useAppContext();
    const submitForm = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value || getDefault(key);
        });

        fetch('http://localhost:5000/getData', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Invalid POST request");
                }
                return response.json();
            })
            .then(result => {
                console.log('Received JSON from server:', result);
                setQueryResult(result);
            })
            .catch(error => {
                console.error(error);
            });
    };

    const getDefault = (key) => {
        const defaults = {
            dateStart: "1111-11-11",
            dateEnd: "9999-09-09",
            source: "ALL",
            sentiment: "ALL",
            model: "LOCAL"
        };
        return defaults[key];
    };

    return (
        <form className={styles.container} onSubmit={submitForm}>
            <h2 className={styles.title}>Filters & Settings</h2>
            <div>
                <label className={styles.label} htmlFor="query">Query</label>
                <input className={styles.input} type="text" id="query" name="query" placeholder="Enter search query" required />
            </div>
            <div>
                <label className={styles.label} htmlFor="date-start">Date Start</label>
                <input className={styles.input} type="date" id="date-start" name="dateStart" />
            </div>
            <div>
                <label className={styles.label} htmlFor="date-end">Date End</label>
                <input className={styles.input} type="date" id="date-end" name="dateEnd" />
            </div>
            <div>
                <label className={styles.label} htmlFor="source-dropdown">From Source</label>
                <select className={styles.select} id="source-dropdown" name="source" defaultValue="ALL">
                    <option value="ALL">All</option>
                    <option value="REDDIT">Reddit</option>
                    <option value="BUGZILLA">Bugzilla</option>
                    <option value="GITHUB">GitHub</option>
                </select>
            </div>
            <div>
                <label className={styles.label} htmlFor="sentiment-dropdown">Sentiment</label>
                <select className={styles.select} id="sentiment-dropdown" name="sentiment" defaultValue="ALL">
                    <option value="ALL">All</option>
                    <option value="POSITIVE">Positive</option>
                    <option value="NEGATIVE">Negative</option>
                    <option value="NEUTRAL">Neutral</option>
                </select>
            </div>
            <div>
                <label className={styles.label} htmlFor="model-selection">AI Model</label>
                <select className={styles.select} id="model-selection" name="model" defaultValue="LOCAL">
                    <option value="LOCAL">Local</option>
                    <option value="CHATGPT">ChatGPT</option>
                    <option value="GEMINI">Gemini</option>
                </select>
            </div>
            <input className={styles.button} type="submit" />
        </form>
    );
}

export default QueryView;