'use strict';

let http = require('http');
let express = require('express');
let socketio = require('socket.io');
let RpsGame = require('./RpsGame');

let app = express();
let server = http.createServer(app);
let io = socketio(server);

let waitingPlayer;

io.on('connection', onConnection);

app.use(express.static(__dirname + '/src'));

server.listen(8080, () => console.log('Server started'));

function onConnection(sock) {
    let date = new Date();
    if (date.getHours()>=18){
        sock.emit('msg', 'Добрый вечер!');
    }
    else if (date.getHours() >=12) {
        sock.emit('msg', 'Добрый день!');
    }
    else if (date.getHours() >= 6) {
        sock.emit('msg', 'Доброе утро!');
    }
    else{
        sock.emit('msg','Приветствуем!');
    }
    sock.emit('msg', '');
    sock.on('msg', (txt) => io.emit('msg', txt));

    if (waitingPlayer) {
        new RpsGame(waitingPlayer, sock);
        waitingPlayer = null;
    } else {
        waitingPlayer = sock;
        sock.emit('msg', 'Ожидайте второго игрока');
    }
}