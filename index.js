const express = require('express');
require('dotenv').config();

const { APP_PORT } = process.env;

const app = express();

app.use(express.urlencoded({ extended: true }));

app.use(require('./src/routes'));

app.listen(APP_PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${APP_PORT}`);
});
