const express = require('express');
const router = express.Router();
const fs = require('fs/promises');

router.post('/', async (req, res) => {
    try {
        const cartsData = await fs.readFile('carrito.json', 'utf-8');
        const carts = JSON.parse(cartsData);

        const newCart = {
            id: carts.length + 1,
            products: []
        };

        carts.push(newCart);

        await fs.writeFile('carrito.json', JSON.stringify(carts, null, 2), 'utf-8');
        res.send({ status: "success", message: "Cart created successfully", payload: newCart });
    } catch (error) {
        res.status(500).send({ status: "error", error: "Internal server error" });
    }
});

router.get('/:cid', async (req, res) => {
    try {
        const cartId = parseInt(req.params.cid);
        const cartsData = await fs.readFile('carrito.json', 'utf-8');
        const carts = JSON.parse(cartsData);
        const cart = carts.find(c => c.id === cartId);

        if (cart) {
            res.send({ status: "success", payload: cart.products });
        } else {
            res.status(404).send({ status: "error", error: "Cart not found" });
        }
    } catch (error) {
        res.status(500).send({ status: "error", error: "Internal server error" });
    }
});

router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const cartId = parseInt(req.params.cid);
        const productId = parseInt(req.params.pid);
        const quantity = req.body.quantity;

        const cartsData = await fs.readFile('carrito.json', 'utf-8');
        const carts = JSON.parse(cartsData);
        const cartIndex = carts.findIndex(c => c.id === cartId);

        if (cartIndex !== -1) {
            const cart = carts[cartIndex];
            const existingProduct = cart.products.find(p => p.product === productId);

            if (existingProduct) {
                existingProduct.quantity += quantity;
            } else {
                cart.products.push({ product: productId, quantity });
            }

            await fs.writeFile('carrito.json', JSON.stringify(carts, null, 2), 'utf-8');
            res.send({ status: "success", message: "Product added to cart" });
        } else {
            res.status(404).send({ status: "error", error: "Cart not found" });
        }
    } catch (error) {
        res.status(500).send({ status: "error", error: "Internal server error" });
    }
});

module.exports = router;