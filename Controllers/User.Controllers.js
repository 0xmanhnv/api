const createError = require('http-errors')
const mongoose = require("mongoose");
const fs = require("fs")

const cloudinary = require('../cloudinary');
const { authuShema } = require('../helpers/validation');
const { signRefreshToken, signAccessToken, verilyRefreshToken } = require('../helpers/jwt_helpers');
const User = require("../Model/User");

module.exports = {
    REGISTER: async (req, res, next) => {
        try {
            const { email } = req.body;
            const doseExists = await User.findOne({ email: email });
            const { password, confirmPassword } = req.body;
            if (doseExists) throw createError.Conflict('tài khoản này tồn tại');
            if (password !== confirmPassword) throw createError.Conflict('mật khẩu không trùng khớp');
            const uploader = async (path) => await cloudinary.uploads(path, 'avatar');
            if (req.method === 'POST') {
                const avatar = req.files;
                for (const file of avatar) {
                    const { path } = file;
                    const newPath = await uploader(path);
                    const userSave = new User({
                        _id: new mongoose.Types.ObjectId(),
                        name: req.body.name,
                        email: req.body.email,
                        password: req.body.password,
                        confirmPassword: req.body.confirmPassword,
                        avatar: newPath.url,
                        sex: req.body.sex
                    });
                    fs.unlinkSync(path);
                    const result = await userSave.save();
                    res.send({ user: result });
                }
            }
        } catch (error) {
            if (error.name === 'ValidationError') {
                next(createError(422, error.message));
                return;
            }
            next(error);
        }
    },
 
    PROFILE: async (req, res, next) => {
        const user = await User.findById(req.data.id);
        res.json(user);
    },
    LOGIN: async (req, res, next) => {
        try {
            const result = await authuShema.validateAsync(req.body);
            const user = await User.findOne({ email: result.email });
            if (!user) throw createError.NotFound('User not registered');
            const isMatch = await user.isValidPassword(result.password);
            if (!isMatch) throw createError.Unauthorized('Username/password not valid');
            const accesToken = await signAccessToken(user._id)
            const refreshToken = await signRefreshToken(user._id)
            res.send({ accesToken: accesToken, refreshToken: refreshToken });
        } catch (error) {
            if (error.isJoi === true)
                return next(createError.BadRequest('Invalid Username/Password'))
            next(error)
        }
    },

    REFRESH_TOKEN: async (req, res, next) => {
        try {
            const refreshToken = req.body;
            if (!refreshToken) throw createError.BadRequest();
            const id = await verilyRefreshToken(refreshToken);
            const accesToken = await signAccessToken(id);
            const refToken = await signRefreshToken(id);

            res.send({ accesToken: accesToken, refreshToken: refToken })
        } catch (error) {
            next(error);
        }
    },

    USER_UPDATE_ID: async (req, res, next) => {
        try {
            const { id } = req.query;
            const update = req.body;
            const options = { new: true };
            const result = await User.findByIdAndUpdate(id, update, options);
            if (!result) {
                createError(404, 'Product does not exict');
            }
            res.send(result);
        } catch (error) {
            res.send(error);
            if (error instanceof mongoose.CastError) {
                return next(createError(400, "invalid product id"));
            }
        }
    }
}