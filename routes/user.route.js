const express = require('express');
const router = express.Router();
//mongoose user model 
const User = require('../models/user');
//password hander
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const verifyToken = require('../middleware/authmiddleware');
const { date } = require('joi');


// Secret keys for JWT (store in environment variable for production)
const JWT_SECRET = process.env.JWT_SECRET || 'happen'; 
const JWT_EXPIRY = '1h'; // Access token expiry

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
// Get All Users
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// Get User by ID
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// Update User
router.patch('/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
// Delete User
router.delete('/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
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

        res.json({ 
            status: 'SUCCESS', 
            message: 'Sign up successfully!',
            data:{
                name: name,
                email: email,
                password: password,
            }
         });
       
    } catch (error) {
        console.log(error);
        res.json({ status: 'FAILED', message: 'An error occurred while saving user account!' });
    }
});

//signin
router.post('/signin', async (req, res) => {
    let { email, password } = req.body;
    email = email.trim();
    password = password.trim();

    if (!email || !password) {
        return res.json({
            status: 'FAILED',
            message: 'Empty credential supplied!'
        });
    }

    try {
        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({
                status: "FAILED",
                message: "Invalid credentials entered!"
            });
        }

        // Compare passwords
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.json({
                status: "FAILED",
                message: "Invalid Password entered!",
            });
        }

        // Generate token
        const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

        // Respond with success and the token
        return res.json({
            status: "SUCCESS",
            message: "Sign in successful!",
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                },
                token
            }
        });
    } catch (error) {
        console.error('Error during sign-in:', error);
        return res.status(500).json({
            status: "FAILED",
            message: "An error occurred while signing in!"
        });
    }
});
module.exports = router;