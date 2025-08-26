require('dotenv').config(); 

const express = require('express');
const Order=require("../models/orders.js");

const User=require("../models/user.js");

const { auth,adminAuth} = require('../middleware.js');


const adminrouter=express.Router();
adminrouter.get('/stats', auth, adminAuth, async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalOrders = await Order.countDocuments();
        
        const salesData = await Order.aggregate([
            { $match: { status: { $in: ['Paid', 'Shipped', 'Delivered'] } } },
            { $group: { _id: null, totalRevenue: { $sum: "$totalPrice" } } }
        ]);

        const totalRevenue = salesData.length > 0 ? salesData[0].totalRevenue : 0;

        res.status(200).json({ totalUsers, totalOrders, totalRevenue });
    } catch (error) {
        res.status(500).json({ message: 'Server error while fetching stats.' });
    }
});


adminrouter.get('/orders', auth, adminAuth, async (req, res) => {
    try {
        const orders = await Order.find().populate('userId', 'name email').sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server error while fetching orders.' });
    }
});

adminrouter.put('/orders/:id', auth, adminAuth, async (req, res) => {
    try {
        const { status } = req.body;
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        );
        if (!updatedOrder) {
            return res.status(404).json({ message: 'Order not found.' });
        }
        res.status(200).json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: 'Server error while updating order status.' });
    }
});

adminrouter.get('/users', auth, adminAuth, async (req, res) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error while fetching users.' });
    }
});
module.exports=adminrouter;