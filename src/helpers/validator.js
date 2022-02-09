// regex test
const checkIntegerFormat = (data) => /^[1-9][0-9]*/.test(data); // check apakah data isinya hanya digit yang awalnya bukan 0
const checkPriceFormat = (data) => /^[^-0+]\d+.\d{2}?$/.test(data) || /^0$/.test(data);
const checkBoolean = (data) => /^[01]$/.test(data);
const timeValidation = (data) => /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(data);
const phoneNumberValidation = (data) => /^[+0]\d+$/.test(data);
const dateValidation = (data) => /^[^0]\d{3}-(0?[1-9]|1[012])-(0?[1-9]|[12][0-9]|3[01])$/.test(data);
const emailValidation = (data) => /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(data);
const passwordValidation = (data) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,20})/.test(data);

const idValidator = (id) => {
  if (Number.isNaN(Number(id))) {
    return true;
  }
  return false;
};

module.exports = {
  checkIntegerFormat,
  checkPriceFormat,
  checkBoolean,
  timeValidation,
  idValidator,
  phoneNumberValidation,
  dateValidation,
  emailValidation,
  passwordValidation,
};
