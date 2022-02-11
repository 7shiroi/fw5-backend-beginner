const fs = require('fs');

exports.deleteFile = (filePath) => {
  // eslint-disable-next-line consistent-return
  fs.rm(filePath, {}, (errMsg) => {
    if (errMsg) {
      return new Error('Unexpected Error');
    }
  });
};
