const express = require('express');
const router = express.Router();

const restaurantsController = require('../app/controllers/RestaurantsController');
const foodsController = require('../app/controllers/FoodsController');

// Foods routes
router.get('/:res_slug/foods/create', foodsController.create);
router.post('/:res_slug/foods/store', foodsController.store);
router.get('/:res_slug/foods/:food_id/edit', foodsController.edit);
router.put('/:res_slug/foods/:food_id', foodsController.update);
router.delete('/:res_slug/foods/:food_id', foodsController.destroy);
router.delete('/:res_slug/foods/:food_id/force', foodsController.forceDestroy);
router.patch('/:res_slug/foods/:food_id/restore', foodsController.restore);

router.get('/:res_slug/foods/trash', foodsController.trashFoods);
router.get('/:res_slug/foods', foodsController.storedFoods);

// Restaurants routes
router.get('/create', restaurantsController.create);
router.post('/store', restaurantsController.store);
router.get('/:res_slug/edit', restaurantsController.edit);
router.put('/:res_slug', restaurantsController.update);
router.delete('/:res_id', restaurantsController.destroy);
router.delete('/:res_id/force', restaurantsController.forceDestroy);
router.patch('/:res_id/restore', restaurantsController.restore);

router.get('/:res_slug', restaurantsController.show);

module.exports = router;
