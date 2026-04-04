const express = require('express');
const app = express();
const http = require('http').Server(app);
const cors = require("cors");
const mongoose = require("mongoose");
const upload = require('express-fileupload');
require('dotenv').config();

const port = 8000;

// Middleware cấu hình
app.use(cors({ 
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'] 
}));

// Tăng giới hạn để nhận ảnh Base64 từ Frontend
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(upload());
app.use('/', express.static('public'));

// Kết nối Database
mongoose.connect("mongodb://localhost:27017/Camera", {
  useFindAndModify: false,
  useCreateIndex: false,
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB Connected..."));

app.set('view engine', 'ejs');
app.set('views', './views');

// Routes
const aiRouter = require("./API/Router/ai.router");
const productAPI = require('./API/Router/products.router');
const userAPI = require('./API/Router/users.router');
const cartAPI = require('./API/Router/carts.router');
const historiesAPI = require('./API/Router/histories.router');
const commentAPI = require('./API/Router/comment.router');

app.use("/ai", aiRouter);
app.use('/products', productAPI);
app.use('/users', userAPI);
app.use('/carts', cartAPI);
app.use('/histories', historiesAPI);
app.use('/comment', commentAPI);

http.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});