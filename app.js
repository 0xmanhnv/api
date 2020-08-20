const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const createError = require('http-errors');
 
const PORT = process.env.PORT || 5000;

require('dotenv').config();
require('./initDB')();


app.use('/imageProducts', express.static('imageProducts'));
app.use('/imageUsers', express.static('imageUsers'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

 

const commentRouter = require('./Router/comment');
const userRouter = require('./Router/user');
const productRouter = require('./Router/product');
const menuRouter = require('./Router/menu');
const cardRouter = require('./Router/card'); 
const adminRouter = require('./Router/admin');

app.use('/products', productRouter);
app.use('/user', userRouter);
app.use('/comments', commentRouter);
app.use('/menu', menuRouter);
app.use('/card',cardRouter);
app.use('/admin',adminRouter);
 
 
 
 
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Header", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if (req.method === 'OPTIONS') {
        res.header("Access-Control-Allow-Methoads", 'PUT, POST, PUT, DELETE, GET');
        res.status(200).json({});
    }
    next();
});

app.use((req, res, next) => {
    next(createError(404, 'Not found'));
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});


app.listen(PORT, () => {
    console.log(`server started on http://localhost:${PORT}`);
})