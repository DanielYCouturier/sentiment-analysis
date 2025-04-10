document.getElementById('data-form').addEventListener('submit', async function (e) {
    e.preventDefault(); // Prevent default form submission behavior
    console.log("Form submitted");

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    console.log("Form data:", data);

    try {
        const response = await fetch('/api/analyze', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        console.log("Response received:", response);

        const result = await response.json();
        console.log("Parsed result:", result);

        document.getElementById('results').innerHTML = `
            <h3>Results:</h3>
            <p>${result.message}</p>
            <pre>${JSON.stringify(result.data, null, 2)}</pre>
        `;
    } catch (error) {
        console.error("Error occurred:", error);
        document.getElementById('results').innerHTML = `
            <p style="color: red;">An error occurred: ${error.message}</p>
        `;
    }
});
