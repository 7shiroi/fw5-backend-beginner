const checkIntegerFormat = (data) => /^[1-9][0-9]*/.test(data); // check apakah data isinya hanya digit yang awalnya bukan 0
const checkPriceFormat = (data) => /^[^-0+]\d+.\d{2}?$/.test(data) || /^0$/.test(data);
const checkBoolean = (data) => /^[01]$/.test(data);
const timeValidation = (data) => /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(data);

const idValidator = (id) => {
  if (Number.isNaN(Number(id))) {
    return true;
  }
  return false;
};

module.exports = {
  checkIntegerFormat, checkPriceFormat, checkBoolean, timeValidation, idValidator,
};
