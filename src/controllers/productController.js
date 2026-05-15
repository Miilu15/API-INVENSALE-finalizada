const fs = require('fs');
const path = require('path');

const PRODUCTS_FILE = path.join(__dirname, '../database/products.json');

const getProducts = (req, res) => {

    const products = JSON.parse(fs.readFileSync(PRODUCTS_FILE));

    res.json(products);
};

const createProduct = (req, res) => {

    const { name, price, stock } = req.body;

    if (!name || name.trim() === '') {
        return res.status(400).json({
            message: 'El nombre es obligatorio'
        });
    }

    if (price <= 0) {
        return res.status(400).json({
            message: 'Precio inválido'
        });
    }

    if (stock < 0) {
        return res.status(400).json({
            message: 'Stock inválido'
        });
    }

    const products = JSON.parse(fs.readFileSync(PRODUCTS_FILE));

    const newProduct = {
        id: Date.now(),
        name,
        price,
        stock
    };

    products.push(newProduct);

    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));

    res.status(201).json({
        message: 'Producto creado',
        product: newProduct
    });
};

module.exports = {
    getProducts,
    createProduct
};