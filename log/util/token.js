const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const COOKIE_NAME = 'capture_token';
const MAX_AGE = 3 * 60 * 60 * 1000; // 3 hours
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;

if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length !== 64) {
  throw new Error('ENCRYPTION_KEY must be a 32-byte hex string');
}


const generateToken = (user) => {
  return jwt.sign({
    userId: user.id,
    role: user.roleUsers[0].role.name,
  }, process.env.SECRET_KEY, {
    expiresIn: '3h',
  });
};

const encryptToken = (token) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
  const encrypted = Buffer.concat([cipher.update(token), cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
};

const decryptToken = (encryptedToken) => {
  try {
    const parts = encryptedToken.split(':');
    if (parts.length !== 2) {
      throw new Error('Invalid encrypted token format');
    }
    const iv = Buffer.from(parts.shift(), 'hex');
    const encrypted = Buffer.from(parts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
    return decrypted.toString();
  } catch (error) {
    console.error('Error decrypting token:', error);
    return null;
  }
};

const setAuthCookie = (res, token) => {
  const encryptedToken = encryptToken(token);
  res.cookie(COOKIE_NAME, encryptedToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: MAX_AGE,
    overwrite: true,
    path: '/',
  });
};

const clearAuthCookie = (res) => {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    path: '/',
  });
};


const verifyToken = (token) => {
  try {
    if (!token) {
      return null;
    }
    const decryptedToken = decryptToken(token);
    if (!decryptedToken) {
      return null;
    }
    const decoded = jwt.verify(decryptedToken, process.env.SECRET_KEY);
    return decoded;
  } catch (error) {
    console.error('Error verifying token:', error);
    return null;
  }
};

const getTokenFromCookie = (req) => {
  if (!req || !req.cookies) {
    return null;
  }
  return req.cookies[COOKIE_NAME];
};

module.exports = { generateToken, setAuthCookie, clearAuthCookie, verifyToken, getTokenFromCookie };
