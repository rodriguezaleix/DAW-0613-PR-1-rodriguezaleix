import mongoose, { Document, Schema } from 'mongoose';

export interface ITransaction extends Document {
    userId: mongoose.Types.ObjectId;
    assetId: mongoose.Types.ObjectId;
    type: 'BUY' | 'SELL';
    quantity: number;
    priceUsdAtExecution: number;
    executedAt: Date;
    notes?: string;
    priceSource: 'COINCAP' | 'CACHE';
}

const transactionSchema: Schema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    assetId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Asset',
        required: true
    },
    type: {
        type: String,
        enum: ['BUY', 'SELL'],
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: [0.00000001, 'La cantidad debe ser mayor a 0']
    },
    priceUsdAtExecution: {
        type: Number,
        required: true
    },
    executedAt: {
        type: Date,
        default: Date.now
    },
    notes: {
        type: String
    },
    priceSource: {
        type: String,
        enum: ['COINCAP', 'CACHE'],
        required: true
    }
});

export default mongoose.model<ITransaction>('Transaction', transactionSchema);
