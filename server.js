const http = require('http');
const server = http.createServer();
const io = require('socket.io')(server);

io.on('connection', socket => {
    console.log(`new conn: ${socket.id}`);
});

server.listen(9009, () => console.log('Listening on 9009...'));