const express = require('express');
const http = require('http');
const path = require('path');
const {Server} = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

let waitArray = [];
let playingArray = [];

io.on('connection', (socket) => {
    socket.on('find', (e) => {
        if(e.name != null || e.name != '') {
            waitArray.push(e.name);

            if(waitArray.length >= 2) {
                console.log(waitArray);
                let p1obj = {
                    p1name: waitArray[0],
                    p1value: 'X',
                    p1move: ''
                }
                let p2obj = {
                    p2name: waitArray[1],
                    p2value: 'O',
                    p2move: ''
                }
                let mainObj = {
                    p1: p1obj,
                    p2: p2obj,
                    sum: 1
                }
                playingArray.push(mainObj);
                waitArray.splice(0, 2);

                io.emit('find', {allPlayers: playingArray});
            }
        }
    })

    socket.on('playing', (e)=> {
        if(e.value === 'X') {
            let objToChange = playingArray.find(obj => obj.p1.p1name);
            objToChange.p1.p1move = e.id;
            objToChange.sum++;
        } else if(e.value === 'O') {
            let objToChange = playingArray.find(obj => obj.p2.p2name);
            objToChange.p2.p2move = e.id;
            objToChange.sum++;
        }
        io.emit('playing', {allPlayers: playingArray});
    })

    socket.on('gameOver', (e) => {
        playingArray = playingArray.filter(obj => obj.p1.p1name !== e.name && obj.p2.p2name !== e.name);
    })
})

app.use(express.static(path.resolve('')))
app.get('/', (req, res) => {
    res.sendFile('index.html');
});

server.listen(3000, () => {
    console.log(`server was started in port ${3000}`);
})