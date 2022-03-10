const express = require('express');
const router = express.Router();

router.use((req, res, next) => {
    next();
    console.log(`${new Date().toJSON().slice(0,19).replace('T',':')} ${req.ip} ${req.method} ${req.path}`);
});


module.exports = router;