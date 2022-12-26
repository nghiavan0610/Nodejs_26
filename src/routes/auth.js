const express = require('express');
const router = express.Router();
const protect = require('../middlewares/AuthMiddleware');
const requiredRoles = require('../middlewares/RoleMiddelware');

const authController = require('../app/controllers/AuthController');

// Login
router.get('/login', (req, res) => res.render('auth/login', { layout: 'main-2' }));
router.post('/login', authController.login);


// Register
router.get('/register', (req, res) => res.render('auth/register', { layout: 'main-2' }));
router.post('/register', authController.register);

// Logout
router.get('/logout', authController.logout);


// Home
router.get('/', protect, authController.index);

module.exports = router;
