const pool = require('../db_config');

// CREATE a new product
const createProduct = async (req, res) => {
  const { productname, url, price } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO products (productname, url, price) VALUES ($1, $2, $3) RETURNING *',
      [productname, url, price]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// READ all products
const getProducts = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const totalProductsResult = await pool.query('SELECT COUNT(*) FROM products');
    const totalProducts = totalProductsResult.rows[0].count;

    const result = await pool.query(
      'SELECT * FROM products ORDER BY id ASC LIMIT $1 OFFSET $2',
      [limit, offset]
    );

    res.status(200).json({
      products: result.rows,         
      total: parseInt(totalProducts), 
      page: parseInt(page),           
      limit: parseInt(limit),         
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


// READ a single product by ID
const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// UPDATE a product by ID
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { productname, url, price } = req.body;

  // Validate input data
  if (!productname || !url || !price) {
    return res.status(400).json({ error: 'Product name, URL, and price are required.' });
  }

  try {
    const result = await pool.query(
      'UPDATE products SET productname = $1, url = $2, price = $3 WHERE id = $4 RETURNING *',
      [productname, url, price, id]
    );

    // Check if the product was found and updated
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Return the updated product
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


// DELETE a product by ID
const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);
    if (result.rowCount === 0) { 
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
