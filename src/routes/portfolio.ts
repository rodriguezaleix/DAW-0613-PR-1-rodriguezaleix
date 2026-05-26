import { Router } from 'express';
import { getPortfolio } from '../controllers/portfolioController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.use(authMiddleware as any);
router.get('/', getPortfolio as any);

export default router;
