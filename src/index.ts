import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import connectDB from './config/db';

import authRoutes from './routes/auth';
import assetRoutes from './routes/assets';
import transactionRoutes from './routes/transactions';
import portfolioRoutes from './routes/portfolio';

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use('/auth', authRoutes);
app.use('/assets', assetRoutes);
app.use('/transactions', transactionRoutes);
app.use('/portfolio', portfolioRoutes);

app.get('/', (req, res) => {
    res.send('API CryptoExchange funcionando correctamente (TS Version)');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
