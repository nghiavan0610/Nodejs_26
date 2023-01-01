const express = require('express');
const router = express.Router();
const protect = require('../middlewares/AuthMiddleware');
const requiredRoles = require('../middlewares/RoleMiddelware');

const profileController = require('../app/controllers/ProfileController');

// User routes
router.get('/edit', protect, profileController.edit);
router.put('/update', protect, profileController.update);
router.get('/history', protect, profileController.history);
router.get('/history/:order_id', protect, profileController.historyDetail);

router.get('/', protect, profileController.show);

module.exports = router;
