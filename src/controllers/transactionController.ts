import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Transaction from '../models/Transaction';
import Asset from '../models/Asset';
import { getAssetPrice } from '../services/coincap';

export const createTransaction = async (req: AuthRequest, res: Response) => {
    try {
        const { assetId, type, quantity, notes } = req.body;
        const userId = req.user.userId;

        if (!assetId || !type || !quantity) {
            return res.status(400).json({ error: 'assetId, type y quantity son obligatorios' });
        }

        const asset = await Asset.findById(assetId);
        if (!asset) {
            return res.status(404).json({ error: 'Asset no encontrado' });
        }

        let priceUsdAtExecution: number;
        let priceSource: 'COINCAP' | 'CACHE' = 'COINCAP';

        try {
            priceUsdAtExecution = await getAssetPrice(asset.coincapId);
            asset.lastPriceUsd = priceUsdAtExecution;
            asset.lastPriceAt = new Date();
            await asset.save();
        } catch (error) {
            console.log('CoinCap falló, usando precio de caché (Bonus B)');
            if (asset.lastPriceUsd) {
                priceUsdAtExecution = asset.lastPriceUsd;
                priceSource = 'CACHE';
            } else {
                return res.status(503).json({ error: 'Servicio CoinCap no disponible y no hay precio en caché' });
            }
        }

        const newTransaction = new Transaction({
            userId, assetId, type, quantity, priceUsdAtExecution, notes, priceSource
        });

        await newTransaction.save();
        res.status(201).json(newTransaction);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear la transacción' });
    }
};

export const getTransactions = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user.userId;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        const transactions = await Transaction.find({ userId }).skip(skip).limit(limit).sort({ executedAt: -1 });
        const total = await Transaction.countDocuments({ userId });

        res.json({ data: transactions, currentPage: page, totalPages: Math.ceil(total / limit), totalTransactions: total });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener transacciones' });
    }
};

export const getTransactionById = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user.userId;
        const transaction = await Transaction.findOne({ _id: req.params.id, userId }).populate('assetId', 'name symbol');
        if (!transaction) return res.status(404).json({ error: 'Transacción no encontrada' });
        res.json(transaction);
    } catch (error) {
        res.status(500).json({ error: 'Error interno' });
    }
};

export const updateTransaction = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user.userId;
        const { notes, executedAt } = req.body;
        const transaction = await Transaction.findOne({ _id: req.params.id, userId });
        if (!transaction) return res.status(404).json({ error: 'Transacción no encontrada' });

        if (notes !== undefined) transaction.notes = notes;
        if (executedAt !== undefined) transaction.executedAt = executedAt;
        await transaction.save();
        res.json(transaction);
    } catch (error) {
        res.status(500).json({ error: 'Error interno' });
    }
};

export const deleteTransaction = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user.userId;
        const transaction = await Transaction.findOneAndDelete({ _id: req.params.id, userId });
        if (!transaction) return res.status(404).json({ error: 'Transacción no encontrada' });
        res.json({ message: 'Transacción eliminada' });
    } catch (error) {
        res.status(500).json({ error: 'Error interno' });
    }
};
