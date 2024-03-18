// controller.js

const { calculateMinimumCost } = require('./service');

function calculateMinCostController(req, res) {
    const order = req.body;
    if (!order || typeof order !== 'object') {
        return res.status(400).json({ error: 'Invalid order format' });
    }

    const minCost = calculateMinimumCost(order);
    res.json({ minimum_cost: minCost });
}

module.exports = { calculateMinCostController };
