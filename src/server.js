const express = require("express");

const { addUser, getCurrentUser, userLeave, getRoomUsers, formatMessage } = require('./chat');

const app = express();
const socketIO = require("socket.io");
const http = require("http");

app.use(express.static("public"));

app.use(express.urlencoded({
    extended: true
}));

const nunjucks = require("nunjucks");
nunjucks.configure("src/views", {
    express: app,
    noCache: true
});

const routes = require("./routes/index");
app.use("/", routes);

app.use(function (req, res, next) {
    var err = new Error("Not Found");
    err.status = 404;
    next(err);
});

if (app.get("env") === "development") {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render("error", {
            message: err.message,
            error: err
        });
    });
}

var server = http.createServer(app);
var io = socketIO.listen(server);

io.on('connection', socket => {
    socket.on('create', ({ username, room }) => {
        if (username !== 'bot') {
            const user = addUser(socket.id, username, room);

            socket.join(user.room);
        
            socket.emit('message', formatMessage('bot', `Welcome to room ${user.room}!`));
        
            socket.broadcast
                .to(user.room)
                .emit('message', formatMessage('bot', `${user.username} has joined the chat`));
        
            io.to(user.room).emit('roomUsers', {
                users: getRoomUsers(user.room)
            });
        }
    });
    
    socket.on('chatMessage', msg => {
        const user = getCurrentUser(socket.id);

        io.to(user.room).emit('message', formatMessage(user.username, msg));
    });
    
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);

        if (user) {
            io.to(user.room).emit('message', formatMessage('bot', `${user.username} has left the chat`));

            io.to(user.room).emit('roomUsers', {
                users: getRoomUsers(user.room)
            });
        }
    });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, function () {
    console.log("Listening on http://localhost:" + PORT);
});