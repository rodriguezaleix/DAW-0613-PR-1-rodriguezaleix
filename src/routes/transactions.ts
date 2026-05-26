import { Router } from 'express';
import { createTransaction, getTransactions, getTransactionById, updateTransaction, deleteTransaction } from '../controllers/transactionController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.use(authMiddleware as any);

router.post('/', createTransaction as any);
router.get('/', getTransactions as any);
router.get('/:id', getTransactionById as any);
router.patch('/:id', updateTransaction as any);
router.delete('/:id', deleteTransaction as any);

export default router;
