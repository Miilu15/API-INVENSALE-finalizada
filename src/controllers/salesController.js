const fs = require('fs');
const path = require('path');

const SALES_FILE = path.join(__dirname, '../database/sales.json');

const getSales = (req, res) => {

    const sales = JSON.parse(fs.readFileSync(SALES_FILE));

    res.json(sales);
};

const createSale = (req, res) => {

    const { productId, quantity } = req.body;

    if (!productId || quantity <= 0) {
        return res.status(400).json({
            message: 'Datos inválidos'
        });
    }

    const sales = JSON.parse(fs.readFileSync(SALES_FILE));

    const newSale = {
        id: Date.now(),
        productId,
        quantity
    };

    sales.push(newSale);

    fs.writeFileSync(SALES_FILE, JSON.stringify(sales, null, 2));

    res.status(201).json({
        message: 'Venta registrada',
        sale: newSale
    });
};

module.exports = {
    getSales,
    createSale
};