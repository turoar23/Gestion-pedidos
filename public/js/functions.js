
// -----------------------------------------------------
// Funciones que interactuan directamente con el usuario
// -----------------------------------------------------

/**
 * Actualiza el DOM con los pedidos que esten activos
 */
async function update() {
    let orders = await getActiveOrders();
    var template = document.querySelector('#order_template');

    // if (!equals(orders, local_orders)) {
    // $('.orders').empty();
    // $('.orders-making').empty();

    let ordersToAdd = [];

    if (orders.length > 0) {
        for (var i = 0; i < orders.length; i++) {
            let clone = document.importNode(template.content, true);
            // let tipo = "";
            // let status = orders[i].status;

            // if (app == 'Glovo') tipo = "glovo";
            // else if (app == 'Uber Eats') tipo = 'uber';
            // else if (app == 'Delivero') tipo = 'delivero';
            // else if (app == 'Just Eat') tipo = 'just-eat';
            // else if (app == 'Recoger') tipo = 'recoger';
            // else if (app == 'GloriaFood') tipo = 'gloria';
            // else tipo = 'generico';

            // clone.querySelector('.content').classList.add(tipo);
            clone.querySelector('.id').textContent = orders[i].gloriaId;
            clone.querySelector('.address').textContent = orders[i].address.street;
            clone.querySelector('.restaurant').textContent = orders[i].restaurant;
            clone.querySelector('.payment').textContent = orders[i].payment;
            clone.querySelector('.rider').textContent = "Null";
            // clone.querySelector('.status').textContent = status;

            if (clone.querySelector('#remove') != null) {
                clone.querySelector('#remove').addEventListener("click", function () {
                    let _id = $(this).parent().find('.id').text()
                    removeOrder(_id);
                    update();
                });
            }
            // if (clone.querySelector('#ready') != null) {
            //     if (status == 'Preparando') {
            //         clone.querySelector('#ready').addEventListener("click", function () {
            //             let _id = $(this).parent().find('.id').text()
            //             updateOrder(_id, 'Listo');
            //             update();
            //         });
            //     }
            //     else
            //         clone.querySelector('#ready').remove();
            // }
            ordersToAdd.push(clone);
        }
        $('#orders').empty();
        $('#orders').append(ordersToAdd);
        //local_orders = orders;
    }
    // }
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