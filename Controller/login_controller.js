//login_controller.js

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const users = []; 
const JWT_SECRET = 'your_JWT_secret_key';

const registerUser = async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  users.push({ username, password: hashedPassword });
  res.json({ success: true, message: 'User registered successfully' });
};

const loginUser = async (req, res) => {
  const { username, password } = req.body;

  const user = users.find((u) => u.username === username);
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid username or password',
    });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({
      success: false,
      message: 'Invalid username or password',
    });
  }

  const token = jwt.sign({ username: user.username }, JWT_SECRET, {
    expiresIn: '5h',
  });

  res.json({
    success: true,
    message: 'Authentication successful!',
    token: token,
  });
};

module.exports = { registerUser, loginUser };
