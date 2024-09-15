const express = require('express');
const router = express.Router();
//mongoose user model 
const User = require('../models/user');
//password hander
const bcrypt = require('bcrypt');
//singup
router.post('/signup', (req, res) =>{

    let {name, email, password} = req.body;
    name = name.trim();
    email = email.trim();
    password = password.trim();

    if(name == "" || email == "" || password == ""){
        res.json({
            status: 'FAILED',
            message: 'Empty input filed!'
        });

    }else if(!/^[a-zA-Z ]*$/.test(name)){
        res.json({
            status: 'FAILED',
            message: 'INVALID NAME ENTERED!'
        })
    }else if(!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)){
        res.json({
            status: 'FAILED',
            message: 'INVALID EMAIL ENTERED!'
        })
    }else if(password.length < 8){
        res.json({
            status: 'FAILED',
            message: 'Password is too short!'
        })
    }else{
         //check if user already exist
         User.find({email}).then(result =>{
            if(result.length){
                //a user already exist
                res.json({
                    status: 'FAILED',
                    message: 'User with provide email already exist!'
             })
            }else{

                //try to create new user 

                //password handling 
                const saltRounds = 10;
                bcrypt.hash(password, saltRounds).then(hashedPassword =>{
                    const newUser = new User({
                        name,
                        email,
                        password: hashedPassword
                    });
                    newUser.save().then(result =>{
                        res.json({
                            status: 'SUCCESS',
                            message: 'Sign up successfully!',
                            data: result
                        });
                    })
                    .catch(err =>{
                        console.log(err);
                    res.json({
                        status: 'FAILED',
                        message: 'An error accurred while saving user account!'
                    });

                })
            })
            .catch(err =>{
                console.log(err);
                res.json({
                    status: 'FAILED',
                    message: 'An error accurred while hashing password!'
                });
            })
        }
    })
    .catch(err =>{
        console.log(err);
        res.json({
            status: 'FAILED',
            message: 'An error accurred while checking user!'
            });
        })
    }
})


//signin
router.post('/signin', (req, res) =>{

let {email, password} = req.body;
email = email.trim();
password = password.trim();

if(email == "" || password == ""){
    res.json({
        status: 'FAILED',
        message: 'Empty credential supplier!'
    })
}else{
    //check if user exist 
    User.find({email})
    .then(data => {
        if(data.length){
            //User exist 
            const hashedPassword = data[0].password;
            bcrypt.compare(password, hashedPassword).then(result => {
                if(result) {
                    res.json({
                        status: "Success",
                        message: "Sign Successful!",
                        data: data
                    })
                }else{
                    res.json({
                        status: "Failed",
                        message: "Invalid Password entered!",
                        data: data
                    })
                }

            })
            .catch(err =>{
                res.json({
                    status: "FAILED",
                    message: "An error accurred while comparing password!"
                    });
                 })
            }else{
                res.json({
                    status: "Failed",
                    message: "Invaild credentials entered!"
                });
            }
        })
        .catch(err =>{
            res.json({
                status: "FAILED",
                message: "An error accurred while checking for existing user!"
            });
        })
    }

});
module.exports = router;