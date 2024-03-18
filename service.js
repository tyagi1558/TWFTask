// service.js

const productWeight = {
    'A': 3, 'B': 2, 'C': 8,
    'D': 12, 'E': 25, 'F': 15,
    'G': 0.5, 'H': 1, 'I': 2
};

const deliveryDistance = {
    'C1': { 'C2': 4, 'L1': 3 },
    'C2': { 'C1': 4, 'C3': 3, 'L1': 2.5 },
    'C3': { 'C2': 3, 'L1': 2 },
    'L1': {}
};

function calculateMinimumCost(order) {
    const totalWeight = calculateTotalWeight(order);
    let minCost = Infinity;

    for (const startCenter in deliveryDistance) {
        if (deliveryDistance.hasOwnProperty(startCenter)) {
            const cost = dijkstra(startCenter, 'L1', deliveryDistance, totalWeight);
            minCost = Math.min(minCost, cost);
        }
    }

    return minCost;
}

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

function dijkstra(start, end, graph, totalWeight) {
    const nodes = Object.keys(graph);
    const distances = {};
    const parents = {};

    nodes.forEach(node => {
        distances[node] = Infinity;
        parents[node] = null;
    });
    distances[start] = 0;

    const visited = new Set();
    while (true) {
        let smallest = null;
        for (const node of nodes) {
            if (!visited.has(node) && (smallest === null || distances[node] < distances[smallest])) {
                smallest = node;
            }
        }

        if (smallest === null || distances[smallest] === Infinity) {
            break;
        }

        visited.add(smallest);

        for (const neighbor in graph[smallest]) {
            const alt = distances[smallest] + graph[smallest][neighbor];
            if (alt < distances[neighbor]) {
                distances[neighbor] = alt;
                parents[neighbor] = smallest;
            }
        }
    }

    let current = end;
    let totalDistance = 0;
    if (start !== end) { // Check if start and end are different
        while (current !== start) {
            const parent = parents[current];
            if (!parent) {
                console.error('No path found from', start, 'to', end);
                return Infinity; // Return Infinity if no valid path found
            }
            totalDistance += graph[parent][current];
            current = parent;
        }
    }

    let deliveryCostUnit;
    if (isNaN(totalWeight)) {
        console.error('Total weight is not a number');
        return Infinity;
    }
    if (totalWeight <= 5) {
        deliveryCostUnit = 10;
    } else {
        const extraWeight = totalWeight - 5;
        deliveryCostUnit = 10 + 8 * Math.ceil(extraWeight / 5);
    }

    const cost = deliveryCostUnit * totalDistance;
    return cost === Infinity ? Number.MAX_SAFE_INTEGER : cost; // Return the maximum safe integer if cost is Infinity
}

module.exports = { calculateMinimumCost };
