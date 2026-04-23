const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const colors = require('colors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

// Load env vars
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Load models
const Admin = require('../models/Admin');
const Product = require('../models/Product');

// Connect to DB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Add logging for database connection
mongoose.connection.on('connected', () => {
  console.log('MongoDB Connected successfully'.green.inverse);
});

mongoose.connection.on('error', (err) => {
  console.error(`MongoDB connection error: ${err.message}`.red.inverse);
});

// Read JSON files
const admins = JSON.parse(
  fs.readFileSync(`./_data/admins.json`, 'utf-8')
);

const products = JSON.parse(
  fs.readFileSync(`./_data/products.json`, 'utf-8')
);

// Hash passwords before importing
const hashPasswords = async (admins) => {
  for (const admin of admins) {
    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(admin.password, salt);
  }
};

// Import into DB
const importData = async () => {
  try {
    // Check if admin already exists
    const adminExists = await Admin.findOne({ email: 'admin@royalcellspot.com' });
    
    if (!adminExists) {
      console.log('Hashing passwords and preparing admin data...'.yellow);
      await hashPasswords(admins);
      console.log('Inserting admin data into the database...'.yellow);
      await Admin.create(admins);
      console.log('Admin data inserted successfully'.green);
    } else {
      console.log('Admin already exists, skipping admin insertion'.yellow);
    }
    
    // Clear existing products and insert new ones
    console.log('Clearing existing products...'.yellow);
    await Product.deleteMany();
    
    console.log('Inserting product data into the database...'.yellow);
    await Product.create(products);
    console.log('Product data inserted successfully'.green);
    
    console.log('Data Imported successfully'.green.inverse);
    process.exit(0);
  } catch (err) {
    console.error(`Error importing data: ${err.message}`.red.inverse);
    console.error(err);
    process.exit(1);
  }
};

// Delete data
const deleteData = async () => {
  try {
    await Admin.deleteMany();
    await Product.deleteMany();
    console.log('Data Destroyed...'.red.inverse);
    process.exit(0);
  } catch (err) {
    console.error(`Error deleting data: ${err.message}`.red.inverse);
    console.error(err);
    process.exit(1);
  }
};

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
}