import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';
dotenv.config();

const TOKEN = process.env.TELEGRAM_API_TOKEN;
const WEB_APP_URL = 'https://hadesfirsttelegramapp.netlify.app/';
if(!TOKEN) {
    throw Error('Token not found');
}
const bot = new TelegramBot(TOKEN, { polling: true });

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if(text === '/start') {
        await bot.sendMessage(chatId, "Let's start axpers", {
            reply_markup: {
                inline_keyboard: [
                    [{ text: "Click here", web_app: { url: WEB_APP_URL } }]
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
