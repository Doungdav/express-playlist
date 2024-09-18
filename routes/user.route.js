const express = require('express');
const router = express.Router();
//mongoose user model 
const User = require('../models/user');
//password hander
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Secret keys for JWT (store in environment variable for production)
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; 
const JWT_EXPIRY = '1h'; // Access token expiry
const REFRESH_TOKEN_EXPIRY = '7d'; // Refresh token expiry
const refreshTokens = []; // Store refresh tokens (ideally use a database)

//Create User
router.post('', async (req, res) => {
    const user = new User(req.body);
    console.log(user);
    console.log(req.body);
    try {
        await user.save();
    
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

//signup
router.post('/signup', async (req, res) => {
    let { name, email, password } = req.body;
    name = name.trim();
    email = email.trim();
    password = password.trim();

    if (!name || !email || !password) {
        return res.json({ status: 'FAILED', message: 'Empty input fields!' });
    } else if (!/^[a-zA-Z\s.'-]*$/.test(name)) {
        return res.json({ status: 'FAILED', message: 'INVALID NAME ENTERED!' });
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
        return res.json({ status: 'FAILED', message: 'INVALID EMAIL ENTERED!' });
    } else if (password.length < 8) {
        return res.json({ status: 'FAILED', message: 'Password is too short!' });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.json({ status: 'FAILED', message: 'User with provided email already exists!' });
        }
        const existingUsers = await User.find({});
        console.log('Existing users:', existingUsers);

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();

        const token = jwt.sign({ id: newUser._id, name, email }, JWT_SECRET, { expiresIn: JWT_EXPIRY });
        const refreshToken = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });

        refreshTokens.push(refreshToken); // Store refresh token
        res.json({ status: 'SUCCESS', message: 'Sign up successfully!', token, refreshToken });
    } catch (error) {
        console.log(error);
        res.json({ status: 'FAILED', message: 'An error occurred while saving user account!' });
    }
});

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

// Refresh token endpoint
router.post('/refresh-token', (req, res) => {
    const { token } = req.body;

    if (!token || !refreshTokens.includes(token)) {
        return res.sendStatus(403); // Forbidden
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403); // Forbidden
        }

        const newToken = jwt.sign({ id: user.id, name: user.name, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRY });
        res.json({ token: newToken });
    });
});
module.exports = router;