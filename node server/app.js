const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { spawn } = require('child_process');
const mongoose = require('mongoose');
const Content = require('./mongo-db/content');
const Query = require('./mongo-db/query');

const app = express();
const PORT = 3000;

app.use(cors()); // TODO THIS IS A SECURITY VULNERABILITY IF ON AWS I THINK IDRK, WILL FIX LATER
app.use(bodyParser.json());

// change to real url later
mongoose.connect('mongodb://localhost:27017/sentiment-analysis')
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.log('Error connecting to MongoDB:', err));


// Main server interface
app.post('/getData', async (req, res) => {
    // Step 1: Interpret the post req parameters
    const { query, dateStart, dateEnd, sources, sentiment } = req.body;
    console.log(`Received req from client: \nquery: ${query}\ndateStart: ${dateStart}\ndateEnd: ${dateEnd}\nsources: ${sources}\nsentiment: ${sentiment}`)
    // Step 2: Check if parameters are in database
    const cachedQuery = await Query.findOne({
        keyword: query,
        source: sources,
        datestart: dateStart,
        dateend: dateEnd
    }).populate('contentid');
    // Step 3: If query is already in database, return results
    if (cachedQuery) {
        console.log("Found results in database")
        const content = cachedQuery.contentid.map(content => ({
            title: content.title,
            username: content.username,
            content_body: content.content_body,
            date: content.date.toISOString(),
            source_url: content.source_url,
            explicit: "FALSE",
            sentiment: "NEUTRAL"
        }));
        console.log(`Response of ${content.length} results sent to client\n`)
        return res.json(content);
    }

    console.log("Failed to find results in database")
    //Step 4: Fallthrough; Spawn python process to scrape data
    const args = [query, dateStart, dateEnd, sources, sentiment];
    const pythonProcess = spawn('python3', ['python/get_data.py', JSON.stringify(args)]);

    let pythonOutput = '';
    let errorData = '';

    pythonProcess.stdout.on('data', (chunk) => {
        pythonOutput += chunk.toString();
    });

    pythonProcess.stderr.on('data', (chunk) => {
        errorData += chunk.toString();
    });

    pythonProcess.on('close', async (code) => {
        console.log(errorData.trim())
        if (code !== 0 || !pythonOutput) {
            console.log(`Error while executing python code: get_data.py with parameters "${args}"`)
            console.log(`System Time: ${new Date()}`)
            return res.status(500).send(`Server failed to gather data`);
        }
        try {
            const contentList = JSON.parse(pythonOutput.trim());

            // Step 5: Save new content in database
            const contentDocs = await Content.insertMany(contentList.map(item => ({  
                title: item.title,
                username: item.username,
                content_body: item.content_body,
                date: new Date(item.date), 
                source_url: item.source_url
            }))); 
            const contentIds = contentDocs.map(doc => doc._id);
            // Step 6: Save the new query in the database
            const newQuery = new Query({
                keyword: query,
                source: sources,
                datestart: new Date(dateStart),
                dateend: new Date(dateEnd), 
                requestcount: 10,
                contentid: contentIds,
            });

            // Save the query to the database
            await newQuery.save();

            //Step 7: Return results to client
            console.log(`Response of ${contentList.length} results sent to client\n`)
            res.json(contentList);


        } catch (err) {
            console.error('Error saving content to DB:', err);
            res.status(500).send('Unknown Server Error');
        }
    });

});

app.listen(PORT, () => {
    console.log(`Server is ONLINE on port ${PORT}\n`);
});
