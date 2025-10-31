import mongoose from 'mongoose';

const pollSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true
    },
    options: [{
        type: String,

        required: true
    }],
    closingAt: {
        type: Date,

        required: true
    },
    isClosed: {
        type: Boolean,
        default: false
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', required: true
    }
});

export default mongoose.model('Poll', pollSchema);