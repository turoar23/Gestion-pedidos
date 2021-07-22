
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
            clone.querySelector('.address').textContent = `${orders[i].address.street} ${orders[i].address.zipcode}`;
            clone.querySelector('.restaurant').textContent = orders[i].restaurant; 8
            clone.querySelector('.fulfill_at').textContent = moment(orders[i].times.find((time) => { return time.action === "fulfill_at" }).by).tz('Europe/Madrid').format('LT');
            clone.querySelector('.rider').textContent = (orders[i].rider) ? orders[i].rider.name : "--";
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
//TODO: unificar con la de arriba
async function updateHistory() {
    let orders = await getCompleteOrders();
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
            clone.querySelector('.address').textContent = `${orders[i].address.street} ${orders[i].address.zipcode}`;
            clone.querySelector('.restaurant').textContent = orders[i].restaurant;
            // clone.querySelector('.payment').textContent = orders[i].payment;
            clone.querySelector('.fulfill_at').remove();
            clone.querySelector('.rider').textContent = (orders[i].rider) ? orders[i].rider.name : "--";
            clone.querySelector('.status').textContent = orders[i].status;
            clone.querySelector('.status').className += ` ${status}`;
            clone.querySelector('.status').onclick = null;
            clone.querySelector('.fa-motorcycle').remove();

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

    $('#ordersHistory').empty();
    $('#ordersHistory').append(ordersToAdd);
}
async function updateListRiders() {
    const riders = await getRiders();
    let modal = $('#assignRider #riderList');

    riders.forEach(rider => {
        modal.append(
            `<li class="list-group-item d-flex justify-content-between align-items-start">
            <span>${rider.name}</span>
            <button class="btn btn-primary" type="button" onclick="assignRider(this)">Assign</button>
            <input type="hidden" class="riderId" value="${rider._id}">
            </li>`
        )
    })
    //myModal.show();
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

function showOrderDetailsEdit(element) {
    let _id = $(element.parentNode).find('._id').val();

    getOrder(_id)
        .then(order => {
            setCardOrder(order, false);

            myModal.show();
        })
        .catch(err => {
            alert(err);
        })
}
function showOrderDetails(element) {
    let _id = $(element.parentNode).find('._id').val();

    getOrder(_id)
        .then(order => {
            var modal = setCardOrder(order, true);

            modal = modal.find('.modal-body');
            var steps = document.createElement('ul');
            // modal.append('<ul class="list-group">');
            steps.className = "list-group";
            order.times.forEach(time => {
                $(steps).append(`
                    <li class="list-group-item">${moment(time.by).format('lll')} ${time.action}</li>
                `)

            });
            modal.append(steps);

            myModal.show();
        })
        .catch(err => {
            alert(err);
        })
}
// TODO: configure by tipe of order and modify the card 
function setCardOrder(order, readonly) {
    let modal = $('#showDetailOrder');

    modal.find('.list-group').remove();

    modal.find('#restaurant').val(order.restaurant);
    modal.find('#restaurant').attr('readonly', true);
    modal.find('#status-row').attr('hidden', false);
    modal.find('#buttom-modify').attr('hidden', readonly);
    modal.find('#buttom-save').attr('hidden', true);

    modal.find('h5').text(`Order: ${order.gloriaId || "Sin ID"}`);
    modal.find('h5').attr('readonly', readonly);
    modal.find('#address').val(order.address.street);
    modal.find('#address').attr('readonly', readonly);
    modal.find('#cp').val(order.address.zipcode);
    modal.find('#cp').attr('readonly', readonly);
    modal.find('#city').val(order.address.city);
    modal.find('#city').attr('readonly', readonly);
    modal.find('#name').val(order.client.name);
    modal.find('#name').attr('readonly', readonly);
    modal.find('#phone').val(order.client.phone);
    modal.find('#phone').attr('readonly', readonly);
    modal.find('#payment').val(order.payment);
    modal.find('#payment').attr('readonly', readonly);
    modal.find('#status').val(order.status);
    modal.find('#status').attr('readonly', readonly);
    modal.find('#orderId').val(order._id);
    modal.find('#orderId').attr('readonly', readonly);


    return modal;
}
function showRiderList(element) {
    let _idOrder = $(element.parentNode).find('._id').val();
    let modal = $('#assignRider #idOrder');

    modal.val(_idOrder);

    riderList.show();
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
        client: {
            name: modal.find('#name').val(),
            phone: modal.find('#phone').val(),
        },
        // restaurant: modal.find('#restaurant').val(),
        payment: modal.find('#payment').val(),
        status: modal.find('#status').val(),
    }

    updateOrder(order)
        .then(result => {
            return result.json;
        })
        .then(result => {
            if (result.err)
                throw result.err
            myModal.hide();
            update();
        })
        .catch(err => {
            console.log(err);
        })
}

function showNewOrderModal() {
    let modal = $('#showDetailOrder');
    modal.find('.list-group').remove();
    modal.find('#buttom-modify').attr('hidden', true);
    modal.find('#buttom-save').attr('hidden', false);

    modal.find('h5').text('New Order');
    modal.find('#restaurant').val('');
    modal.find('#restaurant').attr('readonly', false);
    modal.find('#restaurant').attr('required', true);
    modal.find('#address').val('');
    modal.find('#address').attr('readonly', false);
    modal.find('#cp').val('');
    modal.find('#cp').attr('readonly', false);
    modal.find('#city').val('');
    modal.find('#city').attr('readonly', false);
    modal.find('#name').val('');
    modal.find('#name').attr('readonly', false);
    modal.find('#phone').val('');
    modal.find('#phone').attr('readonly', false);
    modal.find('#payment').val('');
    modal.find('#payment').attr('readonly', false);
    modal.find('#status-row').attr('hidden', true)
    modal.find('#status').val('Active');
    modal.find('#orderId').val('');
    modal.find('#orderId').attr('readonly', false);


    myModal.show()
}
function saveNewOrder() {
    let modal = $('#showDetailOrder');

    if (modal.find('#address').val() == '' ||
        modal.find('#cp').val() == '' ||
        modal.find('#city').val() == '' ||
        modal.find('#restaurant').val() == '' ||
        modal.find('#payment').val() == '' ||
        modal.find('#name').val() == '' ||
        modal.find('#phone').val() == ''
    ) {
        alert('Falto algun valor obligatorio');
    }
    else {
        let order = {
            direction: {
                street: modal.find('#address').val(),
                zipcode: modal.find('#cp').val(),
                city: modal.find('#city').val(),
            },
            client: {
                name: modal.find('#name').val(),
                phone: modal.find('#phone').val(),
            },
            restaurant: modal.find('#restaurant').val(),
            payment: modal.find('#payment').val(),
        }

        newOrder(order)
            .then(result => {
                return result.json;
            })
            .then(result => {
                if (result.err)
                    throw result.err
                myModal.hide();
                update();
            })
            .catch(err => {
                console.log(err);
            })
    }
}

function assignRider(element) {
    let riderId = $(element.parentNode).find('.riderId').val();
    let orderId = $("#assignRider").find('#idOrder').val();

    assignRiderToOrder(orderId, riderId)
        .then(result => {
            return result.json()
        })
        .then(result => {
            if (result.err)
                throw err
            riderList.hide();
            update();
        })
        .catch(err => {
            alert(err);
        })
}

function unassignRider() {
    let orderId = $("#assignRider").find('#idOrder').val();

    removeRiderFromOrder(orderId)
        .then(result => {
            return result.json()
        })
        .then(result => {
            if (result.err)
                throw err;
            update();
        })
        .catch(err => {
            alert(err);
        })
}