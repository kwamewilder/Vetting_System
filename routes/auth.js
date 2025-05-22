// routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('../db');

const router = express.Router();

// Register route (hash password)
router.post('/register', async (req, res) => {
  const { username, password, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING *',
      [username, hashedPassword, role || 'data_entry']
    );
    res.status(201).json({ user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error registering user');
  }
});

// Show the registration form
router.get('/register', (req, res) => {
  res.render('register'); // assumes you have views/register.ejs
});


router.get('/login', (req, res) => {
  res.render('login');  // This will render views/login.ejs
});


// Login route (verify password)
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    const user = result.rows[0];
    if (!user) return res.status(401).send('User not found');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).send('Invalid password');

    req.session.user = { id: user.id, username: user.username, role: user.role };
    res.send('Logged in successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Login error');
  }
});

// Logout
router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.send('Logged out');
  });
});

module.exports = router;
