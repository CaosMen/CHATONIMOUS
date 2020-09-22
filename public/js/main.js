function valid () {
    var RoomInput = document.forms["CreateRoom"]["RoomName"].value;
    var UserInput = document.forms["CreateRoom"]["Username"].value;

    if (UserInput) {
        if (UserInput != 'bot') {
            if (!(RoomInput.length > 3)) { 
                document.getElementById("validation").innerHTML = "The Room name needs at least three characters!";
                return {result: false, room: RoomInput, username: UserInput};
            } else {
                document.getElementById("validation").innerHTML = "";
                
                return {result: true, room: RoomInput, username: UserInput};
            }
        } else {
            document.getElementById("validation").innerHTML = "Please enter a different Username!";
            return {result: false, room: RoomInput, username: UserInput};
        }
    } else {
        document.getElementById("validation").innerHTML = "Type a Username!";
        return {result: false, room: RoomInput, username: UserInput};
    }
}

function Call_CreateRoom() {
    var valid_check = valid();

    if (valid_check.result) {
        sessionStorage.setItem("Username", valid_check.username);

        window.location.href = '/room/' + valid_check.room;
    }

    return false;
}