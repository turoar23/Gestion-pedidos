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
            clone.querySelector('#address').textContent = orders[i].address.street;
            clone.querySelector('#payment').textContent = orders[i].payment;
            clone.querySelector('#orderId').value = orders[i]._id;

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

function updateStatus(element) {
    let _id = $(element.parentNode).find('#orderId').val();
    let status = $(element.parentNode).find('#status').text();
    let newStatus = "";
    let action = "";

    if (status === 'Active') {
        newStatus = 'Delivering';
        action = "Start delivering";
    }
    else if(status === 'Delivering'){
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

function openGoogle(element) {
    let address = $(element.parentNode).find('#address').text();

    window.open(getUrlGoogleMaps(address));
}