let pool=require('../config/db');
let cookieparser=require('cookie-parser');
let jwt=require('jsonwebtoken');
require('dotenv').config();

let authcontroller=(req,res)=>{
    let {email,password}=req.body; 
    console.log(password);
    if (!email || !password)
    {
        return res.status(400).json({valid:false,message:"Enter your all Credentials first!"})
    }
    let sqlquery1="SELECT * FROM MASTER WHERE MAIL= ?";
    pool.query(sqlquery1,[email],(err,result)=>{
        if(err)
        {
            return res.status(400).json({valid:false,message:"Something error occurs!"})
        }
        if(result.length===0)
        {
            return res.status(500).json({valid:false,message:"Details not avilable!"})
        }
        let user=result[0];
        if(user&&user.password==password)
        {
            let jwttoken=jwt.sign({email},process.env.SECRET_KEY,{
                expiresIn:"1d"
            })
            res.cookie("token",jwttoken,{
                httpOnly:true,
                secure: true,
                sameSite: 'Strict',
                maxAge: 86400000
            })
            return res.status(200).json({valid:true,message:"loggedin Successfully!"})
        }
        else{
            return res.status(400).json({valid:false,message:"User details not Verified!"});
        }
    })
}
module.exports={authcontroller}