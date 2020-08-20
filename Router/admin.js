const express = require("express");
const router = express.Router();

const AuthoController = require('../Controllers/Admin.Contrllers');
const { verifyAccessToken } = require('../helpers/jwt_helpers');


// router.post('/register',AuthoController.REGISTER);

router.post('/login',AuthoController.LOGIN);

router.get('/profile',verifyAccessToken,AuthoController.PROFILE);

router.get('/get-all-user',verifyAccessToken,AuthoController.GET_ALL_USER);

router.delete('/delete-user',verifyAccessToken,AuthoController.DELETE_USER_ID);

router.get('/get-card-user',verifyAccessToken,AuthoController.GET_CARD_USER);

module.exports = router;