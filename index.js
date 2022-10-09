const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const cors = require('cors');
const token = require('./token/token');

const webAppUrl = 'https://spiffy-basbousa-695201.netlify.app';
const bot = new TelegramBot(token, {polling: true});
const app = express();

app.use(express.json());
app.use(cors());

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (text === '/start') {
        await bot.sendMessage(chatId, 'There is be a button at the bottom. Fill out this form', {
            reply_markup: {
                keyboard: [
                    [{text: 'Fill out the form', web_app: {url: webAppUrl + '/form'}}]
                ]
            }
        })

        await bot.sendMessage(chatId, 'Here is my website. Check it out', {
            reply_markup: {
                inline_keyboard: [
                    [{text: 'The website', web_app: {url: webAppUrl}}]
                ]
            }
        })
    }

    if (msg?.web_app_data?.data) {
        try {
            const data = JSON.parse(msg?.web_app_data?.data);
            console.log(data);
            await bot.sendMessage(chatId, 'Thanks for your feedback');
            await bot.sendMessage(chatId, 'Your country: ' + data?.country);
            await bot.sendMessage(chatId, 'Your city: ' + data?.city);

            setTimeout(async () => {
                await bot.sendMessage(chatId, 'Your gender: ' + data?.gender);
            }, 3000)
        } catch (e) {
            console.log(e);
        }
    }
});

app.post('/web_data', async (res, req) => {
    const {queryId, products, totalPrice} = req.body;
    try {
        await bot.answerWebAppQuery(queryId, {
            type: 'article',
            id: queryId,
            title: 'Successful purchase!',
            input_message_content: {message_text: `Happy money spending day! You bought ${products.length} items for ${totalPrice}`}
        })
    } catch (e) {
        
    }
})

const PORT = 8000
app.listen(PORT, () => console.log("IT'S ALIVE! ALIVE!"));