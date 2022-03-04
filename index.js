const express = require('express');
require('dotenv').config();
const multer = require('multer');
const cors = require('cors');

const upload = multer();

const { PORT, APP_PORT } = process.env;

const corsOptions = {
  origin: 'http://localhost:3000',
};

const app = express();

app.use(express.urlencoded({ extended: true }));

app.options('*', cors(corsOptions));
app.use(require('./src/routes'));

app.use(upload.array());
app.use('/uploads', express.static('uploads'));

app.listen(PORT || APP_PORT, () => {
  console.log(`App listening on port ${PORT || APP_PORT}`);
});
