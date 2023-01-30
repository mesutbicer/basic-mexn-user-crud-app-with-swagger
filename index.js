const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cron = require('node-cron');
const path = require("path");
const db = require("./config/database.js");
const Auth = require('./routes/auth.js');
const User = require('./routes/user.js');

dotenv.config();

const app = express();

//https://www.section.io/engineering-education/how-to-use-cors-in-nodejs-with-express/
app.use(cors({
    origin: '*'
}));

//**********************************************************************************************************************
//SWAGGER : https://www.npmjs.com/package/swagger-ui-express
const swaggerUi = require('swagger-ui-express');
// const swaggerDocument = require('./swaggerV3.json');
const swaggerDocument = require('./swaggerV2.json');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
//**********************************************************************************************************************

//**********************************************************************************************************************
//* HOW TO FIX req.body undefined in EXPRESS
//* Source: https://akhromieiev.com/req-body-undefined-express/
//**********************************************************************************************************************
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
//json parser
app.use(bodyParser.json());
//**********************************************************************************************************************

app.use('/', Auth);
app.use('/users', User);

app.get('/', (req,res)=>{
    // res.json({
    //     'message': "Hello World :). This is a BASIC MExN USER CRUD APP. For detailed info please use: http://localhost:5000/api-docs/"
    // })
    res.sendFile(path.join(__dirname + '\\index.html'));
});

//**********************************************************************************************************************
// Bu kisim 2-) NodeJS üzerinde elinizde zamanlanmış bir görev olduğunu varsayarak NodeJS ile nasıl programlardınız?
// sorusuna ornek bir cevap verebilmek icin kondu.
// Source: https://www.npmjs.com/package/node-cron
//**********************************************************************************************************************
cron.schedule('*/15 * * * * *', () => {
    console.log('Running a task every 15 seconds');
});
//**********************************************************************************************************************

// const PORT = process.env.PORT || 5000;
const PORT = process.env.PORT;

db();

app.listen(PORT, ()=>{
    console.log(`Server is running on port : ${PORT}`);
})

