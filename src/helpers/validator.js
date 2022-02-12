// regex test
exports.checkIntegerFormat = (data) => /^[1-9][0-9]*$/.test(data); // check apakah data isinya hanya digit yang awalnya bukan 0
exports.checkPriceFormat = (data) => /^[^-0+]\d+.\d{2}?$/.test(data) || /^0$/.test(data);
exports.checkBoolean = (data) => /^[01]$/.test(data);
exports.timeValidation = (data) => /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(data);
exports.phoneNumberValidation = (data) => /^[+0]\d+$/.test(data);
exports.dateValidation = (data) => /^[^0]\d{3}-(0?[1-9]|1[012])-(0?[1-9]|[12][0-9]|3[01])$/.test(data);
exports.emailValidation = (data) => /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(data);
exports.passwordValidation = (data) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,20})/.test(data);

exports.idValidator = (id) => {
  if (/^[1-9][0-9]*/.test(id)) {
    return true;
  }
  return false;
};

exports.varcharValidator = (data, max, min = 1) => {
  if (data.length >= min && data.length <= max) {
    return true;
  }
  return false;
};
