const randomColor = require('randomcolor');
const config = require('./config');
const helpers = require('./helpers');

let players = {};

class Players {
  /**
   * @param {string} uid
   * @return {Object}
   */
  static add(uid) {
    if (!uid || typeof uid !== 'string') {
      return;
    }
    return players[uid] = {
      uid,
      color: randomColor(),
      radius: 40,
      x: helpers.random(config.maxX),
      y: helpers.random(config.maxY),
      speed: 3,
      moveX: 0,
      moveY: 0,
    };
  }

  /**
   * @param {string} [uid]
   * @return {Object}
   */
  static get(uid) {
    if (uid) {
      return players[uid];
    }
    return players;
  }

  /**
   * @param {string} uid
   * @param {Object} data
   * @param {number} data.moveX
   * @param {number} data.moveY
   */
  static update(uid, data) {
    const player = players[uid];
    if (!players[uid]) {
      return;
    }

    const { moveX, moveY, clientTime } = data;
    const verifiedMoveX = Math.max(-1, Math.min(1, moveX));
    const verifiedMoveY = Math.max(-1, Math.min(1, moveY));

    players[uid] = {
      ...player,
      clientTime, 
      x: Math.max(0 , Math.min(config.maxX, player.x + verifiedMoveX * player.speed)),
      y: Math.max(0 , Math.min(config.maxY, player.y + verifiedMoveY * player.speed)),
      moveX: verifiedMoveX,
      moveY: verifiedMoveY,
    };
  }

  /**
   * @param {string} uid
   */
  static remove(uid) {
    if (players[uid]) {
      delete players[uid];
    }
  }
}

module.exports = Players;
