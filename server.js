const http = require('http');
const server = http.createServer();
const io = require('socket.io')(server);

let rooms = {};

io.on('connection', socket => {
    socket.emit('onConnection', Object.keys(rooms));

    socket.on('disconnect', () => {
        if (!socket.room) return;

        rooms[socket.room].splice(rooms[socket.room].indexOf(socket.id), 1);
        if (!rooms[socket.room].length) {
            delete rooms[socket.room];
        }
        io.in(socket.room).emit('onDisconnect', socket.id);
        
        socket.leaveAll();
    });

    socket.on('actorUpdate', data => {
        io.in(socket.room).emit('actorUpdate', data);
    });

    socket.on('projectileSpawn', data => {
        io.in(socket.room).emit('projectileSpawn', data);
    });

    socket.on('createLobby', playerName => {
        socket.name = playerName;
        socket.room = socket.id;

        socket.join(socket.id);
        rooms[socket.id] = [socket];
        socket.emit('createLobby', { socketId: socket.id, name: playerName });
        io.emit('newLobby', socket.id);
    });

    socket.on('joinLobby', data => {
        socket.name = data.name;
        socket.room = data.lobbyId;

        io.in(data.lobbyId).emit('newPlayer', { socketId: socket.id, name: data.name });
        socket.join(data.lobbyId);
        socket.emit('joinLobby', {
            playerInfo: {
                socketId: socket.id,
                name: data.name,
            },
            players: rooms[data.lobbyId].map(player => ({ socketId: player.id, name: player.name }))
        });
        rooms[data.lobbyId].push(socket);
    });

    socket.on('playerReady', name => {
        io.in(socket.room).emit('playerReady', name);
    });
});

server.listen(9009, () => console.log('Listening on 9009...'));