const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require('cors');  
const cloudinary = require('cloudinary').v2;

// import middleware
const errorMiddleware = require('./middleware/errorMiddleware.js');

// import configurations
const configSocket = require('./config/socket.js');

//import routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const paymentRoute = require('./routes/paymentRoutes');
const orderRoutes = require('./routes/orderRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const subscriberRoutes = require('./routes/subscriberRoutes');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');

//express app
const app = express();

//configure dotenv file
dotenv.config({ path: './config.env' });

//variables
const PORT = process.env.PORT || 8000;

//middleware
app.use(cookieParser());
app.use(express.json({limit: '50mb'}));
app.use(cors({origin: process.env.CLIENT_URL, credentials: true}));

//database and server connection
mongoose.connect(process.env.DATABASE_URI, {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => app.listen(PORT, () => console.log(`Server listening on ${PORT}`)))
.catch(err => console.log(err));

//cloudinary 
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

// socket.io
configSocket();

//routes
app.use('/api/v1', authRoutes);
app.use('/api/v1', productRoutes);
app.use('/api/v1', paymentRoute);
app.use('/api/v1', orderRoutes);
app.use('/api/v1', wishlistRoutes);
app.use('/api/v1', subscriberRoutes);
app.use('/api/v1', chatRoutes);
app.use('/api/v1', messageRoutes);

//error middleware
app.use(errorMiddleware);