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
    config,
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

/**
 * ```
 * {
 *   1000: { ... }
 *   1016: { ... },
 *   1032: { ... },
 * }
 * ```
 *
 * @param {Object} players
 * @return {Object}
 */
const batchPlayerUpdates = players => {
  return Object.keys(players).reduce((acc, playerUid) => {
    const player = players[playerUid];
    return ({
      ...acc,
      [player.clientTime]: {
        ...(acc[player.clientTime] ? acc[player.clientTime] : {}),
        [playerUid]: player,
      }
    })
  }, {})
};

let batchUpdates = {};

setInterval(() => {
  batchUpdates = {
    ...batchUpdates,
    ...batchPlayerUpdates(Players.get()),
  };

}, Math.floor(SECOND / FPS));

setInterval(() => {
  io.sockets.emit('sync', batchUpdates);
  batchUpdates = {}; // reset batch updates
}, 100);