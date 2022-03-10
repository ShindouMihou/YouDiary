require('dotenv').config();
const fs = require('fs');
const bodyparser = require('body-parser');
const helmet = require('helmet');
const config = require('./config/bucket');
const colors = require('@colors/colors');
const cors = require('cors');

const express = require('express');
const app = express();

app.set('trust proxy', 1);
app.use(helmet());

const ROUTES = {
    PUT: require('./routes/put'),
    DELETE: require('./routes/delete'),
    GET: require('./routes/get')
};

const MIDDLEWARES = {
    AUTH: require('./middlewares/auth'),
    RATELIMIT: require('./middlewares/ratelimit')
};

if (!fs.existsSync(config.BUCKET_PATH)) {
    fs.mkdirSync(config.BUCKET_PATH);
}

app.use(cors());
app.use(MIDDLEWARES.AUTH.ROUTER);

app.use(express.static(config.BUCKET_PATH));
app.use(bodyparser.json()).use(bodyparser.urlencoded({
    extended: true
}));

app.use(MIDDLEWARES.RATELIMIT).use(ROUTES.GET).use(ROUTES.DELETE).use(ROUTES.PUT);

app.listen(config.BUCKET_PORT, () => {
    console.log(colors.bgBlue(colors.white(colors.bold('YouDiary, Bucketeer'))));
    console.log(colors.bgBlue(colors.white(colors.bold('A simple web-based mark-down text editor.'))));
    console.log('');
    console.log('Please do not share your bucket informatiaton unless you want others to access the data from the front-end.');
    console.log(`Port: ${config.BUCKET_PORT}, Bucket: ${Buffer.from(MIDDLEWARES.AUTH.HASH).toString('base64url')}`);
});