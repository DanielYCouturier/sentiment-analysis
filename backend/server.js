import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';

import getData from './express/get-data.js'
const app = express();
const PORT = 5000;

app.use(cors()); // TODO THIS IS A SECURITY VULNERABILITY IF ON AWS I THINK IDRK, WILL FIX LATER
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/sentiment-analysis')
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.log('Error connecting to MongoDB:', err));


app.post('/getData', getData)

app.listen(PORT, () => {
    console.log(`Server is ONLINE on port ${PORT}\n`);
});
