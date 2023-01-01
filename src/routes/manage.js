const express = require('express');
const router = express.Router();

const protect = require('../middlewares/AuthMiddleware');
const requiredRoles = require('../middlewares/RoleMiddelware');

const manageController = require('../app/controllers/ManageController');

router.get('/stored/restaurants', protect, manageController.storedRestaurants);
router.get(
  '/trash/restaurants',
  protect,
  requiredRoles('admin', 'manage'),
  manageController.trashRestaurants,
);

router.get('/stored/users', protect, manageController.storedUsers);
router.get(
  '/trash/users',
  protect,
  requiredRoles('admin', 'manage'),
  manageController.trashUsers,
);

module.exports = router;
