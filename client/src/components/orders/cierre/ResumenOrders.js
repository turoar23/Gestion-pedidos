import { Card } from 'react-bootstrap';

import { getTimeFromOrder, differentTwoDate } from '../../lib/utils';

/** Se quiere calcular:
 *  - Número de pedidos
 *  - Pedidos Completados
 *  - Tiempo medio
 *  - Pedido más tarde (?)
 *  - Pedido mas pronto (?)
 *  - Número de pedidos mayor que tiempo establecido
 *  - % de éxito
 * */

const ResumenOrders = props => {
	const orders = props.orders;

	let data = {
		totalOrders: 0,
		completedOrders: 0,
		averageTime: 0,
		lateOrdersTotal: 0,
		latePercentage: 0,
		forLaterTotal: 0,
		//TODO: No es generico
		restaurants: {
			umbrella: 0,
			tepuy: 0,
		},
	};
	if (orders) {
		orders.forEach(order => {
			let fulfill_at = getTimeFromOrder(order.times, 'fulfill_at');
			let completed = getTimeFromOrder(order.times, 'Completed');
			let accepted_at = getTimeFromOrder(order.times, 'accepted_at');

			data.totalOrders += 1;

			// Si el pedido se completo
			if (completed) {
				data.completedOrders += 1;

				// Lo agregamos al restaurante
				if (order.restaurant === 'Umbrella')
					data.restaurants.umbrella += 1;
				else data.restaurants.tepuy += 1;

				// Si el pedido es programado
				if (order.for_later) {
					data.forLaterTotal += 1;
					if (differentTwoDate(completed, fulfill_at) < -15)
						data.lateOrdersTotal += 1;
				} else {
					data.averageTime += differentTwoDate(
						accepted_at,
						completed
					);
					if (differentTwoDate(completed, fulfill_at) < 0)
						data.lateOrdersTotal += 1;
				}
			}
		});
	}
	// Para el calculo del tiempo medio se tiene que excluir a los pedidos programados, ya que sesgan la media.
	if (data.averageTime > 0)
		data.averageTime = (
			data.averageTime /
			(data.completedOrders - data.forLaterTotal)
		).toFixed(2);
	data.latePercentage = (
		(data.lateOrdersTotal / data.totalOrders) *
		100
	).toFixed(2);

	return (
		<Card>
			<Card.Title>Estadísticas</Card.Title>
			<div>
				<div>Total pedidos: {data.totalOrders}</div>
				<div>Pedidos completados: {data.completedOrders}</div>
				<div>Tiempo medio (ASAP): {data.averageTime}m</div>
				<div>
					Pedidos puntuales: {data.totalOrders - data.lateOrdersTotal}
				</div>
				<div>Pedidos tardes: {data.lateOrdersTotal}</div>
				<div>Porcentaje de pedidos tardes: {data.latePercentage}%</div>
				<div>
					<strong>Distribución:</strong>
					<div>
						Umbrella: {data.restaurants.umbrella} -{' '}
						{(
							(data.restaurants.umbrella / data.totalOrders) *
							100
						).toFixed(2)}
						%
					</div>
					<div>
						Tepuy: {data.restaurants.tepuy} -{' '}
						{(
							(data.restaurants.tepuy / data.totalOrders) *
							100
						).toFixed(2)}
						%
					</div>
				</div>
			</div>
		</Card>
	);
};

export default ResumenOrders;
