const express = require("express");
const mongoose = require ('mongoose');
const morgan = require("morgan");

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const expressValidator = require("express-validator");
const cors = require('cors');

require("dotenv").config()
//routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/User');
const categoryRoutes = require('./routes/Category');
const productRoutes = require('./routes/Product');
const braintreeRoutes = require('./routes/braintree')
const orderRoutes = require('./routes/order');

//app
const app = express();

//db
mongoose.connect(process.env.DATABASE , {
    useNewUrlParser:true,
  useCreateIndex: true
})
.then(() => console.log('Db connected'))

// middleware
app.use(morgan('dev'));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(cookieParser());
app.use(expressValidator());
app.use(cors());


//routes middleware
app.use('/api' ,authRoutes);
app.use('/api' ,userRoutes);
app.use('/api' ,categoryRoutes);
app.use('/api' ,productRoutes);
app.use('/api' ,braintreeRoutes);
app.use('/api' ,orderRoutes);

const port = process.env.PORT || 8080

app.listen(port, () => {
     console.log(`server is  running on port ${port}`);
 });
