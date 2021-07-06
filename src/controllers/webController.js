/**
 * Add the logic of the main page, that only returns the index view
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */

exports.getIndex = (req, res, next) => {
    res.render('index');
};

exports.getIndexOrders = (req, res, next) => {
    res.render('orders');
}