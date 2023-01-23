
// Mongoose
const DB = require('mongoose');

const DB_CONNECT_STRING = process.env.DB_CONNECT_STRING
const DB_NAME = process.env.DB_NAME
DB.set('strictQuery',true);
DB.connect(DB_CONNECT_STRING,{ 
    dbName : 'Taixiu_Database',
    useNewUrlParser: true, 
    useUnifiedTopology: true
})
.catch((err)=>{
    console.log(err);
})
.then(()=>{
    console.log('\nConnect database success!');
})
.finally(()=>{
    console.log(`Connect at ${new Date().toString()}`);
})
module.exports = DB;
