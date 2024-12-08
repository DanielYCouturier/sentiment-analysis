const mongoose = require('mongoose');

const Content = require('./content');

const querySchema = new mongoose.Schema({
    keyword: { type: String, required: true },
    source: { type: String, required: true },
    datestart: { type: Date, required: true },
    dateend: { type: Date, required: true },
    requestcount: { type: Number, required: true },
    contentid: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Content' }],
}, { timestamps: true });

querySchema.index({ keyword: 1, source: 1});

module.exports = mongoose.model('Query', querySchema);
