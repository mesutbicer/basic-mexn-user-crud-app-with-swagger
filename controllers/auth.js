const Auth = require('../models/auth.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req,res)=>{
    try{
        const {username, email, password} = req.body;

        console.log("req.body : " + JSON.stringify(req.body));
        console.log("username : " + username);
        console.log("email : " + email);
        console.log("password : " + password);

        if(username===undefined || email===undefined || password===undefined){
            //bad request
            return res.status(400).json({message: "username, email veya password değerlerinden biri undefined !!!"});
        }

        const user = await Auth.findOne({email});

        if(user){
            //bad request
            return res.status(400).json({message: "Bu email hesabı zaten bulunuyor !!!"});
        }
        if(password.length<6){
            //bad request
            return res.status(400).json({message: "Parolanız 6 karakterden küçük olmamalı !!!"});
        }

        const passwordHash = await bcrypt.hash(password, 12);

        const newUser = await Auth.create({username, email, password : passwordHash});

        const userToken = await jwt.sign({id: newUser.id}, process.env.SECRET_TOKEN, {expiresIn:'1h'});

        res.status(201).json({
            status: "OK",
            newUser,
            userToken
        });
    }
    catch (e) {
        //Server Error
        return res.status(500).json({message: e.message});
    }
}

const login = async (req, res) =>{
    try{
        const {email,password} = req.body;
        const user = await Auth.findOne({email});

        if(!user){
            //bad request
            return res.status(400).json({message: "Böyle bir kullanıcı bulunamadi !!!"});
        }

        const comparedPass = await bcrypt.compare(password,user.password);
        if(!comparedPass){
            return res.status(400).json({message : "Parolanız yanlış !!!"});
        }

        const token = jwt.sign({id: user.id}, process.env.SECRET_TOKEN, {expiresIn:'1h'});

        res.status(200).json({
            status: "OK",
            user,
            token
        });
    }
    catch (e) {
        //Server Error
        return res.status(500).json({message: e.message});
    }
}



module.exports = {
    register,
    login
};