const express = require('express');
const { RateLimiterMemory } = require('rate-limiter-flexible');
const RATELIMIT_POINTS = 3;
const rateLimiter = new RateLimiterMemory({
    points: RATELIMIT_POINTS,
    duration: 1
});
const router = express.Router();

router.use(async (req, res, next) => {
    rateLimiter.consume(req.ip).then(rateLimiterRes => {
        res.header({
            "Retry-After": rateLimiterRes.msBeforeNext,
            "X-RateLimit-Limit": RATELIMIT_POINTS,
            "X-RateLimit-Remaining": rateLimiterRes.remainingPoints,
            "X-RateLimit-Reset": new Date(Date.now() + rateLimiterRes.msBeforeNext)
        });
        next();
    }).catch(rateLimiterRes => {
        res.status(429).header({
            "Retry-After": rateLimiterRes.msBeforeNext,
            "X-RateLimit-Limit": RATELIMIT_POINTS,
            "X-RateLimit-Remaining": rateLimiterRes.remainingPoints,
            "X-RateLimit-Reset": new Date(Date.now() + rateLimiterRes.msBeforeNext)
        }).send({
            error: 'You are sending too many requests!'
        });
    });
});


module.exports = router;