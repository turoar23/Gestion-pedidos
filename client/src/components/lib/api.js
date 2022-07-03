const SERVER_URL = `${process.env.REACT_APP_URL}:${process.env.REACT_APP_PORT}${process.env.REACT_APP_API}`;

export async function getAllActiveOrders() {
	const response = await fetch(`${SERVER_URL}/ordersActive`);
	const data = await response.json();

	if (!response.ok) {
		throw new Error(data.message || 'Could not fetch orders.');
	}

	const transformedOrders = [];

	for (const key in data.result) {
		const quoteObj = {
			// id: data.result[key]._id,
			// data : data.result[key],
			...data.result[key],
		};

		transformedOrders.push(quoteObj);
	}

	return transformedOrders;
}

export async function getAllOrders() {
	const response = await fetch(`${SERVER_URL}/orders`);
	const data = await response.json();

	if (!response.ok) {
		throw new Error(data.message || 'Could not fetch orders.');
	}

	const transformedOrders = [];

	for (const key in data.result) {
		const quoteObj = {
			// id: data.result[key]._id,
			// data : data.result[key],
			...data.result[key],
		};

		transformedOrders.push(quoteObj);
	}

	return transformedOrders;
}

export async function getOrdersByDate(dateBody) {
	let url = `${SERVER_URL}/orders/${dateBody.begin}&${dateBody.end}`;

	const response = await fetch(url, {
		// method: 'POST',
		// body: JSON.stringify(dateBody),
		// headers: {
		// 	'Content-Type': 'application/json',
		// },
	});
	const data = await response.json();

	if (!response.ok) {
		throw new Error(data.message || 'Could not fetch riders.');
	}

	const transformedOrders = [];

	for (const key in data.result) {
		const quoteObj = {
			// id: data.result[key]._id,
			// data : data.result[key],
			...data.result[key],
		};

		transformedOrders.push(quoteObj);
	}

	return transformedOrders;
}

export async function getAllRiders() {
	const response = await fetch(`${SERVER_URL}/riders`);
	const data = await response.json();

	if (!response.ok) {
		throw new Error(data.message || 'Could not fetch riders.');
	}

	const transformedRider = [];

	for (const key in data.result) {
		const quoteObj = {
			// id: data.result[key]._id,
			// data : data.result[key],
			...data.result[key],
		};

		transformedRider.push(quoteObj);
	}

	return transformedRider;
}
export async function assignRider(orderData) {
	// Assign
	let url = `${SERVER_URL}/orders/assignRider`;
	// Unassign
	if (!orderData.riderId) {
		url = `${SERVER_URL}/orders/removeRider`;
	}
	const response = await fetch(url, {
		method: 'PUT',
		body: JSON.stringify(orderData),
		headers: {
			'Content-Type': 'application/json',
		},
	});
	const data = await response.json();

	if (!response.ok) {
		throw new Error(data.message || 'Could not update the rider.');
	}

	return null;
}

export async function updateOrder(orderData) {
	let url = `${SERVER_URL}/orders/${orderData._id}`;

	const response = await fetch(url, {
		method: 'PUT',
		body: JSON.stringify(orderData),
		headers: {
			'Content-Type': 'application/json',
		},
	});
	const data = await response.json();

	if (!response.ok) {
		throw new Error(data.message || 'Could not update the order.');
	}

	return null;
}

export async function newOrder(orderData) {
	let url = `${SERVER_URL}/orders`;

	const response = await fetch(url, {
		method: 'POST',
		body: JSON.stringify(orderData),
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
		},
	});
	const data = await response.json();

	if (!response.ok) {
		throw new Error(data.message || 'Could not create the order.');
	}

	return null;
}

export async function getRiderByCode(riderData) {
	let url = `${SERVER_URL}/rider/login`;

	const response = await fetch(url, {
		method: 'POST',
		body: JSON.stringify(riderData),
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
		},
	});
	const data = await response.json();

	if (!response.ok) {
		throw new Error(data.message || 'Could not find the rider.');
	}

	return data;
}

export async function getActiveRiderOrders(riderId) {
	const response = await fetch(
		`${SERVER_URL}/riderOrders/${riderId}?active=true`
	);
	const data = await response.json();

	if (!response.ok) {
		throw new Error(
			data.message || 'Could not fetch orders for the rider.'
		);
	}

	const transformedRider = [];

	for (const key in data.result) {
		const quoteObj = {
			// id: data.result[key]._id,
			// data : data.result[key],
			...data.result[key],
		};

		transformedRider.push(quoteObj);
	}

	return transformedRider;
}

export async function updateOrderStatus(orderData) {
	let url = `${SERVER_URL}/orders/addAction/`;

	const response = await fetch(url, {
		method: 'PUT',
		body: JSON.stringify(orderData),
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
		},
	});
	const data = await response.json();

	if (!response.ok) {
		throw new Error(data.message || 'Could not update the order status.');
	}

	return data;
}

// FIXME: This is very ugly. This can be improve.
export async function getOrdersWithoutRiders() {
	let url = `${SERVER_URL}/getOrderFilter/`;

	const response = await fetch(url, {
		method: 'POST',
		body: JSON.stringify({
			status: 'Active',
			rider: null,
		}),
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
		},
	});
	const data = await response.json();

	if (!response.ok) {
		throw new Error(
			data.message || 'Could not get the order withour riders.'
		);
	}

	const transformedOrders = [];

	for (const key in data.result) {
		const quoteObj = {
			...data.result[key],
		};

		transformedOrders.push(quoteObj);
	}

	return transformedOrders;
}
export async function toggleRiderStatus(riderId) {
	let url = `${SERVER_URL}/rider/status`;

	const response = await fetch(url, {
		method: 'POST',
		body: JSON.stringify(riderId),
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
		},
	});
	const data = await response.json();

	if (!response.ok) {
		throw new Error(data.message || 'Could not update the rider status.');
	}

	return data;
}

export async function newRider(rider) {
	let url = `${SERVER_URL}/riders/`;

	const response = await fetch(url, {
		method: 'POST',
		body: JSON.stringify(rider),
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
		},
	});
	const data = await response.json();

	if (!response.ok) {
		throw new Error(data.message || 'Could not create the new rider.');
	}

	return data;
}

export async function getReviews() {
	const response = await fetch(`${SERVER_URL}/reviews/`);
	const data = await response.json();

	if (!response.ok) {
		throw new Error(data.message || 'Could not fetch reviews.');
	}
	return data;
}

export async function login(username, password){
	const url = `${SERVER_URL}/login`;
	const response = await fetch(url, {
		method: 'POST',
		body: JSON.stringify({email: username, password}),
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
		},
	});
	const data = await response.json();

	if(!response.ok)
		throw new Error(data.message || 'There was an error');

	return data;
}

