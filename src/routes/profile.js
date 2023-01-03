const express = require('express');
const router = express.Router();
const protect = require('../middlewares/AuthMiddleware');
const upload = require('../middlewares/UploadMiddleware');

const profileController = require('../app/controllers/ProfileController');

// User routes
router.get('/edit', protect, profileController.edit);
router.put('/update', protect, profileController.update);
router.get('/history', protect, profileController.history);
router.get('/history/:order_id', protect, profileController.historyDetail);

router.post(
  '/avatar/upload',
  protect,
  upload.single('avatar'),
  profileController.upload,
);

router.get('/', protect, profileController.show);

module.exports = router;
