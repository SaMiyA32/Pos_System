
import { items_db } from "../db/DB.js";
import ItemDTO from "../dto/ItemDTO.js"; // Assumes DTO is available

const add_item = (code, name, price, quantity) => {
    let item_obj = new ItemDTO(code, name, price, quantity);
    items_db.push(item_obj);
}

const update_item = (code, name, price, quantity) => {
    let index = items_db.findIndex(i => i.code === code);
    if (index !== -1) {
        items_db[index].name = name;
        items_db[index].price = price;
        items_db[index].quantity = quantity;
        return true;
    }
    return false;
}

const delete_item = (code) => {
    let index = items_db.findIndex(i => i.code === code);
    if (index !== -1) {
        items_db.splice(index, 1);
    }
}

const get_items = () => {
    return items_db;
}

const get_item_details = (code) => {
    let index = items_db.findIndex(i => i.code === code);
    if (index !== -1) {
        return items_db[index];
    }
    return null;
}

export { add_item, update_item, delete_item, get_items, get_item_details };