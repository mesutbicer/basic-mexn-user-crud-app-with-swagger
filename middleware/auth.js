const jwt = require("jsonwebtoken");

const auth = async (req,res,next)=>{
    try{
        if(!req.headers.authorization){
            //Bad Request
            return res.status(400).json({message: "Lütfen öncelikle login olarak Bearer TOKEN alınız ve o şekilde istekte bulununuz !!!"});
        }

        // Bearer kjsvhjkhzjkvhjk<czvjk.... den 2. kisim alinir.
        const token = req.headers.authorization.split(" ")[1];
        let decodedData;
        if(token){
            decodedData = jwt.verify(token, process.env.SECRET_TOKEN);

            req.userId = decodedData?.id;
        }
        else{
            decodedData = jwt.decode(token);

            req.userId = decodedData?.sub;
        }

        next();
    }
    catch (e) {
        console.log(`Error in Middleware Auth : ${e}`);
        //BAd Request
        return res.status(400).json({message: e.message});
    }
}

module.exports = auth;