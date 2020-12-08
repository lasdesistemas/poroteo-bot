const TOKEN = process.env.TELEGRAM_TOKEN;
const TelegramBot = require('node-telegram-bot-api');
const options = {
  webHook: {
    // Port to which you should bind is assigned to $PORT variable
    // See: https://devcenter.heroku.com/articles/dynos#local-environment-variables
    port: process.env.PORT
    // you do NOT need to set up certificates since Heroku provides
    // the SSL certs already (https://<app-name>.herokuapp.com)
    // Also no need to pass IP because on Heroku you need to bind to 0.0.0.0
  }
};
// Heroku routes from port :443 to $PORT
const url = process.env.APP_URL;
const bot = new TelegramBot(TOKEN, options);

// This informs the Telegram servers of the new webhook.
// Note: we do not need to pass in the cert, as it already provided
bot.setWebHook(`${url}/bot${TOKEN}`);

// // Just to ping!
// bot.on('message', function onMessage(msg) {
//   bot.sendMessage(msg.chat.id, 'I am alive on Heroku!');
// });

bot.onText(/\/start/, function (msg, match) {
    var fromId = msg.chat.id;
    var message = "Este bot te dice como va el poroteo por la votación de la IVE en diputades y senadores argentines\n";
    message += "Enviá /senadores para ver el estado de los votos en senadores";
    bot.sendMessage(fromId, message);
});