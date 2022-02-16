const generateOtp = () => {
  let randomCode = '';
  while (randomCode.length < 6) {
    randomCode += Math.floor(Math.random() * 9);
  }
  return randomCode;
};

module.exports = { generateOtp };
