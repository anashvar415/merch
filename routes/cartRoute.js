const express = require('express');

const Cart=require("../models/cart.js");

const Product=require("../models/product.js");

require('dotenv').config(); 
const { auth} = require('../middleware.js');


const cartrouter=express.Router();
cartrouter.get('/', auth, async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.user.id });
        if (!cart) {
           
            return res.status(200).json({ items: [] });
        }
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Server error while fetching cart.' });
    }
});
cartrouter.post('/', auth, async (req, res) => {
    const { productId, quantity } = req.body;
    const userId = req.user.id;

    try {
        
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found.' });
        }

        let cart = await Cart.findOne({ userId });

        if (cart) {
           
            const itemIndex = cart.items.findIndex(p => p.productId.toString() === productId);

            if (itemIndex > -1) {
               
                cart.items[itemIndex].quantity = quantity;
            } else {
                
                cart.items.push({ productId, quantity, name: product.name, price: product.price, imageUrl: product.imageUrl });
            }
        } else {
            
            cart = new Cart({
                userId,
                items: [{ productId, quantity, name: product.name, price: product.price, imageUrl: product.imageUrl }]
            });
        }

        const savedCart = await cart.save();
        res.status(200).json(savedCart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while updating cart.' });
    }
});
cartrouter.delete('/api/cart/:productId', auth, async (req, res) => {
    const { productId } = req.params;
    const userId = req.user.id;

    try {
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found.' });
        }

        
        cart.items = cart.items.filter(item => item.productId.toString() !== productId);

        const savedCart = await cart.save();
        res.status(200).json(savedCart);
    } catch (error) {
        res.status(500).json({ message: 'Server error while removing item from cart.' });
    }
});
module.exports = cartrouter;