import { useAppContext } from '../AppContext';
import styles from './QueryView.module.css';

function QueryView() {
    const { setQueryParams } = useAppContext();
    const submitForm = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });
        setQueryParams(data)
    };

    const currentYear = new Date().getFullYear();
    const defaultDate = `${currentYear}-01-01`;

    return (
        <form className={styles.container} onSubmit={submitForm}>
            <h2 className={styles.title}>Filters & Settings</h2>
            <div>
                <label className={styles.label} htmlFor="keyword">Keyword</label>
                <input
                    className={styles.input}
                    type="text"
                    id="keyword"
                    name="keyword"
                    placeholder="Enter keywords..."
                />
            </div>
            <div>
                <label className={styles.label} htmlFor="date-start">Date Start</label>
                <input className={styles.input} type="date" id="date-start" name="dateStart" defaultValue={defaultDate} />
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
                    <option value="USER">User-Generated</option>

                </select>
            </div>
            <input className={styles.button} type="submit" value="Apply" />
        </form>
    );
}

export default QueryView;