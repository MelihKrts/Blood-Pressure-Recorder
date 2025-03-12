const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const dotenv = require('dotenv');

// .env dosyasını yükle
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

// Middleware
app.use(cors()); // CORS etkinleştir (frontend ile backend arasındaki iletişim için)
app.use(express.json()); // JSON body parsing

// MongoDB bağlantısı
let db;

async function connectToMongoDB() {
    try {
        const client = new MongoClient(MONGODB_URI);
        await client.connect();
        console.log(`MongoDB'ye başarıyla bağlandı`);
        db = client.db('Pressure_Recorder'); // Veritabanı adınızı buraya yazın
        return client;
    } catch (error) {
        console.error('MongoDB bağlantı hatası:', error);
        process.exit(1);
    }
}

// API Endpoint - Tension verilerini kaydetme
app.post('/tensions', async (req, res) => {
    try {
        const { bigTension, smallTension } = req.body;

        // Veri doğrulama
        if (!bigTension || !smallTension) {
            return res.status(400).json({ message: 'Tüm alanlar gereklidir' });
        }

        // Veritabanına kaydet
        const collection = db.collection('tensions');
        const result = await collection.insertOne({
            bigTension,
            smallTension,
            createdAt: new Date()
        });

        res.status(201).json({
            message: 'Veri başarıyla kaydedildi',
            id: result.insertedId
        });
    } catch (error) {
        console.error('Veritabanı işlem hatası:', error);
        res.status(500).json({ message: 'Sunucu hatası' });
    }
});

// Sunucuyu başlat
async function startServer() {
    const client = await connectToMongoDB();

    app.listen(PORT, () => {
        console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor`);
    });

    // Uygulama kapandığında MongoDB bağlantısını kapat
    process.on('SIGINT', async () => {
        await client.close();
        console.log('MongoDB bağlantısı kapatıldı');
        process.exit(0);
    });
}

startServer();