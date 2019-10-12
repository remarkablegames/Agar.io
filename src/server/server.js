const http = require('http');
const app = require('./app');

const server = http.Server(app);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Listening on *:${PORT}`));

module.exports = server;
