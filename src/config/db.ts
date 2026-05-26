import mongoose from 'mongoose';

// Conectamos a MongoDB
const connectDB = async (): Promise<void> => {
    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) throw new Error("MONGODB_URI is not defined");
        
        await mongoose.connect(uri);
        console.log('Base de datos conectada correctamente');
    } catch (error) {
        console.error('Error al conectar a MongoDB:', error);
        process.exit(1);
    }
};

export default connectDB;
