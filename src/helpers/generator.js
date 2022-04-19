const { ALPHABETS } = require('./utils');

const randomNumber = (length) => {
  let result = '';
  for (let i = 0; i < length; i += 1) {
    result += Math.floor(Math.random() * 10);
  }
  return result;
};

const randomBookingCode = (length, alphabetsLength) => {
  let result = '';
  for (let i = 0; i < alphabetsLength; i += 1) {
    result += ALPHABETS[Math.floor(Math.random() * ALPHABETS.length)];
  }
  for (let i = 0; i < length - alphabetsLength; i += 1) {
    result += Math.floor(Math.random() * 10);
  }
  return result;
};

module.exports = {
  randomNumber,
  randomBookingCode,
};
