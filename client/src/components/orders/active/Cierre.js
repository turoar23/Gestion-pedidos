const Cierre = props => {
	const orders = props.orders;

	if (!orders || orders.length === 0) return <p>Sin datos para este día</p>;

	let riders = [];

	console.log(orders);
	orders.forEach(order => {
		if (order.rider) {
			if (!riders[order.rider.name]) {
				riders[order.rider.name] = {
					totalOrders: 1,
					payments: {
						CASH: 0,
						CARD: 0,
						ONLINE: 0,
					},
				};
			} else {
				riders[order.rider.name].totalOrders += 1;
				riders[order.rider.name].payments[order.payment] +=
					order.total_price;
			}
		}
	});
	console.log(riders);
	console.log(typeof riders);
	console.log(riders.length);

	var riderResumen = [];

	for (let rider in riders) {
		console.log(rider);
		riderResumen.push(
			<div>
				<div>{rider}</div>
				<div>
					<div>CASH: {riders[rider].payments.CASH}</div>
					<div>CARD: {riders[rider].payments.CARD}</div>
					<div>ONLINE: {riders[rider].payments.ONLINE}</div>
				</div>
			</div>
		);
	}
	console.log(riderResumen);

	return (
		<div>
			<div>Cierre por rider</div>
			<div>{riderResumen}</div>
		</div>
	);
};

export default Cierre;
