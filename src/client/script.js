const socket = window.io();
const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

function setCanvasSize() {
  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;
}

setCanvasSize();

let clientConfig;
let clientPlayers = {};
let clientUid;
let xOffset = 0;
let yOffset = 0;
let moveX = 0;
let moveY = 0;

const SECOND = 1000;
const FPS = 60;
const FPS_INTERVAL = Math.floor(SECOND / FPS);
const updateQueue = [];
let clientBatchUpdates = {};

const getRoundedInterval = () => {
  const now = Date.now();
  return Math.floor(now / FPS_INTERVAL) * FPS_INTERVAL
};

let lastSetTime = Date.now();
socket.on('join', (serverUid, { config: serverConfig, players: serverPlayers }) => {
  if (serverUid) {
    clientPlayers = serverPlayers;
    clientUid = serverUid;
    clientConfig = serverConfig;

    function runInterval(callback, interval) {
      var expected = Date.now() + interval;
      function step() {
        const drift = Date.now() - expected;
        callback(drift);
        expected += interval;
        setTimeout(step, Math.max(0, interval - drift))
      }
      setTimeout(step, interval);
    }

    setTimeout(() => {
      // Current Player Loop
      runInterval((drift) => {
        const timeWithDelay = Date.now() - 100 - drift; 
        const roundedTimeWithDelay = Math.floor(timeWithDelay / FPS_INTERVAL) * FPS_INTERVAL;
        const otherPlayers = clientBatchUpdates[roundedTimeWithDelay];

        window.updateDebugger = {
          otherPlayers,
          clientBatchUpdates,
          roundedInterval: roundedTimeWithDelay,
        }

        if (otherPlayers && otherPlayers[clientUid]) {
          delete otherPlayers[clientUid];
        }

        updatedExistingClientPlayers = Object.keys(clientPlayers).reduce((acc, playerUid) => {
          // do not update current player
          if (playerUid === clientUid) {
            return acc;
          }
          const player = clientPlayers[playerUid];
          const verifiedMoveX = Math.max(-1, Math.min(1, player.moveX));
          const verifiedMoveY = Math.max(-1, Math.min(1, player.moveY));

          return {
            ...acc,
            [playerUid]: {
              ...player,
              x: Math.max(0, Math.min(clientConfig.maxX, player.x + verifiedMoveX * player.speed)),
              y: Math.max(0, Math.min(clientConfig.maxY, player.y + verifiedMoveY * player.speed)),
            }
          }
        }, (clientPlayers || {}));

        clientPlayers = {
          ...(clientPlayers ? updatedExistingClientPlayers : {}),
          ...otherPlayers,
        };

        delete clientBatchUpdates[roundedTimeWithDelay];
        update();
      }, FPS_INTERVAL);
    }, FPS_INTERVAL % Date.now());
  }
});

socket.on('sync', (serverBatchUpdates = {}) => {
  clientBatchUpdates = {
    ...clientBatchUpdates,
    ...serverBatchUpdates,
  }
});

/**
 * @param {number} x
 * @param {number} y
 * @param {number} radius
 * @param {string} color
 */
function drawCircle({ x, y, radius, color }) {
  context.beginPath();
  context.arc(x, y, radius, 0, 2 * Math.PI, false);
  context.fillStyle = color;
  context.fill();
}

/**
 * @param {number} xOffset
 * @param {number} yOffset
 */
function drawGrid(xOffset, yOffset) {
  context.beginPath();
  const gridHeight = clientConfig.maxY;
  const gridWidth = clientConfig.maxX;
  const dx = 70;
  const dy = 70;

  for (let x = xOffset; x <= gridWidth; x += dx) {
    context.moveTo(x, yOffset);
    context.lineTo(x, gridHeight);
  }

  for (let y = yOffset; y <= gridHeight; y += dy) {
    context.moveTo(xOffset, y);
    context.lineTo(gridWidth, y);
  }

  context.strokeStyle = 'lightgray';
  context.stroke();
}

function update() {
  updatePlayer();
  requestAnimationFrame(draw);
}

let angle = 0;
let distance = 1;

function drawDebugger() {
  const player = clientPlayers[clientUid];
  const debuggableValues = [
    ['angle', angle],
    ['distance', distance],
    ['x', player.x],
    ['y', player.y],
    ['players', Object.keys(clientPlayers).length],
    ['latency', Date.now() - player.clientTime],
  ];
  const fontSize = 24;
  const padding = 4;
  debuggableValues.forEach(([key, val], index) => {
    context.font = `normal ${fontSize}px Arial, sans-serif`;
    context.fillStyle = 'black';
    context.fillText(`${key}: ${val}`, fontSize, (index + 1) * (fontSize + padding));
  });
}

function draw() {
  setCanvasSize();
  const p = 10;
  // clear the viewport AFTER the matrix is reset
  context.clearRect(0, 0, canvas.width, canvas.height);

  const clientPlayer = clientPlayers[clientUid];
  xOffset = (canvas.width / 2) - clientPlayer.x;
  yOffset = (canvas.height / 2) - clientPlayer.y;

  drawGrid(xOffset, yOffset);

  Object.keys(clientPlayers).forEach(uid => {
    const { x, y, radius, color } = clientPlayers[uid];

    drawCircle({
      x: x + xOffset,
      y: y + yOffset,
      radius,
      color,
    });
  });

  drawDebugger();
}

canvas.addEventListener('mousemove', event => {
  moveX = Math.min(1, Math.max(-1, event.clientX - canvas.width / 2))
  moveY = Math.min(1, Math.max(-1, event.clientY - canvas.height / 2))
});

window.addEventListener('resize', () => {
  draw();
});

function updatePlayer() {
  const player = clientPlayers[clientUid];
  const verifiedMoveX = Math.max(-1, Math.min(1, moveX));
  const verifiedMoveY = Math.max(-1, Math.min(1, moveY));

  clientPlayers[clientUid] = {
    ...player,
    x: Math.max(0, Math.min(clientConfig.maxX, player.x + verifiedMoveX * player.speed)),
    y: Math.max(0, Math.min(clientConfig.maxY, player.y + verifiedMoveY * player.speed)),
    moveX: verifiedMoveX,
    moveY: verifiedMoveY,
  }

  socket.emit('update', clientUid, {
    moveX,
    moveY,
    clientTime: getRoundedInterval(),
  });
}
