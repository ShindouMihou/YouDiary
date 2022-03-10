const express = require('express');
const sanitize = require('sanitize-html');
const fs = require('fs');
const config = require('../config/bucket');
const router = express.Router();
const sanitize_filename = require("sanitize-filename");

router.put('/:file', (req, res) => {
    if (req.body.content == null) {
        return res.send({
            error: 'Invalid request body, missing content.'
        });
    }
    
    const title = sanitize_filename(req.params.file);
    const content = sanitize(req.body.content);
    
    fs.writeFileSync(`${config.BUCKET_PATH}/${Buffer.from(title).toString('base64url')}.json`, JSON.stringify({
        title: title,
        content: content
    }));
    
    return res.send({
        title: title,
        content: content
    });
});

module.exports = router;