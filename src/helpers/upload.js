const multer = require('multer');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, '/uploads/vehicles/');
  },
  filename(req, file, cb) {
    const fileOriginalName = file.originalname.split('.');
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}.${fileOriginalName[(fileOriginalName.length - 1)]}`);
  },
});

function imageFileFilter(req, file, cb) {
  if (file.mimetype !== 'image/jpeg') {
    cb(new Error('Filetype mismatch!'), false);
  } else {
    cb(null, true);
  }
}

const uploadImage = multer({ storage, imageFileFilter });

module.exports = uploadImage;
