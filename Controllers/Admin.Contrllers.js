const createError = require('http-errors')
const mongoose = require("mongoose");

const { authuShema } = require('../helpers/validation');
const { signRefreshToken, signAccessToken } = require('../helpers/jwt_helpers');


const Admin = require('../Model/Admin');
const User = require('../Model/User');
const Card = require('../Model/Card');

module.exports = {
    // REGISTER: async (req, res, next) => {
    //     try {
    //         const { email } = req.body;
    //         const doseExists = await Admin.findOne({ email: email });
    //         const { password, confirmPassword } = req.body;
    //         if (doseExists) throw createError.Conflict('tài khoản này tồn tại');
    //         if (password !== confirmPassword) throw createError.Conflict('mật khẩu không trùng khớp');
    //         const adminSave = new Admin({
    //             _id: new mongoose.Types.ObjectId(),
    //             email: req.body.email,
    //             password: req.body.password,
    //             confirmPassword: req.body.confirmPassword,

    //         });
    //         const result = await adminSave.save();
    //         res.send({ Admin: result });
    //     } catch (error) {
    //         if (error.name === 'ValidationError') {
    //             next(createError(422, error.message));
    //             return;
    //         }
    //         next(error);
    //     }
    // },

    LOGIN: async (req, res, next) => {
        try {
            const result = await authuShema.validateAsync(req.body);
            const admin = await Admin.findOne({ email: result.email });
            if (!admin) throw createError.NotFound('User not registered');
            const isMatch = await admin.isValidPassword(result.password);
            if (!isMatch) throw createError.Unauthorized('Username/password not valid');
            const accesToken = await signAccessToken(admin._id)
            const refreshToken = await signRefreshToken(admin._id)
            res.send({ accesToken: accesToken, refreshToken: refreshToken });
        } catch (error) {
            if (error.isJoi === true)
                return next(createError.BadRequest('Invalid Username/Password'))
            next(error)
        }
    },

    PROFILE: async (req, res, next) => {
        const admin = await Admin.findById(req.data.id);
        res.json(admin);
    },

    GET_ALL_USER: async (req, res, next) => {
        try {
            const admin = await Admin.findById(req.data.id);
            if (admin) {
                const user = await User.find({}, {});
                res.status(200).json({
                    data: user
                })
            } else {
                res.send(createError(404, 'no user found'))
            }
        }
        catch (error) {
            res.send(createError(404, 'no user found'))
        }
    },

    DELETE_USER_ID: async (req, res, next) => {
        try {
            const admin = await Admin.findById(req.data.id);
            if (admin) {
                const { id_user } = req.query;
                const result = await User.findByIdAndDelete(id_user);
                if (!result) {
                    res.send(createError(404, 'user does not'));
                }
                res.send(result);
            }
            else {
                res.send(createError(404, 'no user found'))
            }
        } catch (error) {
            res.send(createError(404, 'no user found'))
        }
    },

    GET_CARD_USER: async (req, res, next) => {
        try {
            const admin = await Admin.findById(req.data.id);
            if (admin) {
                const result = await Card.find({}, {});
                res.status(200).json({
                    data: result
                })
            } else {
                res.send(createError(404, 'no Card found'))
            }

        }
        catch (error) {
            res.send(createError(404, 'no Card found'))
        }
    }

}