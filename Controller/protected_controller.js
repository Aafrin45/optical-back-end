// Controller/protected_controller.js

const getProtectedContent = (req, res) => {
    res.json({ success: true, message: `Hello, ${req.body.username}!` });
  };
  
  module.exports = {getProtectedContent};