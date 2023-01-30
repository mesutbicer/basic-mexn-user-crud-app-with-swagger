const mongoose = require('mongoose');

const db = ()=>{
    mongoose.set("strictQuery", false);
    mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser : true,
        useUnifiedTopology : true
    })
    .then(()=>{
        console.log("Cloud MongoDB Atlas Connected");
    })
    .catch((e)=>{
        //throw new Error(`Error message : ${e.message}`);
        console.log(`Error with DB : ${e}`);
    })
}

module.exports = db;