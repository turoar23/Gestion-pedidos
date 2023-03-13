exports.parseTookanEpaPaymentMethod = paymentMethod => {
  if (paymentMethod === 'CARD') return 'Tarjeta';
  else if (paymentMethod === 'CASH') return 'Efectivo';
  else return 'Pago online';
};
