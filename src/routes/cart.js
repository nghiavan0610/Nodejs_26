const express = require('express');
const router = express.Router();
const protect = require('../middlewares/AuthMiddleware');
const requiredRoles = require('../middlewares/RoleMiddelware');

const cartController = require('../app/controllers/CartController');

// Cart routes
router.post('/order', protect, cartController.order);

router.put('/quantity-update', protect, cartController.quantityUpdate);
router.delete('/:order_detail_id', protect, cartController.destroy);
router.get('/thank-you-for-your-order', protect, (req, res) => {
  res.render('shopping-cart/thank');
});

router.post('/pay', protect, cartController.pay);

router.get('/', protect, cartController.cart);

module.exports = router;
