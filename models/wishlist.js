const mongoose=require ('mongoose');
const User=require("./user.js");
const Product=require("./product.js");
const wishlistSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    items: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        name: String, 
        price: Number,
        imageUrl: String
    }]
}, { timestamps: true });
const Wishlist = mongoose.model('Wishlist', wishlistSchema);
module.exports=Wishlist;