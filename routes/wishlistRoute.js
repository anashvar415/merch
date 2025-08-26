const express = require('express');

const Wishlist=require("../models/wishlist.js");
const Product=require("../models/product.js");

require('dotenv').config(); 
const { auth} = require('../middleware.js');





const wishlistrouter=express.Router();
wishlistrouter.get('/', auth, async (req, res) => {
    try {
        const wishlist = await Wishlist.findOne({ userId: req.user.id });
        if (!wishlist) {
            return res.status(200).json({ items: [] });
        }
        res.status(200).json(wishlist);
    } catch (error) {
        res.status(500).json({ message: 'Server error while fetching wishlist.' });
    }
});

wishlistrouter.post('/', auth, async (req, res) => {
    const { productId } = req.body;
    const userId = req.user.id;

    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found.' });
        }

        let wishlist = await Wishlist.findOne({ userId });

        if (wishlist) {
          
            const itemIndex = wishlist.items.findIndex(p => p.productId.toString() === productId);
            if (itemIndex > -1) {
                return res.status(400).json({ message: 'Item already in wishlist.' });
            }
            
            wishlist.items.push({ productId, name: product.name, price: product.price, imageUrl: product.imageUrl });
        } else {
          
            wishlist = new Wishlist({
                userId,
                items: [{ productId, name: product.name, price: product.price, imageUrl: product.imageUrl }]
            });
        }

        const savedWishlist = await wishlist.save();
        res.status(200).json(savedWishlist);
    } catch (error) {
        res.status(500).json({ message: 'Server error while updating wishlist.' });
    }
});

wishlistrouter.delete('/:productId', auth, async (req, res) => {
    const { productId } = req.params;
    const userId = req.user.id;

    try {
        let wishlist = await Wishlist.findOne({ userId });
        if (!wishlist) {
            return res.status(404).json({ message: 'Wishlist not found.' });
        }

        wishlist.items = wishlist.items.filter(item => item.productId.toString() !== productId);

        const savedWishlist = await wishlist.save();
        res.status(200).json(savedWishlist);
    } catch (error) {
        res.status(500).json({ message: 'Server error while removing item from wishlist.' });
    }
});
module.exports = wishlistrouter;