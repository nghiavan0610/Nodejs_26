const express = require('express');
const router = express.Router();

const meController = require('../app/controllers/MeController');

router.get('/stored/restaurants', meController.storedRestaurants);
router.get('/trash/restaurants', meController.trashRestaurants);

router.get('/stored/users', meController.storedUsers);
router.get('/trash/users', meController.trashUsers);

module.exports = router;
