const express = require('express');
const router = express.Router();
const fs = require('fs/promises');

router.get('/', async (req, res) => {
    try {
        const productsData = await fs.readFile('productos.json', 'utf-8');
        const products = JSON.parse(productsData);
        res.send({ status: "success", payload: products });
    } catch (error) {
        res.status(500).send({ status: "error", error: "Internal server error" });
    }
});

router.get('/:pid', async (req, res) => {
    try {
        const productsData = await fs.readFile('productos.json', 'utf-8');
        const products = JSON.parse(productsData);
        const productId = parseInt(req.params.pid);
        const product = products.find(p => p.id === productId);
        if (product) {
            res.send({ status: "success", payload: product });
        } else {
            res.status(404).send({ status: "error", error: "Product not found" });
        }
    } catch (error) {
        res.status(500).send({ status: "error", error: "Internal server error" });
    }
});

router.post('/', async (req, res) => {
    try {
        const { title, description, code, price, stock, category, thumbnails } = req.body;

        const productsData = await fs.readFile('productos.json', 'utf-8');
        const products = JSON.parse(productsData);

        const newProduct = {
            id: products.length + 1,
            title,
            description,
            code,
            price,
            status: true,
            stock,
            category,
            thumbnails
        };

        products.push(newProduct);

        await fs.writeFile('productos.json', JSON.stringify(products, null, 2), 'utf-8');
        res.send({ status: "success", message: "Product added successfully", payload: newProduct });
    } catch (error) {
        res.status(500).send({ status: "error", error: "Internal server error" });
    }
});

router.put('/:pid', async (req, res) => {
    try {
        const productId = parseInt(req.params.pid);
        const updatedFields = req.body;

        const productsData = await fs.readFile('productos.json', 'utf-8');
        const products = JSON.parse(productsData);

        const productIndex = products.findIndex(p => p.id === productId);

        if (productIndex !== -1) {
            products[productIndex] = { ...products[productIndex], ...updatedFields };
            await fs.writeFile('productos.json', JSON.stringify(products, null, 2), 'utf-8');
            res.send({ status: "success", message: "Product updated successfully" });
        } else {
            res.status(404).send({ status: "error", error: "Product not found" });
        }
    } catch (error) {
        res.status(500).send({ status: "error", error: "Internal server error" });
    }
});
 
router.delete('/:pid', async (req, res) => {
    try {
        const productId = parseInt(req.params.pid);

        const productsData = await fs.readFile('productos.json', 'utf-8');
        const products = JSON.parse(productsData);

        const updatedProducts = products.filter(p => p.id !== productId);

        if (products.length !== updatedProducts.length) {
            await fs.writeFile('productos.json', JSON.stringify(updatedProducts, null, 2), 'utf-8');
            res.send({ status: "success", message: "Product deleted successfully" });
        } else {
            res.status(404).send({ status: "error", error: "Product not found" });
        }
    } catch (error) {
        res.status(500).send({ status: "error", error: "Internal server error" });
    }
});

module.exports = router;
