const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
    title: { type: String, required: true },
    username: { type: String, required: true },
    content_body: { type: String, required: true },
    date: { type: Date, required: true },
    source_url: { type: String, required: true }
});

module.exports = mongoose.model('Content', contentSchema);