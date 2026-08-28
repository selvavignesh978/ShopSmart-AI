const express = require('express');
const { logView, getRecommendations } = require('../controllers/recommendationController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.post('/history/view', logView);
router.get('/recommendations', getRecommendations);

module.exports = router;
