const express = require('express');
const http = require('http');
const path = require('path');
const {Server} = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.resolve('')))
app.get('/', (req, res) => {
    res.sendFile('index.html');
});

server.listen(3000, () => {
    console.log(`server was started in port ${3000}`);
})