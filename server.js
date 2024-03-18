const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Sample data
const productWeight = {
    'A': 3, 'B': 2, 'C': 8,
    'D': 12, 'E': 25, 'F': 15,
    'G': 0.5, 'H': 1, 'I': 2
};

const deliveryDistance = {
    'C1': { 'C2': 4, 'L1': 3 },
    'C2': { 'C1': 4, 'C3': 3, 'L1': 2.5 },
    'C3': { 'C2': 3, 'L1': 2 }
};

// Middleware
app.use(bodyParser.json());

// Calculate minimum cost endpoint
app.post('/calculate_min_cost', (req, res) => {
    const order = req.body;
    console.log('Request Body:', order); // Log the entire request body
    
    // Calculate total weight
    const totalWeight = calculateTotalWeight(order);
    console.log('Total Weight:', totalWeight); // Log the total weight
    
    // Initialize minimum cost with Infinity
    let minCost = Infinity;

    // Iterate through each center and calculate cost
    for (const startCenter in deliveryDistance) {
        if (deliveryDistance.hasOwnProperty(startCenter)) {
            // Calculate total distance and cost to deliver from current center to L1
            let currentCenter = startCenter;
            let costToPickupCenters = 0;
           while (currentCenter !== 'L1' && deliveryDistance[currentCenter]) {
    const nextCenter = 'L1';
    const distanceToNextCenter = deliveryDistance[currentCenter][nextCenter];
    costToPickupCenters += distanceToNextCenter;
    currentCenter = nextCenter;
}


            // Calculate cost to deliver from pickup centers to L1
            const deliveryCostToL1 = deliveryDistance[startCenter]['L1'];
            
            // Determine the delivery cost unit based on total weight
            let deliveryCostUnit;
            if (isNaN(totalWeight)) {
                console.error('Total weight is not a number');
                break;
            }
            if (totalWeight <= 5) {
                deliveryCostUnit = 10; // If total weight is <= 5, cost is 10 rupees per unit of distance
            } else {
                const extraWeight = totalWeight - 5;
                deliveryCostUnit = 10 + 8 * Math.ceil(extraWeight / 5); // Additional 8 rupees per unit for each additional 5 kg
            }
            
            // Calculate total cost
            const cost = deliveryCostUnit * (costToPickupCenters + deliveryCostToL1);
            minCost = Math.min(minCost, cost);
        }
    }

    // Send the minimum cost as response
    res.json({ minimum_cost: minCost });
});





// Function to calculate total weight of the order
function calculateTotalWeight(order) {
    let totalWeight = 0;
    for (const product in order) {
        if (order.hasOwnProperty(product)) {
            if (productWeight.hasOwnProperty(product)) {
                totalWeight += productWeight[product] * order[product];
            } else {
                console.error('Product', product, 'does not have weight defined');
            }
        }
    }
    return totalWeight;
}

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
