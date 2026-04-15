const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const auth = require('../middleware/auth');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.put('/profile', auth, authController.updateProfile);
router.post('/address', auth, authController.addAddress);
router.delete('/address/:addressId', auth, authController.deleteAddress);

module.exports = router;