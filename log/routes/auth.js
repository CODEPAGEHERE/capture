const express = require('express');
const router = express.Router();
const { generateToken, setAuthCookie, verifyToken, getTokenFromCookie, clearAuthCookie } = require('../util/token');
const bcrypt = require('bcryptjs');

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    // Query database for user
    const user = await req.prisma.user.findUnique({
      where: { username },
      include: {
        roleUsers: {
          include: {
            role: true,
          },
        },
      },
    });

    // Check if user exists
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Compare passwords
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Generate token
    const token = generateToken(user);

    let redirectTo;
    const role = user.roleUsers[0].role.name;
    if (role === 'super_admin') {
      redirectTo = '/office';
    } else if (role === 'main_admin') {
      redirectTo = '/dashboard';
    } else if (role === 'min_admin') {
      redirectTo = '/assist';
    } else {
      return res.status(403).json({ message: 'Access denied' });
    }

    setAuthCookie(res, token);
    res.json({ redirectTo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Validate token endpoint
router.get('/validate-token', async (req, res) => {
  try {
    const token = getTokenFromCookie(req);

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(403).json({ message: 'Invalid token' });
    }

    res.json({ role: decoded.role });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});




// Logout endpoint
router.post('/logout', async (req, res) => {
  try {
    clearAuthCookie(res);
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
