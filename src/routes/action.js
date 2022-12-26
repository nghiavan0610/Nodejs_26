const express = require('express');
const router = express.Router();
const protect = require('../middlewares/AuthMiddleware');
const requiredRoles = require('../middlewares/RoleMiddelware');

const actionController = require('../app/controllers/ActionController');

router.post('/likeResAction', actionController.likeResAction);
router.put('/rateResAction', actionController.rateResAction);



module.exports = router;
