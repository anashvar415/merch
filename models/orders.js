const mongoose=require('mongoose');
const User=require("./user.js");
const Product=require("./product.js");

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true },
        name: String,
        price: Number
    }],
    totalPrice: { type: Number, required: true },
    mobileNumber:{type: Number, required: true },
    shippingAddress: {
        hostelName: { type: String, required: true },
        roomNo: { type: String, required: true },
       
    },
    status: {
        type: String,
        enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Pending'
    }
}, { timestamps: true });
const Order = mongoose.model('Order', orderSchema);
module.exports=Order;