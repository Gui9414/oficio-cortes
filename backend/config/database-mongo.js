import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost:27017/oficio-cortes';

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('🟢 MongoDB conectado com sucesso!');
  } catch (error) {
    console.error('🔴 Erro ao conectar no MongoDB:', error.message);
    process.exit(1);
  }
};
