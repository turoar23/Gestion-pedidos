import moment from 'moment-timezone';

const parseStreet = function (_street) {
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
const getNumberFromString = _string => {
  var number = '';

  for (var i = 0; i < _string.length; i++) {
    if (!isNaN(parseInt(_string[i]))) number += parseInt(_string[i]);
  }

  if (number === '') return NaN;
  return parseInt(number);
};

export const getUrlGoogleMaps = (street, extra, origin = null) => {
  const url_base = 'https://www.google.com/maps/dir/?api=1&';
  let restaurante = 'origin=Avenida+Periodista+Rodolfo+Salazar+29,+Alicante&';

  if (origin && origin === 'Umbrella') {
    restaurante = 'origin=Carrer+Llinares+5,+Alicante&';
  }
  if (origin && origin === 'Tepuy Burger') {
    restaurante = 'origin=Calle+Bazan+49,+Alicante&';
  }

  const destination = `destination=${parseStreet(street).replace(/ /g, '+')}`;

  return url_base + restaurante + destination + ' ' + extra;
};
export const getTimeFromOrder = (times, action) => {
  let time = times.find(element => element.action === action);
  return time ? time.by : null;
};

export const formatTime = time => {
  return (time = time ? moment(time).tz('Europe/Madrid').format('LT') : '--');
};
export const differentTwoDate = (begin, end) => {
  if (!begin || !end) return '--';
  // Remove the seconds and milliseconds to ensure that dosent affect the diff
  begin = moment(begin).seconds(0).milliseconds(0);
  end = moment(end).seconds(0).milliseconds(0);

  return Math.round(moment.duration(end.diff(begin)).asMinutes());
};

export function hexToRgbA(hex, opacity = 1) {
  var c;
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    c = hex.substring(1).split('');
    if (c.length === 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c = '0x' + c.join('');
    return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',' + opacity + ')';
  }
  throw new Error('Bad Hex');
}
