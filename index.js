const express = require('express');
const cors = require('cors'); 
const app = express();
const apiRoutes = require('./Routes/apiRoutes'); 

app.use(express.json());

app.use(cors({
  origin: 'http://localhost:3000', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  allowedHeaders: ['Content-Type', 'Authorization'] 
}));

app.use('/api', apiRoutes);

app.use('*', (req, res) => {
  res.status(404).send('Route not found');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong on the server', error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
