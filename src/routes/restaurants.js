const express = require('express');
const router = express.Router();

const restaurantsController = require('../app/controllers/RestaurantsController');

router.get('/create', restaurantsController.create);
router.post('/store', restaurantsController.store);
router.get('/:res_id/edit', restaurantsController.edit);
router.put('/:res_id', restaurantsController.update);
router.delete('/:res_id', restaurantsController.destroy);
router.delete('/:res_id/force', restaurantsController.forceDestroy);
router.patch('/:res_id/restore', restaurantsController.restore);

router.get('/:slug', restaurantsController.show);

module.exports = router;
