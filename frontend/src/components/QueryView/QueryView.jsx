
import { useQueryResult } from '../QueryResultContext';
import styles from './QueryView.module.css';


function QueryView() {
    const { setResult } = useQueryResult();
    const submitForm = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);;
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
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
                    throw new Error("Invalid POST request")
                }
                return response.json()
            })
            .then(result => {
                console.log('Received JSON from server:', result);
                setResult(result);  
            })
            .catch(error => {
                console.error(error);
            });
    }
    return (
        <form className={styles.container} onSubmit={submitForm}>
            <h2 className={styles.title}>Filters & Settings</h2>
            <div>
                <label className={styles.label} htmlFor="query">Query</label>
                <input className={styles.input} type="text" id="query" name="query"  placeholder="Enter search query" required />
            </div>
            <div>
                <label className={styles.label} htmlFor="date-start">Date Start</label>
                <input className={styles.input} type="date" id="date-start" name="dateStart" required />
            </div>
            <div>
                <label className={styles.label} htmlFor="date-end">Date End</label>
                <input className={styles.input} type="date" id="date-end" name="dateEnd" required />
            </div>
            <div>
                <label className={styles.label} htmlFor="source-dropdown">From Source</label>
                <select className={styles.select} id="source-dropdown" name="source">
                    <option value="ALL">All</option>
                    <option value="REDDIT">Reddit</option>
                    <option value="BUGZILLA">Bugzilla</option>
                    <option value="GITHUB">GitHub</option>
                </select>
            </div>
            <div>
                <label className={styles.label} htmlFor="sentiment-dropdown">Sentiment</label>
                <select className={styles.select} id="sentiment-dropdown" name="sentiment">
                    <option value="ALL">All</option>
                    <option value="POSITIVE">Positive</option>
                    <option value="NEGATIVE">Negative</option>
                    <option value="NEUTRAL">Neutral</option>
                </select>
            </div>
            <div>
                <label className={styles.label} htmlFor="model-selection">AI Model</label>
                <select className={styles.select} id="model-selection" name="model">
                    <option value="LOCAL">Local</option>
                    <option value="CHATGPT">ChatGPT</option>
                    <option value="GEMINI">Gemini</option>
                </select>
            </div>
            <input className={styles.button} type="submit" />
        </form>
    );
}

export default QueryView