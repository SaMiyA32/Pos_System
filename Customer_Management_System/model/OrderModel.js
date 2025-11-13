
import { orders_db, currentOrder } from "../db/DB.js";
import { get_customer_details } from "./CustomerModel.js";
import { get_item_details, update_item } from "./ItemModel.js";

const add_to_cart = (itemCode, quantity) => {
    let item = get_item_details(itemCode);
    if (!item) return false;

    if (quantity > item.quantity) {
        throw new Error(`Only ${item.quantity} items available in stock`);
    }

    let existingItemIndex = currentOrder.items.findIndex(i => i.code === itemCode);

    if (existingItemIndex !== -1) {
        let newQuantity = currentOrder.items[existingItemIndex].quantity + quantity;
        if (newQuantity > item.quantity) {
            throw new Error(`Only ${item.quantity} items available in stock`);
        }
        currentOrder.items[existingItemIndex].quantity = newQuantity;
    } else {
        currentOrder.items.push({
            code: item.code,
            name: item.name,
            price: item.price,
            quantity: quantity
        });
    }

    return true;
}

const remove_from_cart = (itemCode) => {
    let index = currentOrder.items.findIndex(i => i.code === itemCode);
    if (index !== -1) {
        currentOrder.items.splice(index, 1);
    }
}

const clear_cart = () => {
    currentOrder.items = [];
    currentOrder.customerId = null;
}

const place_order = (customerId) => {
    if (!customerId || currentOrder.items.length === 0) {
        throw new Error('Customer and at least one item required');
    }

    // Update stock quantities (Uses update_item from ItemModel)
    currentOrder.items.forEach(orderItem => {
        let item = get_item_details(orderItem.code);
        if (item) {
            update_item(item.code, item.name, item.price, item.quantity - orderItem.quantity);
        }
    });

    currentOrder.customerId = customerId;
    currentOrder.total = calculate_order_total();
    currentOrder.date = new Date().toISOString();

    orders_db.push({...currentOrder});

    let placedOrder = { ...currentOrder };

    // Reset current order
    currentOrder.id = generate_order_id();
    currentOrder.customerId = null;
    currentOrder.items = [];
    currentOrder.date = new Date().toISOString();

    return placedOrder;
}

const calculate_order_total = () => {
    return currentOrder.items.reduce((total, item) => {
        return total + (item.price * item.quantity);
    }, 0);
}

const get_orders = () => {
    return orders_db.map(order => {
        let customer = get_customer_details(order.customerId);
        return {
            ...order,
            customerName: customer ? customer.name : 'Unknown Customer'
        };
    });
}

const get_current_order = () => {
    return currentOrder;
}

const generate_order_id = () => {
    // Generate next ID based on current orders_db length
    return 'ORD' + (orders_db.length + 1).toString().padStart(3, '0');
}

export {
    add_to_cart,
    remove_from_cart,
    clear_cart,
    place_order,
    calculate_order_total,
    get_orders,
    get_current_order
};