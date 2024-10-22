const card_list = document.getElementById('server-responses')
document.getElementById('data-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const formData = new FormData(this);
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
        .then(response => response.json())
        .then(result => {
            console.log('Received from server:', result);
            createCards(result);
        })
        .catch(error => {
            console.error('Error:', error);
        });
});

document.getElementById('clear-button').addEventListener('click', function () {
    card_list.innerHTML = ""
});

function createCards(jsonArray) {
    jsonArray.forEach(json => {
        const card = `
            <div class="card">
                <h3>${json.username}</h3>
                <p><strong>Content:</strong> ${json.content_body}</p>
                <p><strong>Date:</strong> ${json.date}</p>
                <p><strong>Source URL:</strong> <a href="${json.source_url}" target="_blank">${json.source_url}</a></p>
                <p><strong>Explicit:</strong> ${json.explicit}</p>
                <p><strong>Sentiment:</strong> ${json.sentiment}</p>
            </div>
        `;

        // Append the card to the card list
        card_list.innerHTML += card;
    });
}