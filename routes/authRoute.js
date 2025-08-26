require('dotenv').config(); 


const express = require('express');

const User=require("../models/user.js");

const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken'); 






const authrouter=express.Router();

    authrouter.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Please enter all fields.' });
        }

        
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found.' });
        }

        
        const check = await bcrypt.compare(password, user.password);
        if (!check) {
            return res.status(400).json({ message: 'Invalid credentials.' });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
           process.env.SECRET_KEY ,
            { expiresIn: '3h' }
        );

        res.status(200).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        
        res.status(500).json({ message: 'Error during login.' });
    }
});



 authrouter.post('/signup', async (req, res) => {
    
 const { name, email, password } = req.body;
      try{  if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please enter all fields.' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists.' });
        }

      
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        
        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });
        const regisUser = await newUser.save();
     
        const token = jwt.sign({
  id: regisUser._id, role: regisUser.role
}, process.env.SECRET_KEY, { expiresIn: '12h' });
res.status(201).json({
            token,
            user: {
                id: regisUser._id,
                name: regisUser.name,
                email: regisUser.email,
                role: regisUser.role
            }
        });}
        catch(err){
            res.status(500).json({message:"Error during signup"});
        }

    });
    
module.exports = authrouter;