import rateLimit from 'express-rate-limit';

// General API rate limiter (100 requests per 15 minutes)
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, 
  message: {
    message: 'Too many requests from this IP, please try again after 15 minutes'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false,  // Disable the `X-RateLimit-*` headers
});

// Strict authentication rate limiter (10 login/register requests per 15 minutes)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: {
    message: 'Too many login or registration attempts, please try again after 15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict form submission rate limiter (5 contact/appointment forms per 15 minutes)
export const formLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: {
    message: 'Too many form submissions from this IP, please try again after 15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});
