const express = require("express");
const router = express.Router();
const AuthoController = require('../Controllers/User.Controllers');
const multerImage = require('../multer.User');
const { verifyAccessToken } = require('../helpers/jwt_helpers');



router.post('/register', multerImage.array('avatar'), AuthoController.REGISTER)

router.post('/login', AuthoController.LOGIN)

router.get('/profile', verifyAccessToken, AuthoController.PROFILE)

router.post('/refresh-token', AuthoController.REFRESH_TOKEN)

router.put("/updata-user", verifyAccessToken, AuthoController.USER_UPDATE_ID);


module.exports = router;
 