const GLOBAL_HEADERS = {
	"Content-Type": "application/json",
	"Accept": "application/json",
};
// var local_orders = [];

const url_base = window.location.origin;

async function getActiveOrders(id) {
	const url = url_base + '/getActiveRiderOrders/' + id;

	request = {
		method: "GET",
		headers: GLOBAL_HEADERS,
	};

	try {
		let peticion = await fetch(url, request);
		let r = await peticion.json();
		//alert(mensajes);

		if (r.result) {
			return r.result;
		}
	}
	catch (error) {
		console.log(error);
	}
}

// async function getOrder(_id) {
// 	const url = url_base + `/getOrder/${_id}`;

// 	request = {
// 		method: "GET",
// 		headers: GLOBAL_HEADERS,
// 	};

// 	try {
// 		let peticion = await fetch(url, request);
// 		let r = await peticion.json();
// 		//alert(mensajes);

// 		if (r.result) {
// 			return r.result;
// 		}
// 	}
// 	catch (error) {
// 		console.log(error);
// 	}
// }

async function updateOrderStatus(_id, status, action) {
	const url = url_base + '/updateStatusOrder/';

	let payload = {
		_id: _id,
		status: status,
		action: action
	}
	request = {
		method: "POST",
		body: JSON.stringify(payload),
		headers: GLOBAL_HEADERS,
	};

	return fetch(url, request);
}


async function updateOrder(order) {
	const url = url_base + '/modifyOrder/';

	let payload = {
		...order
	}
	request = {
		method: "POST",
		body: JSON.stringify(payload),
		headers: GLOBAL_HEADERS,
	};

	return fetch(url, request);
}
// async function addOrder(_id, _app, _status) {
// 	const url = url_base + '/addOrder/';

// 	let payload = {
// 		id: _id,
// 		app: _app,
// 		status: _status
// 	};
// 	console.log(JSON.stringify(payload))

// 	request = {
// 		method: "POST",
// 		body: JSON.stringify(payload),
// 		headers: GLOBAL_HEADERS,
// 	};

// 	try {
// 		let peticion = await fetch(url, request);
// 		let r = await peticion.json();
// 		//alert(mensajes);

// 		if (r.result) {
// 			console.log(r.result);
// 		}
// 	}
// 	catch (error) {
// 		console.log(error);
// 	}
// }

// async function removeOrder(_id) {
// 	const url = url_base + '/removeOrder/';

// 	let payload = {
// 		id: _id,
// 	};
// 	console.log(JSON.stringify(payload))

// 	request = {
// 		method: "POST",
// 		body: JSON.stringify(payload),
// 		headers: GLOBAL_HEADERS,
// 	};

// 	try {
// 		let peticion = await fetch(url, request);
// 		let r = await peticion.json();
// 		//alert(mensajes);

// 		if (r.result) {
// 			console.log(r.result);
// 		}
// 	}
// 	catch (error) {
// 		console.log(error);
// 	}
// }
// async function updateOrder(_id, _status, _group) {
// 	const url = url_base + '/updateStatus';

// 	let payload = {
// 		id: _id,
// 		status: _status,
// 		group: _group
// 	}

// 	request = {
// 		method: "POST",
// 		body: JSON.stringify(payload),
// 		headers: GLOBAL_HEADERS
// 	};

// 	try {
// 		let peticion = await fetch(url, request);
// 		let r = await peticion.json();

// 		if (r.result) {
// 			console.log(r.result);
// 		}
// 	} catch (error) {
// 		console.log(error);
// 	}
// }