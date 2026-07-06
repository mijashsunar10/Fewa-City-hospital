/**
 * Sanitization middleware to protect against NoSQL Injection and Cross-Site Scripting (XSS)
 */

// Recursive NoSQL sanitizer to strip keys beginning with '$'
const sanitizeNoSQL = (obj) => {
  if (obj && typeof obj === 'object') {
    for (const key in obj) {
      if (key.startsWith('$')) {
        delete obj[key];
      } else if (typeof obj[key] === 'object') {
        sanitizeNoSQL(obj[key]);
      }
    }
  }
};

// Recursive HTML/XSS sanitizer to strip scripts and event handlers
const sanitizeXSS = (obj) => {
  if (obj && typeof obj === 'object') {
    for (const key in obj) {
      if (typeof obj[key] === 'string') {
        obj[key] = obj[key]
          .replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, '') // Strip script blocks
          .replace(/on\w+="[^"]*"/gi, '')                    // Strip inline event attributes
          .replace(/on\w+='[^']*'/gi, '')
          .replace(/on\w+=\w+/gi, '')
          .replace(/javascript:[^\s]*/gi, '');                // Strip javascript: pseudo-protocols
      } else if (typeof obj[key] === 'object') {
        sanitizeXSS(obj[key]);
      }
    }
  }
};

export const sanitizeInput = (req, res, next) => {
  // Sanitize query params
  if (req.query) {
    sanitizeNoSQL(req.query);
    sanitizeXSS(req.query);
  }

  // Sanitize body payload
  if (req.body) {
    sanitizeNoSQL(req.body);
    sanitizeXSS(req.body);
  }

  // Sanitize route parameters
  if (req.params) {
    sanitizeNoSQL(req.params);
    sanitizeXSS(req.params);
  }

  next();
};
