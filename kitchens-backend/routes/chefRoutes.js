const express = require('express');
const router = express.Router();
const chefController = require('../controllers/chefController');
const upload = require('../middleware/upload');

router.get('/active', chefController.getVerifiedChefs);
router.get('/profile/:userId', chefController.getChefProfileByUserId);
router.get('/menu/:chefId', chefController.getMenu);

router.post('/food', upload.single('image'), chefController.addFoodItem);
router.put('/food/:id', upload.single('image'), chefController.updateFoodItem);
router.delete('/food/:id', chefController.deleteFoodItem);

module.exports = router;