const random = max => Math.floor(Math.random() * max); 

const getRoundedInterval = () => {
  const now = Date.now();
  return Math.floor(now / 16) * 16 
};


module.exports = {
  random,
  getRoundedInterval,
};
