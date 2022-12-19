const express = require('express');
const router = express.Router();

const usersController = require('../app/controllers/UsersController');

router.get('/create', usersController.create);
router.post('/store', usersController.store);
router.get('/:user_id/edit', usersController.edit);
router.put('/:user_id', usersController.update);
router.delete('/:user_id', usersController.destroy);
router.delete('/:user_id/force', usersController.forceDestroy);
router.patch('/:user_id/restore', usersController.restore);

router.get('/:user_id', usersController.show);
router.post('/:user_id/likeResAction', usersController.likeResAction);
router.put('/:user_id/rateResAction', usersController.rateResAction);

// router.post('/:user_id/order', usersController.order);

module.exports = router;
