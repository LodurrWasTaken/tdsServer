const http = require('http');
const server = http.createServer();
const io = require('socket.io')(server);

let players = {};

io.on('connection', socket => {
    console.log(`new conn: ${socket.id}`);
    players[socket.id] = socket;
    io.emit('broadcast', 'NEW CONNECTION');
});

server.listen(9009, () => console.log('Listening on 9009...'));