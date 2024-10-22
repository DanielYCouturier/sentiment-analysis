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
            return res.status(500).json({ error: `Server Error: app.js-1 ${errorData}` });
        }
        try {
            const responseObject = JSON.parse(data.trim());
            res.json(responseObject);
        } catch (jsonError) {
            return res.status(500).json({ error: 'Server Error: app.js-2' });
        }
    });

});

app.listen(PORT, () => {
    console.log(`Server is ONLINE`);
});