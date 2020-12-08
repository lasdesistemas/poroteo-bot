const TOKEN = process.env.TELEGRAM_TOKEN;
const TelegramBot = require('node-telegram-bot-api');
const contadorDeVotos = require("./contador-de-votos");
const contador = new contadorDeVotos();
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

bot.onText(/\/start/, function (msg, match) {
    var fromId = msg.chat.id;
    var message = "Este bot te dice como va el poroteo por la votación de la IVE en diputades y senadores en Argentina en 2020\n";
    message += "Enviá /senadores para ver el estado de los votos en senadores\n";
    message += "Enviá /diputades para ver el estado de los votos en diputades";
    bot.sendMessage(fromId, message);
});

var botRequestCount = 1;

bot.onText(/\/senadores/, function (msg, match) {
  console.log('Pedidos al bot:' + botRequestCount++);
  let promise = contador.senadores();
  var fromId = msg.chat.id;

  promise.then((votosSenadores) => { 
    var message = "Por ahora en senadores van:\n";
    message += "*" + votosSenadores.aFavor + "* a favor\n";
    message += "*" + votosSenadores.enContra + "* en contra\n";
    message += "*" + votosSenadores.noConfirmado + "* no confirmados\n";
    message += "*" + votosSenadores.seAbstiene + "* abstenciones\n";
    message += "Para más información mandá /masinfo";
    bot.sendMessage(fromId, message, {parse_mode: "Markdown"});
  }).catch((error) => {
    console.log(error);
    bot.sendMessage(fromId, "En este momento no puedo responder. Intentá más tarde.", {parse_mode: "Markdown"});
  });
});

bot.onText(/\/diputades/, function (msg, match) {
  console.log('Pedidos al bot:' + botRequestCount++);
  let promise = contador.diputades();
  var fromId = msg.chat.id;

  promise.then((votosDiputades) => { 
    var message = "Por ahora en diputades van:\n";
    message += "*" + votosDiputades.aFavor + "* a favor\n";
    message += "*" + votosDiputades.enContra + "* en contra\n";
    message += "*" + votosDiputades.noConfirmado + "* no confirmados\n";
    message += "*" + votosDiputades.seAbstiene + "* abstenciones\n";
    message += "Para más información mandá /masinfo";
    bot.sendMessage(fromId, message, {parse_mode: "Markdown"});
  }).catch((error) => {
    console.log(error);
    bot.sendMessage(fromId, "En este momento no puedo responder. Intentá más tarde.", {parse_mode: "Markdown"});
  });
});

bot.onText(/\/masinfo/, function (msg, match) {
  var fromId = msg.chat.id;
  var message = "Podés encontrar más información en:\n";
  message += "https://ecofeminita.github.io/poroteoaborto2020 \n";
  bot.sendMessage(fromId, message);
});

bot.onText(/\/about/, function (msg, match) {
  var fromId = msg.chat.id;
  var message = "Hecho con <3 por [LAS] de sistemas.\n Seguinos en Twitter, Facebook e Instagram: @lasdesistemas, o en http://lasdesistemas.org";
  bot.sendMessage(fromId, message);
});
