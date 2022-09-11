const express = require("express");
const app = express();
const config = require("./utils/config");
const db = require('./database/db');
var cors = require('cors')
require("dotenv").config()


app.use(cors())

// For parsing application/json
app.use(express.json());

// to migrate table if not exist or altered

db.sequelize.sync({ alter: true })
  .then(() => {
    console.log(`Database & tables created!`)
  })


//   register routes
app.use('/api/serviceUser', require('./routes/serviceUser'));

let port = process.env.PORT;
app.listen(port, ()=>{
    console.log(`listening to port ${config.devPort}`);
})