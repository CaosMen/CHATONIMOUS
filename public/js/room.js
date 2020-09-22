const socket = io();

const alert = async function(text_msg) {
    return { value: username } = await Swal.fire({
        title: text_msg ? text_msg : "Enter your Username",
        input: 'text',
        inputPlaceholder: text_msg ? text_msg : "Enter your Username",
        inputAttributes: {
            maxlength: 25,
            autocapitalize: 'off',
            autocorrect: 'off'
        }, 
        inputValidator: (value) => {
            if (!value) {
                return 'Type a Username!'
            } else if (value === 'bot') {
                return 'Please enter a different Username!'
            }
        }
    });
}

var inputMessage = document.getElementById("message");

inputMessage.addEventListener("keyup", function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();

        document.getElementById("button-send").click();
    }
});

function sendMessage() {
    let message = (inputMessage.value).trim();
    
    if (message) {
        socket.emit('chatMessage', message);

        inputMessage.value = '';
    }
}

function roomUsers(users) {
    var counter = document.getElementById("room-counter");
    
    counter.innerHTML = "This room has " + users.length + " users";
}

function roomMessage(message) {
    var chat = document.getElementById("chat");

    if (message.username === 'bot') {
        var message_ph = document.createElement("p");
        message_ph.classList.add("bot");
        message_ph.innerHTML = message.text;

        chat.append(message_ph);
    } else {
        let username = sessionStorage.getItem("Username");

        if (message.username === username) {
            var message_ph = document.createElement("p");
            message_ph.classList.add("me");
            message_ph.innerHTML = '<b>' + message.username + '</b><br>' + message.text + '<br>' + message.time;

            chat.append(message_ph);
        } else {
            var message_ph = document.createElement("p");
            message_ph.classList.add("others");
            message_ph.innerHTML = '<b>' + message.username + '</b><br>' + message.text + '<br>' + message.time;

            chat.append(message_ph);
        }
    }
}

function set_username() {
    alert()
        .then(username => {
            if (username.value) {
                sessionStorage.setItem("Username", username.value);
            }

            window.location.reload();
        })
        .catch(e => window.location.reload());
}

function goHome() {
    window.location = '/';   
}

function check_username() {
    let username = sessionStorage.getItem("Username");
    let room = document.location.href.split('/')[4];

    if (username) {
        if (username !== 'bot') {
            socket.emit('create', {username, room});

            socket.on('roomUsers', ({ users }) => {
                roomUsers(users);
            });

            socket.on('message', message => {
                roomMessage(message);

                var chat = document.getElementById("chat");

                chat.scrollTop = chat.scrollHeight;
            });
        } else {
            set_username("Enter another Username");
        }
    } else {
        set_username("Enter your Username");
    }
}

document.addEventListener('DOMContentLoaded', function() {
    check_username();
}, false);