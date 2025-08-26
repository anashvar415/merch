require('dotenv').config(); 



const express = require('express');
const Order=require("../models/orders.js");

const Cart=require("../models/product.js");

const { auth} = require('../middleware.js');



const orderrouter=express.Router();
orderrouter.post('/', auth, async (req, res) => {
    try {
        const userId = req.user.id;
        const { shippingAddress } = req.body;

        
        const cart = await Cart.findOne({ userId });
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Cannot checkout with an empty cart.' });
        }

     
        const totalPrice = cart.items.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);

       
        const newOrder = new Order({
            userId,
            items: cart.items,
            totalPrice,
            mobileNo,
            shippingAddress
        });
        const savedOrder = await newOrder.save();
        
       
        cart.items = [];
        await cart.save();

      
        res.status(201).json({ message: 'Order created successfully!', order: savedOrder });

    } catch (error) {
      
        res.status(500).json({ message: 'Server error during checkout.' });
    }
});
orderrouter.get('/', auth, async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 }); 
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server error while fetching orders.' });
    }
});


orderrouter.get('/:id', auth, async (req, res) => {
    try {
        const order = await Order.findOne({ _id: req.params.id, userId: req.user.id });
        if (!order) {
            return res.status(404).json({ message: 'Order not found or you do not have permission to view it.' });
        }
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: 'Server error.' });
    }
});
module.exports = orderrouter;