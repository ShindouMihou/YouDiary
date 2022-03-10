const express = require('express');
const fs = require('fs');
const config = require('../config/bucket');
const router = express.Router();

router.delete('/:file', (req, res) => {
    try {
        fs.rmSync(`${config.BUCKET_PATH}/${decodeURI(req.params.file)}.json`);
        return res.send({
            acknowledged: true
        });
    } catch (err) {
        console.error(err);
        return res.status(400).send({
            acknowledged: false,
            reason: 'File not found.'
        });
    }
});

module.exports = router;