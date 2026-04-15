const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');

router.get('/pending-chefs', auth, adminController.getPendingChefs);
router.patch('/verify-chef/:id', auth, adminController.verifyChef);
router.get('/stats', auth, adminController.getSystemStats);

module.exports = router;