import axios from 'axios';

// Función para obtener el precio actual de un asset desde CoinCap
export const getAssetPrice = async (coincapId: string): Promise<number> => {
    try {
        const response = await axios.get(`https://api.coincap.io/v2/assets/${coincapId}`);
        if (response.data && response.data.data) {
            return parseFloat(response.data.data.priceUsd);
        }
        throw new Error('Formato de respuesta incorrecto');
    } catch (error: any) {
        console.error(`Error al obtener precio de CoinCap para ${coincapId}:`, error.message);
        throw error;
    }
};
