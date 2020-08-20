const mongoose = require("mongoose");
const JWT = require('jsonwebtoken');
const createError = require('http-errors');
const fs = require("fs")

const cloudinary = require('../cloudinary');
const Product = require("../Model/Product");
const Admin = require("../Model/Admin");

module.exports = {
    GET_PRODUCTS: async (req, res, next) => {
        // JWT.verify(req.keyProduct, process.env.KEY_PRODUCTS, async (err, result) => {
        //     if (req.keyProduct === process.env.KEY_PRODUCTS) {
        //         try {
        //             const result = await Product.find({}, { __v: 0 });
        //             res.status(200).json({
        //                 _total: result.length,
        //                 _product: result
        //             })
        //         } catch (error) {
        //             res.send(createError(404, 'no product found'))
        //         }
        //     }
        //     else {
        //         res.send(createError(404, 'no product found'))
        //     }
        // })

        try {
            const product = await Product.find({}, { __v: 0 });
            const lengthProducts = product.length;
            const page = parseInt(req.query.page) || 1;
            const perPage = 12;
            const start = (page - 1) * perPage;
            const end = start + perPage
            if (!page) res.send(createError(404, 'no product found'));

            const resultProducts = product.slice(start, end);
            res.status(200).json({
                _product: resultProducts,
                page: page,
                end: end,
                lengthProducts: lengthProducts
            })
        } catch (error) {
            res.send(createError(404, 'no product found'))
        }
    },

    ADD_PRODUCTS: async (req, res, next) => {


        try {
            const admin = await Admin.findById(req.data.id);
            if (admin) {
                const uploader = async (path) => await cloudinary.uploads(path, 'poster');
                if (req.method === 'POST') {
                    const urls = [];
                    const poster = req.files;
                    for (const file of poster) {
                        const { path } = file;
                        const newPath = await uploader(path);
                        urls.push(newPath);
                        fs.unlinkSync(path);
                    }
                    const product = new Product({
                        _id: new mongoose.Types.ObjectId(),
                        name: req.body.name.trim().toLowerCase(),
                        size: [
                            { "options": 36 },
                            { "options": 37 },
                            { "options": 38 },
                            { "options": 39 },
                            { "options": 40 },
                            { "options": 41 },
                            { "options": 42 },
                            { "options": 43 },
                            { "options": 44 },
                            { "options": 45 },
                        ],
                        price: req.body.price.trim().toLowerCase(),
                        sex: req.body.sex.trim().toLowerCase(),
                        poster: urls,
                        color: req.body.color.trim().toLowerCase(),
                        collections: req.body.collections.trim().toLowerCase(),
                        productType: req.body.productType.trim().toLowerCase(),
                        description: req.body.description.trim().toLowerCase(),
                        key: req.body.key.trim().toLowerCase(),
                        NSX: req.body.NSX.trim().toLowerCase(),
                    });
                    const result = await product.save()
                    res.status(200).json({
                        message: 'image upload successful',
                        urls: result
                    })

                } else {
                    res.status(405).json({
                        error: 'image upload failed'
                    })
                }
            } else {
                res.send(createError(404, 'no post Product'));
            }
        } catch (err) {
            res.send(createError(404, err))
        }

    },

    GET_ID: async (req, res, next) => {
        try {
            const { id } = req.query;

            const product = await Product.findById({ _id: id }, { __v: 0 });
            if (!product) throw createError(404, 'Product does not');
            res.status(200).json({
                data: product,
            });
        } catch (error) {
            if (error instanceof mongoose.CastError) {
                next(createError(400, "invalid product id"));
                return;
            }
            next(error);
        }
    },

    UPDATED_ID: async (req, res, next) => {
        try {
            const admin = await Admin.findById(req.data.id);
            const { id } = req.query;
            const update = req.body;
            const options = { new: true };
            if (admin) {
                const result = await Product.findByIdAndUpdate(id, update, options);
                if (!result) {
                    res.send(createError(404, 'Product does not exict'));
                }
                res.send(result);
            } else {
                res.send(createError(404, 'Product does not'));
            }

        } catch (error) {
            res.send(error);
            if (error instanceof mongoose.CastError) {
                return next(createError(400, "invalid product id"));
            }
        }
    },

    DELETE_ID: async (req, res, next) => {

        try {
            const { id } = req.query;
            const admin = await Admin.findById(req.data.id);
            if (admin) {
                const result = await Product.findByIdAndDelete(id);
                if (!result) {
                    res.send(createError(404, 'Product does not'));
                }
                res.send(result);
            } else {
                res.send(createError(404, 'Product does not'));
            }


        } catch (error) {
            if (error instanceof mongoose.CastError) {
                next(createError(400, "invalid product id"));
                return;
            }
            next(error);
            res.send(error);
        }
    },

}