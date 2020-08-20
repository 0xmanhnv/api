const express = require("express");
const router = express.Router();

const { verifyAccessToken } = require('../helpers/jwt_helpers');

const multerProducts = require('../multer.products');


const AuthoController = require('../Controllers/Products.Controllers');





// JWT_HEADER.tokenProducts
router.get("/get-product", AuthoController.GET_PRODUCTS);

router.post("/add-product",verifyAccessToken, multerProducts.array('poster'), AuthoController.ADD_PRODUCTS);

router.get("/get-one-product", AuthoController.GET_ID);

router.put("/updata-product", verifyAccessToken, AuthoController.UPDATED_ID);

router.delete("/delete-product", verifyAccessToken, AuthoController.DELETE_ID);


module.exports = router;
