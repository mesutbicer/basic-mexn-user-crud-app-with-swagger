const User = require('../models/auth.js');
const jwt = require("jsonwebtoken");
const Auth = require("../models/auth.js");
const bcrypt = require("bcryptjs");

const getUsers = async (req, res) =>{
    try{
        const users = await User.find();

        res.status(200).json({
            users
        });
    }
    catch (e) {
        //Server Error
        return res.status(500).json({message: e.message});
    }
}

const getUserById = async (req, res) =>{
    try{
        const {id} = req.params;

        const userInDb = await User.findById(id);

        if(!userInDb){
            //Bad Request
            return res.status(400).json({message: "Bu ID li user sistemde mevcut değil !!!"});
        }

        res.status(200).json({
            userInDb
        });
    }
    catch (e) {
        //Server Error
        return res.status(500).json({message: e.message});
    }
}

const updateUserById = async (req, res) =>{
    try{
        const {id} = req.params;
        const {_id, username, email, password} = req.body;

        if(_id !== id){
            //Bad Request
            return res.status(400).json({message: "Lütfen istekte bulunulan ID ile req.body ID si ni aynı şekilde gönderiniz !!!"});
        }

        const userInDb = await User.findById(id);
        if(userInDb.email !== email){
            //Bad Request
            return res.status(400).json({message: "Lütfen istekte bulunulan email ile req.body email'ini aynı şekilde gönderiniz !!!"});
        }

        //Yeni password gonderilirse bcrypt ile bunu hash leyip save etmek lazım !!!
        const passwordHash = await bcrypt.hash(password, 12);
        const updatedUser = {_id, username, email, password : passwordHash};

        const userInDbUpdated = await User.findByIdAndUpdate(id, updatedUser, {new: true});

        if(!userInDbUpdated){
            //Bad Request
            return res.status(400).json({message: "Bu ID li user sistemde mevcut değil !!!"});
        }

        res.status(200).json({
            userInDbUpdated
        });
    }
    catch (e) {
        //Server Error
        return res.status(500).json({message: e.message});
    }
}

const deleteUserById = async (req, res) =>{
    try{
        const {id} = req.params;

        const userInDb = await User.findById(id);
        if(!userInDb){
            //Bad Request
            return res.status(400).json({message: "Bu ID li user sistemde mevcut değil !!!"});
        }

        //TODO : Kisi kendisini silmeye calisirsa izin vermeyelim ayrıca !!!

        await User.findByIdAndRemove(id);

        res.status(200).json({
            message : "Silme işlemi başarılı !!!"
        });
    }
    catch (e) {
        //Server Error
        return res.status(500).json({message: e.message});
    }
}

//TODO : JWT stateless oldugundan dolayı bu yaklasim PROD icin ASLA yeterli değildir!
// PROD için REDIS tabanlı bir yaklaşım sergilenmesi uygun olacaktır !
// Bu yaklasim senaryoya uygun kalinmasi amacli eklenmistir!
const logoutUserById = async (req, res) => {
    try{
        if (req.headers && req.headers.authorization && req.params && req.params.id) {
            const {id} = req.params;

            console.log("req.headers.authorization : " + JSON.stringify(req.headers.authorization));
            let token = req.headers.authorization;
            if(req.headers.authorization.includes("Bearer")){
                token = req.headers.authorization.split(' ')[1];
            }

            console.log("token : " + JSON.stringify(token));
            if (!token) {
                return res
                    .status(401)
                    .json({ success: false, message: 'Token expire veya geçersiz!' });
            }

            const decoded = jwt.verify(token, process.env.SECRET_TOKEN);
            //decoded : {"id":"63d5426a4dfd50d62040109b","iat":1674992762,"exp":1674996362}
            // 63d5426a4dfd50d62040109b ID li user nesnesi icin
            console.log("decoded : " + JSON.stringify(decoded));
            const loggedInUser = await Auth.findById(decoded.id);

            if(!loggedInUser || decoded.id!==id) {
                //bad request
                return res.status(400).json({message: "Logout isteği hatalı. User id ve token eşleşmedi!!!"});
            }

            res.json(
                {
                    success: true,
                    message: 'Logout başarılı. ' +
                        'Lütfen gerekli COOKIE delete işlemlerini FE tarafında da yapınız. ' +
                        'Ayrıca profesyonel bir JWT logout mimarisi için REDIS tabanlı jwt-redis npmjs paketine de bakılabilir!'
                }
            );
        }
        else{
            //bad request
            return res.status(400).json({message: "Logout isteği hatalı. Uygun 1 Bearer code yok veya userId eklenmemiş!!!"});
        }
    }
    catch (e) {
        //Server Error
        return res.status(500).json({message: e.message});
    }
};

module.exports = {
    getUsers,
    getUserById,
    updateUserById,
    deleteUserById,
    logoutUserById
};