const Step = require('../models/step');

exports.getSteps = (req, res, next) => {
    Step.find()
        .then(result => {
            res.send({ result: result, err: null });
        })
        .catch(err => {
            res.send({ result: null, err: err });
        });
}

exports.newSteps = (req, res, next) => {
    const newSteps = req.body.steps;

    Step.remove()
        .then(() => {
            let steps = new Step({ steps: newSteps });
            return steps.save();
        })
        .then(result => {
            res.send({ result: result, err: null });
        })
        .catch(err => {
            console.log(err);
            res.send({ result: null, err: err });
        });
}