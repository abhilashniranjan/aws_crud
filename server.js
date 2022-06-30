const express = require('express')
const app = express()
var cors = require('cors')
const helmet = require("helmet");
var bodyParser = require('body-parser')
const multer = require('multer')
const PORT = process.env.PORT || 3000

// all routes
var authRoutes = require('./routes/authRoute')
var userRoutes = require('./routes/userRoute')
var dataRoutes = require('./routes/dataRoute')
var productRoutes = require("./routes/ProductRoutes.js");


// image
// some dependency
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors({origin: '*'}))

// http://localhost:4200

//secure http
app.use(helmet());

//image google cloud cloud




//database connection
const db = require('./database/db')();

// socket connection
var server = require('http').Server(app);
var io = require('socket.io')(server,
    
    
    {
    cors: {
      origin:'*',
      methods: ["GET", "POST", "PUT","DELETE"],
      allowedHeaders: ["my-custom-header"],
      credentials: true
    }
  }
  
  ); 
app.set('io',io);
io.on('connection', socket => {
    console.log("new  sockeet connection...");
    socket.emit("test event","hey utsav");
});

// for testing purpose
app.get('/', (req, res) => {
    res.send("Hello Utsav from Canteen Server")
})

// use all routes
app.use('/', authRoutes)
app.use('/user', userRoutes)
app.use('/data', dataRoutes)
app.use("/products", productRoutes);
// for debugging
server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})

