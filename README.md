# Gestión pedidos
Versión actual de la app de gestión de pedidos. Se usa React en el front para la interfaz de los restaurantes y NodeJS para el Back. Mediante una integración con el ecommerce GloriaFood, la app recibe los pedidos y los muestra tanto a los repartidores como a los restaurantes. Los repartidores pueden ver que pedidos hay pendientes y asignárselos. Luego pueden actualizar el pedido una vez vayan completando las diferentes fases. Estos son:
Active (pedido recibido)
Delivering (el rider ya tiene el pedido y se lo esta llevando a repartir)
Arrived (el rider ha llegado a la dirección del cliente)
Completed (el pedido ha sido entregado al cliente)

Una vez el pedido ha sido entrega, se envía un correo al cliente para que pueda rellenar una encuesta de satisfacción. Esta luego se muestra en la app usando la API de Google ya que la encuesta fue enviada en un Google Form.
