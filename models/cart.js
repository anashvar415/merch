const mongoose=require('mongoose');
const User=require("./user.js");
const Product=require("./product.js");
const cartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    items: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true, min: 1, default: 1 },
        name: String, 
        price: Number,
        imageUrl: String 
    }]
}, { timestamps: true });
const Cart = mongoose.model('Cart', cartSchema);
module.exports =Cart;