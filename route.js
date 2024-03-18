// route.js

const express = require('express');
const router = express.Router();
const { calculateMinCostController } = require('./controler');

router.post('/calculate_min_cost', calculateMinCostController);

module.exports = router;
