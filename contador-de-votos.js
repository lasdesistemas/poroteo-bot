const https = require('https')

const optionsSenadores = {
  hostname: 'contador-de-votos.herokuapp.com',
  path: '/senadores',
}

class ContadorDeVotos {

    senadores() {
        const promise = new Promise((resolve, reject) => {
            var request = https.get(optionsSenadores, function (res) {
                var data = '';
                res.on('data', (chunk) => {
                    data += chunk;
                });
                res.on('end', () => {
                    const votos = JSON.parse(data);
                    console.log(votos);
                    resolve(votos);
                });
            });
            request.on('error', (e) => {
                console.log('Error accediendo a los datos: ' + e.message);
                reject(e);
            });
            request.end();
        })
        return promise;
    }
}

module.exports = ContadorDeVotos;