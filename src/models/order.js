const fs = require('fs');

//TODO: Conectar a una base de datos o al menos a un archivo del sistema :/
const orders = [];

module.exports = class Order {
    constructor(_id, _data) {
        this.id = _id;
        this.data = _data;
    }
    save() {
        orders.push(this);
    }
    static findById(_id){
        return orders.filter(order => order.id === _id);
    }
}