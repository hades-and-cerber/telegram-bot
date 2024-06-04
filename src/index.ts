import TelegramBot from 'node-telegram-bot-api';
import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import db from './db';
import axios from 'axios';

dotenv.config();

const TOKEN = process.env.TELEGRAM_API_TOKEN;
const WEB_APP_URL = process.env.WEB_APP_URL;
const PORT = process.env.PORT || 3000;

if (!TOKEN || !WEB_APP_URL) {
    throw new Error('Token or app URL not found');
}

const bot = new TelegramBot(TOKEN, { polling: true });

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;
    const firstName = msg.chat.first_name;

    console.log(msg);

    if (text === '/start') {
        try {
            console.log(`Sending URL: ${WEB_APP_URL}`); // Log the URL
            await bot.sendMessage(chatId, `Hello, ${firstName} jan! My name is Botikula)`, {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: "Open Botik's app", web_app: { url: WEB_APP_URL } }]
                    ]
                }
            });
        } catch (error) {
            console.error('Error sending message:', error);
            await bot.sendMessage(chatId, 'Sorry, an error occurred while sending the message.');
        }
    }
});


const app = express();
app.use(bodyParser.json());


app.post('/api/deposit', async (req, res) => {
    const { userId, token, chain } = req.body;

    let depositAddress = '';
    try {
        if (chain === 'TRC20') {

            depositAddress = 'TTron_example_address';
        } else if (chain === 'ERC20') {

            depositAddress = 'TEth_example_address';
        }

        const result = await db.query(
            'INSERT INTO deposits (user_id, token, chain, deposit_address) VALUES ($1, $2, $3, $4) RETURNING *',
            [userId, token, chain, depositAddress]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error creating deposit:', err);
        res.status(500).send('Server error');
    }
});


app.post('/api/withdraw', async (req, res) => {
    const { userId, token, chain, amount, withdrawalAddress } = req.body;

    try {
        const result = await db.query(
            'INSERT INTO withdrawals (user_id, token, chain, withdrawal_address, amount) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [userId, token, chain, withdrawalAddress, amount]
        );

        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error processing withdrawal:', err);
        res.status(500).send('Server error');
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
