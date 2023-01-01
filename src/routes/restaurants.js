const express = require('express');
const router = express.Router();
const protect = require('../middlewares/AuthMiddleware');
const requiredRoles = require('../middlewares/RoleMiddelware');

const restaurantsController = require('../app/controllers/RestaurantsController');
const foodsController = require('../app/controllers/FoodsController');

// Foods routes
router.get(
  '/:res_slug/foods/create',
  protect,
  requiredRoles('admin', 'manage'),
  foodsController.create,
);
router.post(
  '/:res_slug/foods/store',
  protect,
  requiredRoles('admin', 'manage'),
  foodsController.store,
);
router.get(
  '/:res_slug/foods/:food_id/edit',
  protect,
  requiredRoles('admin', 'manage'),
  foodsController.edit,
);
router.put(
  '/:res_slug/foods/:food_id',
  protect,
  requiredRoles('admin', 'manage'),
  foodsController.update,
);
router.delete(
  '/:res_slug/foods/:food_id',
  protect,
  requiredRoles('admin', 'manage'),
  foodsController.destroy,
);
router.delete(
  '/:res_slug/foods/:food_id/force',
  protect,
  requiredRoles('admin', 'manage'),
  foodsController.forceDestroy,
);
router.patch(
  '/:res_slug/foods/:food_id/restore',
  protect,
  requiredRoles('admin', 'manage'),
  foodsController.restore,
);

router.get(
  '/:res_slug/foods/trash',
  protect,
  requiredRoles('admin', 'manage'),
  foodsController.trashFoods,
);
router.get('/:res_slug/foods', protect, foodsController.storedFoods);

// Restaurants routes
router.get('/create', protect, requiredRoles('admin'), (req, res) =>
  res.render('restaurants/create'),
);
router.post(
  '/create',
  protect,
  requiredRoles('admin'),
  restaurantsController.create,
);
router.get(
  '/:res_slug/edit',
  protect,
  requiredRoles('admin', 'manage'),
  restaurantsController.edit,
);
router.put(
  '/:res_slug',
  protect,
  requiredRoles('admin', 'manage'),
  restaurantsController.update,
);
router.delete(
  '/:res_id',
  protect,
  requiredRoles('admin', 'manage'),
  restaurantsController.destroy,
);
router.delete(
  '/:res_id/force',
  protect,
  requiredRoles('admin'),
  restaurantsController.forceDestroy,
);
router.patch(
  '/:res_id/restore',
  protect,
  requiredRoles('admin', 'manage'),
  restaurantsController.restore,
);

router.get('/:res_slug', protect, restaurantsController.show);

module.exports = router;
