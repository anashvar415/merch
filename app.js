const express = require('express');
const mongoose=require('mongoose');
const cors = require('cors');

require('dotenv').config(); 

const app = express();
const PORT = 3000;
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const productRouter = require('./routes/productRoute.js');
const authRouter = require('./routes/authRoute.js');

const cartRouter = require('./routes/cartRoute.js');
const orderRouter = require('./routes/orderRoute.js');

const wishlistRouter = require('./routes/wishlistRoute.js');
const adminRouter = require('./routes/adminRoute.js');

const profileRouter = require('./routes/profileRoute.js');


const dbUrl=process.env.ATLAS_URL;
async function main(){
await mongoose.connect(dbUrl);

        
    }
    main().then(()=>{    console.log("connected to db");}
)
.catch((err)=>{
        console.log(err);
    });


app.use('/api/auth', authRouter);
app.use('/api/products', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/wishlist', wishlistRouter);
app.use('/api/orders', orderRouter);

app.use('/api/profile', profileRouter);
app.use('/api/admin', adminRouter);
app.get('/',(req,res)=>{
    res.send("welcome");
});
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
