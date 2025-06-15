let transactions = [];

function logTransaction({ type, productId, quantity, orderId, details }) {
    transactions.push({
        type,
        productId,
        quantity,
        orderId,
        details: details || null,
        timestamp: new Date().toISOString(),
    });
}

function getAllTransactions() {
    return transactions;
}

module.exports = {
    logTransaction,
    getAllTransactions,
};
