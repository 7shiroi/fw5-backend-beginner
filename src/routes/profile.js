const profile = require('express').Router();
// const cors = require('cors');
const { verifyUser } = require('../helpers/auth');
const uploadImage = require('../helpers/upload');

const { getProfile, updateProfile, changePassword } = require('../controllers/profile');

// const corsOptions = {
//   origin: 'http://localhost:3000',
// };

profile.get('/', verifyUser, getProfile);
profile.patch('/', verifyUser, uploadImage('picture'), updateProfile);
profile.patch('/changePassword', verifyUser, changePassword);

module.exports = profile;
