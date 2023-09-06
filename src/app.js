const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const exphbs = require('express-handlebars');
const fs = require('fs/promises');

const productsRouter = require('./src/routers/products');
const cartsRouter = require('./src/routers/carts');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const PORT = 8080;

app.use(express.json());

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.get('/home', async (req, res) => {
    try {
        const productsData = await fs.readFile('productos.json', 'utf-8');
        const products = JSON.parse(productsData);
        res.render('home', { layout: false, products });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
});

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);


io.on('connection', (socket) => {
    console.log('Cliente conectado');

    
    socket.on('chat message', (msg) => {
        
        io.emit('chat message', msg);
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});


server.listen(PORT, () => {
    console.log(`Servidor corriendo en ${PORT}`);
});