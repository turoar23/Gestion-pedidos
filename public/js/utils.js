parseStreet = function(_street) {
    let parts = _street.split(" ");
    var find = false;
    var i = 0

    for (; i < parts.length && !find; i++) {
        find = !isNaN(getNumberFromString(parts[i]));
    }

    if (!find)
        return _street

    var street = "";
    for (var j = 0; j < i - 1; j++) {
        street += parts[j] + " ";
    }
    var street_number = getNumberFromString(parts[i - 1]);

    return street + street_number.toString();
}
/**
 * Devuelve el numero de la cadena si es que existe. Si no hay, devuelve NaN
 */
function getNumberFromString (_string) {
    var number = "";

    for (var i = 0; i < _string.length; i++) {
        if(!isNaN(parseInt(_string[i])))
            number+= parseInt(_string[i]);
    }

    if(number == "")
        return NaN;
    return parseInt(number);
}

function getUrlGoogleMaps(street, extra) {
    const url_base = "https://www.google.com/maps/dir/?api=1&";
    const restaurante = 'origin=Avenida+Periodista+Rodolfo+Salazar+29,+Alicante&';
    const destination = `destination=${parseStreet(street).replace(/ /g, "+")}`;

    return url_base + restaurante + destination + ' ' + extra;
}