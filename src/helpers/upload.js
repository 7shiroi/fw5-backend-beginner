const multer = require('multer');
const responseHandler = require('./responseHandler');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, `uploads${req.baseUrl}`);
  },
  filename(req, file, cb) {
    const fileOriginalName = file.originalname.split('.');
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, `${req.baseUrl}-${uniqueSuffix}.${fileOriginalName[(fileOriginalName.length - 1)]}`);
  },
});

function imageFileFilter(req, file, cb) {
  const supportedMimeType = ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml', 'image/tiff'];
  if (!supportedMimeType.includes(file.mimetype)) {
    cb(new Error('Filetype mismatch!'), false);
  } else {
    cb(null, true);
  }
}

const uploadImage = (key, maxSize = null) => {
  const upload = multer({
    storage,
    fileFilter: imageFileFilter,
    limits: {
      fileSize: maxSize || 2097152, // max 2MB
    },
  }).single(key);

  return (req, res, next) => {
    upload(req, res, (err) => {
      if (err) {
        return responseHandler(res, 400, err.message);
      }
      return next();
    });
  };
};

module.exports = uploadImage;
