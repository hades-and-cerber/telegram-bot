import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';
import axios from "axios";
dotenv.config();

const TOKEN = process.env.TELEGRAM_API_TOKEN;
const WEB_APP_URL = process.env.WEB_APP_URL;
const LOG_CHAT_ID = process.env.LOG_CHAT_ID;
if(!TOKEN || !WEB_APP_URL) {
    throw Error('Token or app url not found');
}
const bot = new TelegramBot(TOKEN, { polling: true });

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;
    const firstName = msg.chat.first_name;

    if(LOG_CHAT_ID) {
        await axios.get(`https://api.telegram.org/bot${TOKEN}/sendMessage?chat_id=${LOG_CHAT_ID}&text=${JSON.stringify(msg)}`)
    }

    if(text === '/start') {
        await bot.sendMessage(chatId, `Hello, ${firstName} jan! My name is Botik)`, {
            reply_markup: {
                inline_keyboard: [
                    [{ text: "Open Botik's app", web_app: { url: WEB_APP_URL } }]
                ]
            }
        });
    }
});

//
// bot.on('callback_query', (callbackQuery) => {
//     const data = callbackQuery.data;
//     const message = callbackQuery.message;
//     const chatId = message?.chat.id;
//
//     // You can handle different button clicks based on the data
//     if (chatId && data === 'abc_button') {
//         bot.sendMessage(chatId, 'apreeeeesssss');
//     }
// });
