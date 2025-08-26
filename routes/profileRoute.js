const express = require('express');

const User=require("../models/user.js");

require('dotenv').config(); 
const { auth} = require('../middleware.js');




const profilerouter=express.Router();
profilerouter.get('/', auth, async (req, res) => {
    try {
      
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error while fetching profile.' });
    }
});
  
profilerouter.put('/', auth, async (req, res) => {
    try {
        const { name, phone, address } = req.body;
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { name, phone, address },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'Server error while updating profile.' });
    }
});
module.exports = profilerouter;
