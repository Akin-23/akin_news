const { retrieveEndpoints } = require("../models/endpoints-model");

exports.getEndpoints = (req, res, next) => {
    retrieveEndpoints().then((data) => {
        const endpoints = JSON.parse(data);
        res.status(200).send(endpoints);
    })

};
