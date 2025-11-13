
import { customers_db } from "../db/DB.js";
import CustomerDTO from "../dto/CustomerDTO.js"; // Assumes DTO is available

const add_customer = (name, contact, address) => {
    // Generate new ID (safe for array-only storage)
    let id = customers_db.length > 0 ? Math.max(...customers_db.map(c => c.id)) + 1 : 1;
    let customer_obj = new CustomerDTO(id, name, contact, address);
    customers_db.push(customer_obj);
}

const update_customer = (id, name, contact, address) => {
    let index = customers_db.findIndex(c => c.id == id);
    if (index !== -1) {
        customers_db[index].name = name;
        customers_db[index].contact = contact;
        customers_db[index].address = address;
        return true;
    }
    return false;
}

const delete_customer = (id) => {
    let index = customers_db.findIndex(c => c.id == id);
    if (index !== -1) {
        customers_db.splice(index, 1);
    }
}

const get_customers = () => {
    return customers_db;
}

const get_customer_details = (id) => {
    let index = customers_db.findIndex(c => c.id == id);
    if (index !== -1) {
        return customers_db[index];
    }
    return null;
}

export { add_customer, update_customer, delete_customer, get_customers, get_customer_details };