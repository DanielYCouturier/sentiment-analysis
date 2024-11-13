const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { spawn } = require('child_process');

const app = express();
const PORT = 3000;

app.use(cors()); // TODO THIS IS A SECURITY VULNERABILITY IF ON AWS I THINK IDRK, WILL FIX LATER
app.use(bodyParser.json());

app.post('/getData', (req, res) => {
    const { query, dateStart, dateEnd, sources, sentiment } = req.body;
    const args = [query, dateStart, dateEnd, sources, sentiment];
    const pythonProcess = spawn('python3', ['python/get_data.py', JSON.stringify(args)]);

    let data = '';
    let errorData = '';

    pythonProcess.stdout.on('data', (chunk) => {
        data += chunk.toString();
    });

    pythonProcess.stderr.on('data', (chunk) => {
        errorData += chunk.toString();
    });

    pythonProcess.on('close', (code) => {
        if (code !== 0 || errorData) {
            console.log(`Error while executing python code: get_data.py with parameters "${args}"`)
            console.log(`System Time: ${new Date()}`)
            console.log(`Error Message: \n${errorData}`)
            return res.status(500).json({ error: `Server Error while parsing POST request parameters` });
        }
        try {
            const responseObject = JSON.parse(data.trim());
            res.json(responseObject);
        } catch (jsonError) {
            console.log("Error while parsing python results: Expected JSON from stdout")
            console.log(`System Time: ${new Date()}`)
            console.log(`Output Received: \n${data}`)
            return res.status(500).json({ error: 'Server Error while parsing POST request parameters' });
        }
    });

});

app.listen(PORT, () => {
    console.log(`Server is ONLINE on port ${PORT}\n`);
});
