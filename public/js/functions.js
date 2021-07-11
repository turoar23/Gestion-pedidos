
// -----------------------------------------------------
// Funciones que interactuan directamente con el usuario
// -----------------------------------------------------

/**
 * Actualiza el DOM con los pedidos que esten activos
 */
async function update() {
    let orders = await getActiveOrders();
    var template = document.querySelector('#order_template');

    let ordersToAdd = [];

    if (orders.length > 0) {
        for (var i = 0; i < orders.length; i++) {
            let clone = document.importNode(template.content, true);
            let status = 'delivering';
            if (orders[i].status == 'Active')
                status = 'active';

            clone.querySelector('.id').textContent = orders[i].gloriaId || "--";
            clone.querySelector('._id').value = orders[i]._id;
            clone.querySelector('.address').textContent = orders[i].address.street;
            clone.querySelector('.restaurant').textContent = orders[i].restaurant;
            clone.querySelector('.payment').textContent = orders[i].payment;
            clone.querySelector('.rider').textContent = orders[i].rider.name || "--";
            clone.querySelector('.status').textContent = orders[i].status;
            clone.querySelector('.status').className += ` ${status}`;

            if (clone.querySelector('#remove') != null) {
                clone.querySelector('#remove').addEventListener("click", function () {
                    let _id = $(this).parent().find('.id').text()
                    removeOrder(_id);
                    update();
                });
            }
            ordersToAdd.push(clone);
        }
    }

    $('#orders').empty();
    $('#orders').append(ordersToAdd);
}
/**
 * Añade una nueva orden basandose en los valores del formulario del pedido
 */
function newOrder() {
    let id = $('.formulario #id').val();
    let app = $('.formulario #app').val();
    let status = $('.formulario #status').val();

    if (id != "") {
        $('.formulario #id').val("");
        addOrder(id, app, status);
    }
    update();
}

function updateStatus(element) {
    let _id = $(element.parentNode).find('._id').val();
    let status = $(element).text();
    let newStatus = "";
    let action = ""

    if (status === 'Active') {
        newStatus = 'Delivering';
        action = "Start delivering"
    }
    else {
        newStatus = 'Completed';
        action = "Completed"
    }

    updateOrderStatus(_id, newStatus, action)
        .then(result => {
            return result.json();
        })
        .then(result => {
            if (result.err)
                throw result.err
            update();
            console.log('Updated');
        })
        .catch(err => {
            alert(err);
        })
}

function showOrderDetails(element) {
    let _id = $(element.parentNode).find('._id').val();

    getOrder(_id)
        .then(order => {
            let modal = $('#showDetailOrder');

            modal.find('h5').text(`Order: ${order.gloriaId || "Sin ID"}`);
            modal.find('#address').val(order.address.street);
            modal.find('#cp').val(order.address.zipcode);
            modal.find('#city').val(order.address.city);
            modal.find('#restaurant').val(order.restaurant);
            modal.find('#payment').val(order.payment);
            modal.find('#status').val(order.status);
            modal.find('#orderId').val(order._id);

            myModal.show();
        })
        .catch(err => {
            alert(err);
        })
}
function modifyOrder() {
    let modal = $('#showDetailOrder');
    let order = {
        _id: modal.find('#orderId').val(),
        address: {
            street: modal.find('#address').val(),
            zipcode: modal.find('#cp').val(),
            city: modal.find('#city').val(),
        },
        // restaurant: modal.find('#restaurant').val(),
        payment: modal.find('#payment').val(),
        status: modal.find('#status').val(),
    }

    updateOrder(order)
        .then(result => {
            console.log(result);
            return result.json;
        })
        .then(result => {
            if (result.err)
                throw result.err
            console.log(result.result);
        })
        .catch(err => {
            console.log(err);
        })
}