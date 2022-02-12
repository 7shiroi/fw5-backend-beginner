// regex test
const checkIntegerFormat = (data) => /^[1-9][0-9]*$/.test(data); // check apakah data isinya hanya digit yang awalnya bukan 0
const checkIntegerFormatCanZero = (data) => /^[1-9][0-9]*$|^0$/.test(data); // check apakah data isinya hanya digit yang awalnya bukan 0
const checkPriceFormat = (data) => /^[^-0+]\d+.\d{2}?$/.test(data) || /^0$/.test(data);
const checkBoolean = (data) => /^[01]$/.test(data);
const timeValidation = (data) => /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(data);
const phoneNumberValidation = (data) => /^[+0]\d+$/.test(data);
const dateValidation = (data) => /^[^0]\d{3}-(0?[1-9]|1[012])-(0?[1-9]|[12][0-9]|3[01])$/.test(data);
const emailValidation = (data) => /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(data);
const passwordValidation = (data) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,20})/.test(data);

const idValidator = (id) => {
  if (/^[1-9][0-9]*/.test(id)) {
    return true;
  }
  return false;
};

const varcharValidator = (data, max, min = 1) => {
  if (data.length >= min && data.length <= max) {
    return true;
  }
  return false;
};

const inputValidator = (req, fillable) => {
  const error = [];
  const data = {};
  fillable.forEach((input) => {
    if (!req.body[input.field] && input.required) {
      error.push(`${input.field} cannot be empty`);
    } else if (req.body[input.field]) {
      if (input.type === 'integer') {
        if (input.can_zero) {
          if (!checkIntegerFormatCanZero(req.body[input.field])) {
            error.push(`Invalid ${input.field} format`);
          }
        } else if (!checkIntegerFormat(req.body[input.field])) {
          error.push(`Invalid ${input.field} format`);
        }
      }
      if (input.type === 'price' && !checkPriceFormat(req.body[input.field])) {
        error.push(`Invalid ${input.field} format`);
      }
      if (input.type === 'varchar' && !varcharValidator(req.body[input.field].trim(), input.max_length)) {
        error.push(`Invalid ${input.field} format`);
      }
      if (input.type === 'boolean' && !checkBoolean(req.body[input.field])) {
        error.push(`Invalid ${input.field} format`);
      }
      if (input.type === 'time' && !timeValidation(req.body[input.field])) {
        error.push(`Invalid ${input.field} format`);
      }
      if (input.type === 'text' && req.body[input.field].trim().length === 0) {
        error.push(`Invalid ${input.field} format`);
      }
      data[input.field] = req.body[input.field];
    }
  });
  return { error, data };
};

module.exports = {
  checkIntegerFormat,
  checkPriceFormat,
  checkBoolean,
  timeValidation,
  phoneNumberValidation,
  dateValidation,
  emailValidation,
  passwordValidation,
  idValidator,
  varcharValidator,
  inputValidator,
};
