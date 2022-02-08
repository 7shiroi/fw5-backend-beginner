const express = require('express');
require('dotenv').config();
const multer = require('multer');

const upload = multer();

const { PORT, APP_PORT } = process.env;

const app = express();

app.use(express.urlencoded({ extended: true }));

app.use(require('./src/routes'));

app.use(upload.array());
app.use('/uploads', express.static('uploads'));

app.listen(PORT || APP_PORT, () => {
  console.log(`App listening on port ${PORT || APP_PORT}`);
});
