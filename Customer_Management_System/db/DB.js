let customers_db = [];
let items_db = [];
let orders_db = [];
let currentOrder = {
    id: 'ORD001',
    customerId: null,
    items: [],
    date: new Date().toISOString()
};

export { customers_db, items_db, orders_db, currentOrder };