const express = require('express');
const socket  = require('socket.io');
const bodyParser = require('body-parser');
const http = require('http');

const app = express();
var port = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get('/', (req, res) =>{
    res.render('index');
});

app.post('/room', (req, res) =>{
    roomname = req.body.roomname;
    username = req.body.username;
    res.redirect(`/room?username=${username}&roomname=${roomname}`);
});


app.get('/room', (req, res) => {
    res.render('room');
});

const server = http.createServer(app);
const io = socket(server);
require('./utils/socket')(io);

server.listen(port, () => {
    console.log(`app is successfully running on PORT: '${port}'`);
});