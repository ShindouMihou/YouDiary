const express = require('express');
const config = require('../config/bucket');
const router = express.Router();
const fs = require('fs');

router.get('/', (req, res) => res.send({
    name: config.BUCKET_NAME,
    containers: fs.readdirSync(config.BUCKET_PATH).filter(file => file.endsWith('.json')).map(file => file.replace('.json', '')).map(file => Buffer.from(file, 'base64url').toString('ascii'))
}));

module.exports = router;