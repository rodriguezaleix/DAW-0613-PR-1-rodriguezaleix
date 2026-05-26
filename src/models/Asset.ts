import mongoose, { Document, Schema } from 'mongoose';

export interface IAsset extends Document {
    symbol: string;
    name: string;
    coincapId: string;
    lastPriceUsd?: number;
    lastPriceAt?: Date;
}

const assetSchema: Schema = new mongoose.Schema({
    symbol: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    coincapId: {
        type: String,
        required: true,
        unique: true
    },
    lastPriceUsd: {
        type: Number
    },
    lastPriceAt: {
        type: Date
    }
});

export default mongoose.model<IAsset>('Asset', assetSchema);
