const User = require("../Models/User");
const jwt = require('jsonwebtoken');//generate signin token
const {expressjwt} = require('express-jwt');//authoration check
//  const errorHandler = require("../helpers/dbErrorHandler");

exports.signup = (req, res) => {
    console.log("req.body+++++++++++++++", req.body);
    const user = new User(req.body);
    user.save((err, user) => {
        console.log("I am inside save method")
        if (err) {
            console.log("I am inside if block method")

            return res.status(400).json({
                err
            })
        }
        user.salt = undefined;
        user.hashed_password = undefined;
        console.log("user+++++++++++++++++++", user)
        res.json({
            user: user
        })

    })
};


exports.signin = (req, res) => {
    //find user based on email
    console.log('body',req.body);
    const { email, password } = req.body;
   
    User.findOne({ email }, (err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: "User with that email does not exit"
            });
        }
        //authenticateuser
        //create authentication method in user model
 if(!user.authenticate(password)){
    return res.status(401).json({
        error : 'email and password dont match '
    })
 }
        //generate signed token with user id and secret
            console.log('user:::', user);
            console.log('Secret key:', process.env.JWT_SECRET);
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET)

        //persist the token as't' with cookie expiry date
 console.log('token', token);
        res.cookie("t",token, {expire: new Date() +9999})
        // return responnse eith user and token to frontend client
   
        const {_id, name, email, role} = user;
        return res.json({token, user:{_id, name, email, role}})

   
    });
};

exports.signout = (req, res) => {
     res.clearCookie('t')
     res.json({message:'signout succesfully'})
}

exports.requireSignin = expressjwt({
    secret: process.env.JWT_SECRET ,
   
    algorithms: ['HS256'],
    userProperty:"auth"
});


exports.isAuth =(req, res,next) =>{
    console.log("req.profile++++++++",req.profile)
    console.log("req.auth++++++++",req.auth)
    console.log("req.profile._id++++++++",req.profile._id)
    console.log("req.auth.id++++++++",req.auth.id)


    let user = req.profile && req.auth && req.profile.id ==  req.auth.id
console.log("before user+++++++++++++++",user)
console.log("After user+++++++++++++++",user)

console.log(req.profile._id);
console.log("req.auth._id+++++++++++++++",req.auth.id);
    if(!user){
        return  res.status(400).json({
        error:"access denied"
    });
}
next();
};


exports.isAdmin = (req,res,next) => {
    if(req.profile.role === 0){
         return res.status(403).json({
            error:"admin resourse "
         });
        
    };
    next();
};                                              