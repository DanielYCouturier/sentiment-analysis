const card_list = document.getElementById('server-responses')
document.getElementById('data-form').addEventListener('submit', function (event) {
    event.preventDefault();
    card_list.innerHTML = ""
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
        .then(response => {
            if(!response.ok){
                throw new Error("Invalid POST request")
            }
            return response.json()
        })
        .then(result => {
            console.log('Received JSON from server:', result);
            createCards(result);
        })
        .catch(error => {
            console.error(error);
        });
});

document.getElementById('clear-button').addEventListener('click', function () {
    card_list.innerHTML = ""
});

function createCards(jsonArray) {
    jsonArray.forEach(json => {
        const card = `
            <div class="card">
                <h3>${json.title}</h3>
                <h4>${json.username}</h4>
                <p><strong>Content:</strong> ${json.content_body}</p>
                <p><strong>Date:</strong> ${json.date}</p>
                <p>${json.source}</p>
                <p><strong>Source URL:</strong> <a href="${json.source_url}" target="_blank">${json.source_url}</a></p>
                <p><strong>Explicit:</strong> ${json.explicit}</p>
                <p><strong>Sentiment:</strong> ${json.sentiment}</p>
            </div>
        `;

        // Append the card to the card list
        card_list.innerHTML += card;
    });
}

formData.forEach((value, key) => {
    data[key] = value;
});

// Add the model selection to the data payload
data["model"] = document.getElementById("model-selection").value;

fetch('http://localhost:3000/getData', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
})