
exports.parseStreet = function (_street) {
  let parts = _street.split(' ');
  var find = false;
  var i = 0;

  for (; i < parts.length && !find; i++) {
    find = !isNaN(getNumberFromString(parts[i]));
  }

  if (!find) return _street;

  var street = '';
  for (var j = 0; j < i - 1; j++) {
    street += parts[j] + ' ';
  }
  var street_number = getNumberFromString(parts[i - 1]);

  return street + street_number.toString();
};
/**
 * Devuelve el numero de la cadena si es que existe. Si no hay, devuelve NaN
 */
function getNumberFromString(_string) {
  var number = '';

  for (var i = 0; i < _string.length; i++) {
    if (!isNaN(parseInt(_string[i]))) number += parseInt(_string[i]);
  }

  if (number == '') return NaN;
  return parseInt(number);
}

exports.checkIfNewOrder = function (order) {
  return checkIfEqual(orders, order);
};
function checkIfEqual(arr1, arr2) {
  var find = false;

  for (var i = 0; i < arr1.length && !find; i++) {
    find = arr1[i]['id'] == arr2['id'];
  }
  return find;
}
