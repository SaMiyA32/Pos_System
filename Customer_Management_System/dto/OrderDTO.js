class OrderDTO {
    constructor(id, customerId, items, total, date) {
        this._id = id;
        this._customerId = customerId;
        this._items = items;
        this._total = total;
        this._date = date;
    }

    get id() {
        return this._id;
    }

    get customerId() {
        return this._customerId;
    }

    get items() {
        return this._items;
    }

    get total() {
        return this._total;
    }

    get date() {
        return this._date;
    }
}

export default OrderDTO;