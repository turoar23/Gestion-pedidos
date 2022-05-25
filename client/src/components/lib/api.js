const SERVER_URL = `${process.env.REACT_APP_URL}:${process.env.REACT_APP_PORT}`

export async function getAllActiveOrders() {
	const response = await fetch(`${SERVER_URL}/getActiveOrders`);
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
	const response = await fetch(`${SERVER_URL}/getOrders`);
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
	let url = `${SERVER_URL}/getOrderByDates`;

	const response = await fetch(url, {
		method: 'POST',
		body: JSON.stringify(dateBody),
		headers: {
			'Content-Type': 'application/json',
		},
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
	const response = await fetch(`${SERVER_URL}/getRiders`);
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
	let url = `${SERVER_URL}/assignRiderOrder`;
	// Unassign
	if (!orderData.riderId) {
		url = `${SERVER_URL}/removeRiderOrder`;
	}
	const response = await fetch(url, {
		method: 'POST',
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
	let url = `${SERVER_URL}/modifyOrder`;

	const response = await fetch(url, {
		method: 'POST',
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
	let url = `${SERVER_URL}/newOrder`;

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
	let url = `${SERVER_URL}/getRiderByCode`;

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
		`${SERVER_URL}/getActiveRiderOrders/${riderId}`
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
	let url = `${SERVER_URL}/updateStatusOrder/`;

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
		throw new Error(data.message || 'Could not update the order status.');
	}

	return data;
}

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
	let url = `${SERVER_URL}/toggleRiderStatus/`;

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
	let url = `${SERVER_URL}/newRider/`;

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
	const response = await fetch(
		`${SERVER_URL}/getReviews/`
	);
	const data = await response.json();

	if (!response.ok) {
		throw new Error(
			data.message || 'Could not fetch reviews.'
		);
	}
	return data;
}
// export async function getAllQuotes() {
//   const response = await fetch(`${SERVER_URL}/quotes.json`);
//   const data = await response.json();

//   if (!response.ok) {
//     throw new Error(data.message || 'Could not fetch quotes.');
//   }

//   const transformedQuotes = [];

//   for (const key in data) {
//     const quoteObj = {
//       id: key,
//       ...data[key],
//     };

//     transformedQuotes.push(quoteObj);
//   }

//   return transformedQuotes;
// }

// export async function getSingleQuote(quoteId) {
//   const response = await fetch(`${SERVER_URL}/quotes/${quoteId}.json`);
//   const data = await response.json();

//   if (!response.ok) {
//     throw new Error(data.message || 'Could not fetch quote.');
//   }

//   const loadedQuote = {
//     id: quoteId,
//     ...data,
//   };

//   return loadedQuote;
// }

// export async function addQuote(quoteData) {
//   const response = await fetch(`${SERVER_URL}/quotes.json`, {
//     method: 'POST',
//     body: JSON.stringify(quoteData),
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   });
//   const data = await response.json();

//   if (!response.ok) {
//     throw new Error(data.message || 'Could not create quote.');
//   }

//   return null;
// }

// export async function addComment(requestData) {
//   const response = await fetch(`${SERVER_URL}/comments/${requestData.quoteId}.json`, {
//     method: 'POST',
//     body: JSON.stringify(requestData.commentData),
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   });
//   const data = await response.json();

//   if (!response.ok) {
//     throw new Error(data.message || 'Could not add comment.');
//   }

//   return { commentId: data.name };
// }

// export async function getAllComments(quoteId) {
//   const response = await fetch(`${SERVER_URL}/comments/${quoteId}.json`);

//   const data = await response.json();

//   if (!response.ok) {
//     throw new Error(data.message || 'Could not get comments.');
//   }

//   const transformedComments = [];

//   for (const key in data) {
//     const commentObj = {
//       id: key,
//       ...data[key],
//     };

//     transformedComments.push(commentObj);
//   }

//   return transformedComments;
// }
