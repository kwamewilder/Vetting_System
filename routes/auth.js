const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('../db');

const router = express.Router();

// Register route
router.post('/register', async (req, res) => {
  const { username, password, role, firstName, lastName, phoneNumber, email } = req.body;

  console.log("Received form data:", req.body);

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users 
        (username, password, role, first_name, last_name, phone_number, email) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [username, hashedPassword, role || 'data_entry', firstName, lastName, phoneNumber, email]
    );

    req.session.user = {
      id: result.rows[0].id,
      username: result.rows[0].username,
      role: result.rows[0].role,
      firstName: result.rows[0].first_name
    };
console.log('Received form data:', req.body);

    console.log('✅ Registration successful. Redirecting to dashboard...');
    res.redirect('/dashboard');
  } catch (err) {
    console.error('❌ Registration error:', err.message);
    res.status(500).render('login', { error: 'Registration failed', shake: true });
  }
});


// Show login/register page (combined form)
router.get('/register', (req, res) => {
  res.render('login');
});

router.get('/login', (req, res) => {
  res.render('login');
});

// Login route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).render('login', {
        error: 'Invalid username or password',
        shake: true,
        username
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).render('login', {
        error: 'Invalid username or password',
        shake: true,
        username
      });
    }

    req.session.user = {
      id: user.id,
      username: user.username,
      role: user.role,
      firstName: user.first_name
    };

    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.status(500).render('login', {
      error: 'Login error. Please try again.',
      shake: true,
      username
    });
  }
});

// Logout
router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.send('Logged out');
  });
});

module.exports = router;
