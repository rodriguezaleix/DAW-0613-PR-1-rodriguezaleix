import { Router } from 'express';
import { getAssets, getAssetById, createAsset, refreshLastPrice } from '../controllers/assetController';

const router = Router();

router.get('/', getAssets);
router.get('/:id', getAssetById);
router.post('/', createAsset);
router.patch('/:id/refresh-last-price', refreshLastPrice);

export default router;
