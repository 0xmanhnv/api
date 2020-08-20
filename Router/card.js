const express = require("express");
const router = express.Router();

const AuthoController = require('../Controllers/Card.Controllers');
const JWT_HEADER = require('../helpers/jwt_helpers');


router.post('/add-card', JWT_HEADER.verifyAccessToken, AuthoController.ADD_CARD);

router.get('/get-card', JWT_HEADER.verifyAccessToken, AuthoController.GET_CARD)



module.exports = router;