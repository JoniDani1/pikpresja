const cors = require('cors')
const express = require('express')
const {rateLimit} = require('express-rate-limit')

const corsMiddleware = cors()
const jsonMiddleware = express.json()

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, //1 minute
    max: 2, // limit each IP to 20 requests per windowMs
    message: {
    error: 'Too many requests from this IP address',
    retryAfter: '1 minute',
    documentation: 'https://api.example.com/docs/rate-limits'
     },
    standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    ipv6Subnet: 56, // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive
    // store: ... , // Redis, Memcached, etc. See below.
})

module.exports = {
    corsMiddleware,
    jsonMiddleware,
    limiter

}