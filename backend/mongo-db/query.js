import mongoose from 'mongoose';

const querySchema = new mongoose.Schema({
    keyword: { type: String, required: true },
    source: { type: String, required: true },
    datestart: { type: Date, required: true },
    dateend: { type: Date, required: true },
    requestcount: { type: Number, required: true },
    contentid: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Content' }],
}, { timestamps: true });

querySchema.index({ keyword: 1, source: 1});

export default mongoose.model('Query', querySchema);
