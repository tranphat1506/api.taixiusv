/* *
 *
 * INIT VARIABLES
 *
 * */
// LOGGER & DEBUG
const debug = console.log.bind();

// ENVIRONMENT VARIABLES
require('dotenv').config()
const NODE_ENV = process.env.NODE_ENV

// EXPRESS
const express = require('express')
const app = express()

// HTTP SERVER
const http = require("http")
const server = http.createServer(app)

// PORT
const PORT = process.env.PORT || 3000;

/* SERVER INIT */

// CONNECT DATABASE 

const DB = require('./src/api/config/db.config');

const taiXiuServices = require('./src/api/services/taixiu');
server.listen(PORT, () => {
    debug(`API SERVER RUN ON PORT ${PORT}`)
    taiXiuServices.startCounter(65);
});
/* ROUTERS */
const ROUTERS = require('./src/api/routers/routers');
app.use('/', ROUTERS);