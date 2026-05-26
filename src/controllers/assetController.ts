import { Request, Response } from 'express';
import Asset from '../models/Asset';
import { getAssetPrice } from '../services/coincap';

export const getAssets = async (req: Request, res: Response) => {
    try {
        const assets = await Asset.find();
        res.json(assets);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los assets' });
    }
};

export const getAssetById = async (req: Request, res: Response) => {
    try {
        const asset = await Asset.findById(req.params.id);
        if (!asset) {
            return res.status(404).json({ error: 'Asset no encontrado' });
        }
        res.json(asset);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el asset' });
    }
};

export const createAsset = async (req: Request, res: Response) => {
    try {
        const { symbol, name, coincapId } = req.body;

        if (!symbol || !name || !coincapId) {
            return res.status(400).json({ error: 'symbol, name y coincapId son obligatorios' });
        }

        const existingAsset = await Asset.findOne({ coincapId });
        if (existingAsset) {
            return res.status(400).json({ error: 'El coincapId ya existe' });
        }

        const newAsset = new Asset({ 
            symbol, 
            name, 
            coincapId,
            lastPriceUsd: 1500, // Precio base inyectado por seguridad
            lastPriceAt: new Date()
        });
        await newAsset.save();
        res.status(201).json(newAsset);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al crear el asset' });
    }
};

export const refreshLastPrice = async (req: Request, res: Response) => {
    try {
        const asset = await Asset.findById(req.params.id);
        if (!asset) {
            return res.status(404).json({ error: 'Asset no encontrado' });
        }

        const currentPrice = await getAssetPrice(asset.coincapId);
        asset.lastPriceUsd = currentPrice;
        asset.lastPriceAt = new Date();
        await asset.save();

        res.json(asset);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al refrescar el precio desde CoinCap' });
    }
};
