async function update() {
    let orders = await getActiveOrders(riderId);
    var template = document.querySelector('#order_template');

    let ordersToAdd = [];

    if (orders.length > 0) {
        for (var i = 0; i < orders.length; i++) {
            let clone = document.importNode(template.content, true);

            clone.querySelector('#status').textContent = orders[i].status;
            clone.querySelector('#client').textContent = orders[i].client.name;
            clone.querySelector('#phone').textContent = orders[i].client.phone;
            clone.querySelector('#phone').setAttribute('href', "tel:" + orders[i].client.phone);
            clone.querySelector('#street').textContent = `${orders[i].address.street}`;
            if (orders[i].address.floor)
                clone.querySelector('#floor').textContent = `${orders[i].address.floor}`;
            clone.querySelector('#zipCity').textContent = `${orders[i].address.zipcode} ${orders[i].address.city}`;
            clone.querySelector('#payment').textContent = orders[i].payment;
            clone.querySelector('#orderId').value = orders[i]._id;
            clone.querySelector('#gloriaId').value = orders[i].gloriaId || '--';

            if (clone.querySelector('#remove') != null) {
                clone.querySelector('#remove').addEventListener("click", function () {
                    let _id = $(this).parent().find('.id').text()
                    removeOrder(_id);
                    update();
                });
            }
            ordersToAdd.push(clone);
        }
        // groupId = orders[0].group;
    }

    $('#orders').empty();
    $('#orders').append(ordersToAdd);
}
//TODO: IMPORTANTE! ver que el boton solo se le de una vez, bloquarlo hasta actualizar o algo asi
//TODO: Ver que cuando el pedido se este repartiendo, no se pueda rechazar
function updateStatus(element) {
    let _id = $(element.parentNode).find('#orderId').val();
    let status = $(element.parentNode).find('#status').text();
    let newStatus = "";
    let action = "";

    if (status === 'Active') {
        newStatus = 'Delivering';
        action = "Start delivering";
    }
    else if (status === 'Delivering') {
        newStatus = "Arrived";
        action = "Arrived destination"
    }
    else {
        newStatus = 'Completed';
        action = "Completed";
    }
    updateOrderStatus(_id, newStatus, action)
        .then(result => {
            return result.json();
        })
        .then(result => {
            console.log(result);
            if (result.err)
                throw result.err
            update();
        })
        .catch(err => {
            alert(err);
        })
}

function showOrderOptions(element) {
    const orderId = $(element.parentNode).find('#orderId')[0].value;
    const gloriaId = $(element.parentNode).find('#gloriaId')[0].value;

    $('#orderOptions').find('#orderId')[0].value = orderId;
    $('#orderOptions').find('#gloriaId')[0].textContent = gloriaId;

    orderOptionsModal.toggle();
}

function openGoogle(element) {
    let address = $(element.parentNode).find('#street').text();
    let zipCity = $(element.parentNode).find('#zipCity').text();

    console.log(`${address} ${zipCity}`);

    window.open(getUrlGoogleMaps(address, zipCity));
}

function rejectOrder(element) {
    const orderId = $(element.parentNode).find('#orderId')[0].value;

    removeRiderFromOrder(orderId)
        .then(result => {
            alert("Pedido desaginado");
            update();
            orderOptionsModal.toggle();
        })
        .catch(err => {
            alert(err);
        });
}
async function showOrdersList() {
    let orders = await getOrdersWithoutRiders(riderId);
    var template = document.querySelector('#order_active_template');

    let ordersToAdd = [];

    if (orders.length > 0) {
        for (var i = 0; i < orders.length; i++) {
            let clone = document.importNode(template.content, true);

            clone.querySelector('#status').textContent = orders[i].status;
            clone.querySelector('#street').textContent = `${orders[i].address.street}`;
            clone.querySelector('#zipCity').textContent = `${orders[i].address.zipcode} ${orders[i].address.city}`;
            clone.querySelector('#orderId').value = orders[i]._id;
            clone.querySelector('#gloriaId').value = orders[i].gloriaId || '--';

            ordersToAdd.push(clone);
        }
    }

    $('#orders-actives').empty();
    $('#orders-actives').append(ordersToAdd);

    listOrdersModal.toggle();
}

function assignRider(element){
    const orderId = $(element.parentNode).find('#orderId')[0].value;

    assignRiderToOrder(orderId, riderId)
    .then(result => {
        alert("Pedido asignado");
        listOrdersModal.toggle();
        update();
    })
    .catch(err => {
        alert(err);
    })
}