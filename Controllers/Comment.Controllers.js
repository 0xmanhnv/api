const createError = require('http-errors')
const mongoose = require("mongoose");
const moment = require('moment');

const Comment = require('../Model/Comment');
const User = require('../Model/User');


module.exports = {

    POST_COMMENTS: async (req, res, next) => {

        try {
            const onlyUser = await User.findById({ _id: req.data.id });
            const timeComment = moment().format('LLL');
            const newCommnet = new Comment({
                _id: new mongoose.Types.ObjectId(),
                id_product: req.body.id_product,
                content: req.body.content,
                start: req.body.start,
                timeComment: timeComment,
                user: {
                    _id: onlyUser._id,
                    name: onlyUser.name,
                    avatar: onlyUser.avatar
                },

            });
            const result = await newCommnet.save();
            res.status(200).json(result)
        } catch (error) {
            res.send(error)
        }
    },

    GET_ID_PRODUCTS: async (req, res, next) => {
        try {
            const { _id_product } = req.query;
            
            const commnet = await Comment.find({ id_product: _id_product });
            if (!commnet) throw createError(404, 'Commnet does not');
            res.status(200).json({ data: commnet })
        } catch (error) {
            if (error instanceof mongoose.CastError) {
                next(createError(400, "invalid product id"));
                return;
            }
            next(error);
        }
    },

    DELETE_ID_COMMENT: async (req, res, next) => {
        const { id } = req.query;
        try {
            const commnet = await Comment.findByIdAndDelete(id);
            if (!commnet) { createError(404, 'Product does not'); }
            res.send(commnet)
        } catch (error) {
            if (error instanceof mongoose.CastError) {
                next(createError(400, "invalid product id"));
                return;
            }
            next(error);
            res.send(error);
        }
    }

}