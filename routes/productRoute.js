const express = require('express');

require('dotenv').config(); 
const { auth,adminAuth} = require('../middleware.js');


const { storage } = require('./cloudconfig.js'); 

const productrouter=express.Router();
const multer = require('multer');
const Product = require("../models/product.js"); 


const upload = multer({ storage });

productrouter.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found.' });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Server error.' });
    }
});

productrouter.post('/', auth, adminAuth, upload.single('productImage'), async (req, res) => {
    try {
        
        const { name, category, price, description, stock } = req.body;
        
        if (!req.file) {
            return res.status(400).json({ message: 'Product image is required.' });
        }

        const imageUrl = req.file.path;

        if (!name || !category || !price || !description) {
            return res.status(400).json({ message: 'Please provide all required fields.' });
        }
        
        const newProduct = new Product({ name, category, price, description, stock, imageUrl });
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(500).json({ message: 'Server error while adding product.' });
    }
});


productrouter.put('/:id', auth, adminAuth, upload.single('productImage'), async (req, res) => {
    try {
        const updateData = { ...req.body };

        if (req.file) {
           
            updateData.imageUrl = req.file.path;
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found.' });
        }
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: 'Server error while updating.' });
    }
});



productrouter.delete('/:id', auth, adminAuth, async (req, res) => {
    try {
        const delProduct = await Product.findByIdAndDelete(req.params.id);
        if (!delProduct) {
            return res.status(404).json({ message: 'Product not found.' });
        }
        res.status(200).json({ message: 'Product deleted successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Server error while deleting.' });
    }
});
module.exports = productrouter;