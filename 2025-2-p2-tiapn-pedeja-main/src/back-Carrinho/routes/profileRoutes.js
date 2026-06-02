const express = require('express');
const profileController = require('../controllers/profileController');

const router = express.Router();

router.post('/', profileController.createProfile);
router.get('/', profileController.getProfile);
router.put('/', profileController.updateProfile);

module.exports = router;