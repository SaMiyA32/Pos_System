class ItemDTO {
    constructor(code, name, price, quantity) {
        this._code = code;
        this._name = name;
        this._price = price;
        this._quantity = quantity;
    }

    get code() {
        return this._code;
    }

    get name() {
        return this._name;
    }

    get price() {
        return this._price;
    }

    get quantity() {
        return this._quantity;
    }

    set code(code) {
        this._code = code;
    }

    set name(name) {
        this._name = name;
    }

    set price(price) {
        this._price = price;
    }

    set quantity(quantity) {
        this._quantity = quantity;
    }
}

export default ItemDTO;