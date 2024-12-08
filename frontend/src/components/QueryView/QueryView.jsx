
import { useQueryResult } from '../QueryResultContext';
function QueryView() {
    const { setResult } = useQueryResult();
    const submitForm = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);;
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });

        fetch('http://localhost:3000/getData', {
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
        <form onSubmit={submitForm}>
            <div >
                <label htmlFor="query">Query</label>
                <input type="text" id="query" name="query" required />
            </div>
            <div>
                <label htmlFor="date-start">Date Start</label>
                <input type="date" id="date-start" name="dateStart" required />
            </div>
            <div>
                <label htmlFor="date-end">Date End</label>
                <input type="date" id="date-end" name="dateEnd" required />
            </div>
            <div>
                <label htmlFor="source-dropdown">From Source</label>
                <select id="source-dropdown" name="source">
                    <option value="ALL">All</option>
                    <option value="REDDIT">Reddit</option>
                    <option value="BUGZILLA">Bugzilla</option>
                </select>
            </div>
            <div>
                <label htmlFor="sentiment-dropdown">Sentiment</label>
                <select id="sentiment-dropdown" name="sentiment">
                    <option value="ALL">All</option>
                    <option value="POSITIVE">Positive</option>
                    <option value="NEGATIVE">Negative</option>
                    <option value="NEUTRAL">Neutral</option>
                </select>
            </div>
            <div>
                <label htmlFor="model-selection">AI Model</label>
                <select id="model-selection" name="model">
                    <option value="LOCAL">Local</option>
                    <option value="CHATGPT">ChatGPT</option>
                    <option value="GEMINI">Gemini</option>
                </select>
            </div>
            <input type="submit" />
        </form>
    )
}

export default QueryView