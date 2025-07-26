require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// Telegram Bot Config
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

// Отправка данных в Telegram
app.post('/send-to-telegram', async (req, res) => {
    const { name, phone, message } = req.body;

    const text = `
    📌 *Новая заявка*  
    👤 *Имя:* ${name}  
    📞 *Телефон:* ${phone}  
    📝 *Сообщение:* ${message || 'Не указано'}
    `;

    try {
        await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
            chat_id: TELEGRAM_CHAT_ID,
            text: text,
            parse_mode: 'Markdown'
        });
        res.json({ message: 'Заявка отправлена!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ошибка отправки!' });
    }
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});