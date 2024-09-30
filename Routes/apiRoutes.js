const express = require('express');
const { registerUser, loginUser } = require('../Controller/login_controller');
const { authenticateToken } = require('../Middleware/authenticated_middleware');
const { getProtectedContent } = require('../Controller/protected_controller');
const { 
  createProduct, 
  getProducts, 
  getProductById, 
  updateProduct, 
  deleteProduct 
} = require('../Controller/productController');
const { 
  addUser,  
  getUsers,        
  getUserById, 
  updateUser, 
  deleteUser 
} = require('../Controller/userController'); 

const apiRouter = express.Router();

// User registration and login routes
apiRouter.post('/register', registerUser); 
apiRouter.post('/login', loginUser);       

// Protected content route
apiRouter.get('/protected', authenticateToken, getProtectedContent); 

// User routes (protected)
apiRouter.route('/users')
  .get(authenticateToken, getUsers) 
  .post(authenticateToken, addUser); 

apiRouter.route('/users/:id')
  .get(authenticateToken, getUserById)       
  .put(authenticateToken, updateUser)        
  .delete(authenticateToken, deleteUser);    

// Product routes (protected)
apiRouter.route('/products')
  .post(authenticateToken, createProduct)    
  .get(authenticateToken, getProducts);       

apiRouter.route('/products/:id')
  .get(authenticateToken, getProductById)    
  .put(authenticateToken, updateProduct)    
  .delete(authenticateToken, deleteProduct); 

module.exports = apiRouter;
