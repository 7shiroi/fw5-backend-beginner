const multer = require('multer');

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

const uploadImage = multer({ storage, fileFilter: imageFileFilter });

module.exports = uploadImage;
