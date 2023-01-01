const express = require('express');
const router = express.Router();
const protect = require('../middlewares/AuthMiddleware');
const requiredRoles = require('../middlewares/RoleMiddelware');

const usersController = require('../app/controllers/UsersController');

// User routes
router.get('/create', protect, requiredRoles('admin'), (req, res) =>
  res.render('users/create'),
);
router.post('/create', protect, requiredRoles('admin'), usersController.create);
router.get(
  '/:user_slug/edit',
  protect,
  requiredRoles('admin', 'manager'),
  usersController.edit,
);
router.put(
  '/:user_slug',
  protect,
  requiredRoles('admin', 'manager'),
  usersController.update,
);
router.delete(
  '/:user_id',
  protect,
  requiredRoles('admin', 'manager'),
  usersController.destroy,
);
router.delete(
  '/:user_id/force',
  protect,
  requiredRoles('admin'),
  usersController.forceDestroy,
);
router.patch(
  '/:user_id/restore',
  protect,
  requiredRoles('admin', 'manager'),
  usersController.restore,
);

router.get('/:user_slug', protect, usersController.show);

module.exports = router;
