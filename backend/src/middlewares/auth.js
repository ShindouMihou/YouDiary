const express = require('express');
const fs = require('fs');
const config = require('../config/bucket');
const bcrypt = require('bcrypt');
let hash;
const router = express.Router();

if (config.BUCKET_NAME == undefined) {
    throw new Error('BUCKET_NAME cannot be undefined!');
}

if (!fs.existsSync('.youdiary')) {
    hash = bcrypt.hashSync(config.BUCKET_NAME, bcrypt.genSaltSync(10));
    fs.writeFileSync('.youdiary', hash);
}

if (hash == null) {
    hash = fs.readFileSync('.youdiary').toString();
}

if (!bcrypt.compareSync(config.BUCKET_NAME, hash)) {
    console.error(`The content in .youdiary does not match with the current config.BUCKET_NAME. If you changed the .env file, please delete the .youdiary file and try again.`);
    return;
}

router.use((req, res, next) => {
    if (req.query.bucket === undefined) {
        res.status(400).send({
            error: 'Invalid request credientials.'
        });
        return;
    }

    if (Buffer.from(req.query.bucket, 'base64url').toString('ascii') !== hash) {
        res.status(400).send({
            error: 'Invalid request credientials.'
        });
        return;
    }

    next();
});

module.exports = {
    ROUTER: router,
    HASH: hash
};