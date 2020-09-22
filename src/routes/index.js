var express = require('express');
const axios = require('axios');

var router = express.Router();

router.get('/', (req, res) => {
    res.render('index.html');
});

router.get('/room/:roomid', (req, res) => {
    res.render('room.html', { room: req.params.roomid });
});

module.exports = router;