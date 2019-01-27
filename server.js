const http = require('http');
const server = http.createServer();
const io = require('socket.io')(server);

let players = [];

io.on('connection', socket => {
    console.log(`new conn: ${socket.id}`);
    players.push(socket.id);

    // io.emit('onConnection', socket.id);
    io.emit('onConnection', players);

    socket.on('disconnect', () => {
        players.splice(players.indexOf(socket.id), 1);    
        io.emit('onDisconnect', socket.id);
        console.log('LOST CONNECTION')
    });

    socket.on('playerUpdate', (data) => {
        io.emit('playerUpdate', data);
    });
});

server.listen(9009, () => console.log('Listening on 9009...'));