const profile = require('express').Router();
const { verifyUser } = require('../helpers/auth');
const uploadImage = require('../helpers/upload');

const { getProfile, updateProfile, changePassword } = require('../controllers/profile');

profile.get('/', verifyUser, getProfile);
profile.patch('/', verifyUser, uploadImage('picture'), updateProfile);
profile.patch('/changePassword', verifyUser, changePassword);

module.exports = profile;
