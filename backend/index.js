const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();

const app = express();

//default Middleware
app.use(express.json({ extended: true })); // for postman //Used to parse JSON bodies
//app.use(cors()); //Middleware for connect server and react (used for server connection with unknown url)
//app.use(express.urlencoded({ extended: true })); //for send the data via form //Parse URL-encoded bodies
//app.use(cookieParser());

const port = process.env.PORT || 4000;


//Databae Connection
mongoose.set("strictQuery", true);
mongoose
  .connect(process.env.DB_URL)
  .then(console.log("Connection Successfully"))
  .catch((error) => console.log(error));


//Routing
app.use('/api', require("./routes/allRoutes"));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})