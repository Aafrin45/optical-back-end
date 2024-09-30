const bcrypt = require('bcrypt');
const pool = require('../db_config');

// Create a new user
const addUser = async (req, res) => {
  const { firstname, lastname, email, password } = req.body;

  if (!firstname || !lastname || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(409).json({ error: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      'INSERT INTO users (firstname, lastname, email, password) VALUES ($1, $2, $3, $4) RETURNING *',
      [firstname, lastname, email, hashedPassword]
    );

    const newUser = result.rows[0];
    delete newUser.password;
    
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error adding user:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all users
const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query; 
    const offset = (page - 1) * limit; 

    const totalUsersResult = await pool.query('SELECT COUNT(*) FROM users');
    const totalUsers = totalUsersResult.rows[0].count;

    const result = await pool.query(
      'SELECT * FROM users ORDER BY id ASC LIMIT $1 OFFSET $2',
      [limit, offset]
    );

    res.status(200).json({
      users: result.rows,          
      total: parseInt(totalUsers), 
      page: parseInt(page),        
      limit: parseInt(limit),      
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


// Get user by ID
const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('SELECT id, firstname, lastname, email FROM users WHERE id = $1', [id]);

    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update user
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { firstname, lastname, email, password } = req.body;

  try {
    let hashedPassword;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const result = await pool.query(
      `UPDATE users 
       SET firstname = $1, lastname = $2, email = $3, password = COALESCE($4, password)
       WHERE id = $5
       RETURNING id, firstname, lastname, email`,
      [firstname, lastname, email, hashedPassword, id]
    );

    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error updating user:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length > 0) {
      res.status(200).json({ message: 'User deleted successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error deleting user:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  addUser,
  getUsers, 
  getUserById,
  updateUser,
  deleteUser,
};
