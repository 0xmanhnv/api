const createError = require('http-errors')
const mongoose = require("mongoose");
const moment = require('moment');

const Card = require('../Model/Card');

module.exports = {

    ADD_CARD: async (req, res, next) => {
        try {
            const timeCard = moment().format('LLL');
            const newCard = new Card({
                _id: new mongoose.Types.ObjectId(),
                id_User: req.data.id,
                address: req.body.address,
                totalSum: req.body.totalSum,
                timeCard: timeCard,
                card: req.body.card,
            })
            const result = await newCard.save();
            res.status(200).json({
                data: result
            })
        } catch (error) {
            res.send(createError(404, 'no card found'))
        }
    },

    GET_CARD: async (req, res, next) => {
        try {
            const card = await Card.find({ id_User: req.data.id });
            res.status(200).json({
                data: card,
            })
        } catch (error) {
            res.send(createError(404, 'no card found'))
        }
    }
}