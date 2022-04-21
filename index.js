const express = require('express');
require('dotenv').config();
const multer = require('multer');
const cors = require('cors');
const { createClient } = require('redis');

const upload = multer();

const { PORT, APP_PORT } = process.env;

// const corsOptions = {
//   origin: 'http://localhost:3000',
// };

(async () => {
  const client = createClient();

  client.on('error', (err) => console.log('Redis Client Error', err));

  await client.connect();

  await client.set('key', 'value');
  const value = await client.get('key');
})();

const app = express();

app.use(express.urlencoded({ extended: true }));

// app.options('*', cors(corsOptions));

app.use(cors());
app.use(require('./src/routes'));

app.use(upload.array());
app.use('/uploads', express.static('uploads'));

app.listen(PORT || APP_PORT, () => {
  console.log(`App listening on port ${PORT || APP_PORT}`);
});
