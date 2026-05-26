import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Transaction from '../models/Transaction';
import mongoose from 'mongoose';
import { getAssetPrice } from '../services/coincap';

export const getPortfolio = async (req: AuthRequest, res: Response) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user.userId);

        const portfolioAgg = await Transaction.aggregate([
            { $match: { userId: userId } },
            {
                $group: {
                    _id: "$assetId",
                    netQuantity: {
                        $sum: { $cond: [{ $eq: ["$type", "BUY"] }, "$quantity", { $multiply: ["$quantity", -1] }] }
                    }
                }
            },
            {
                $lookup: { from: "assets", localField: "_id", foreignField: "_id", as: "assetData" }
            },
            { $unwind: "$assetData" },
            {
                $project: {
                    _id: 0,
                    asset: { id: "$_id", symbol: "$assetData.symbol", name: "$assetData.name", coincapId: "$assetData.coincapId" },
                    netQuantity: 1
                }
            }
        ]);

        const finalPortfolio = [];
        for (const item of portfolioAgg) {
            let currentPriceUsd = 0;
            try {
                currentPriceUsd = await getAssetPrice(item.asset.coincapId);
            } catch (error) {
                console.log(`Error obteniendo precio para portfolio de ${item.asset.coincapId}. Se establecerá a 0.`);
            }

            finalPortfolio.push({
                asset: { id: item.asset.id, symbol: item.asset.symbol, name: item.asset.name },
                netQuantity: item.netQuantity,
                currentPriceUsd,
                currentValueUsd: item.netQuantity * currentPriceUsd
            });
        }

        res.json(finalPortfolio);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el portfolio' });
    }
};
