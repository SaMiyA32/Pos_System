class CustomerDTO {
    constructor(id, name, contact, address) {
        this._id = id;
        this._name = name;
        this._contact = contact;
        this._address = address;
    }

    get id() {
        return this._id;
    }

    get name() {
        return this._name;
    }

    get contact() {
        return this._contact;
    }

    get address() {
        return this._address;
    }

    set id(id) {
        this._id = id;
    }

    set name(name) {
        this._name = name;
    }

    set contact(contact) {
        this._contact = contact;
    }

    set address(address) {
        this._address = address;
    }
}

export default CustomerDTO;