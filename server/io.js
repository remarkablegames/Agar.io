const Server = require('socket.io');
const Players = require('./Players');
const config = require('./config');
const server = require('./server');

const io = new Server(server);

io.on('connection', socket => {
  const uid = socket.id;
  Players.add(uid);
  console.log('User connected:', uid);

  socket.emit('join', uid, {
    players: Players.get(),
    config 
  });

  socket.emit('update', uid, Players.get());

  socket.on('update', (uid, { moveX, moveY, clientTime }) => {
    Players.update(uid, { moveX, moveY, clientTime });
  });

  socket.on('disconnect', () => {
    Players.remove(uid);
    socket.emit('update', null, Players.get());
    console.log('User disconnected:', uid);
  });
});

const SECOND = 1000;
const FPS = 60;

setInterval(() => {
  io.sockets.emit('update', null, {
    players: Players.get(),
  })
}, SECOND / FPS);
