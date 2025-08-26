require('dotenv').config(); 

const jwt = require('jsonwebtoken'); 


module.exports.adminAuth = (req, res, next) => {
   
    if (req.user && req.user.role === 'admin') {
       
        next();
    } else {
        
        res.status(403).json({ message: 'Access denied. Admin role required.' });
    }
};
module.exports.auth = (req, res, next) => {
    
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied.' });
    }

    try {
        
       
        const verified = jwt.verify(token,process.env.SECRET_KEY);

    
        req.user = verified;

        
        next();
    } catch (error) {
        
        res.status(401).json({ message: 'Token is not valid.' });
    }
};