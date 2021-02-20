const socket = io();
const mode = 0; // Piano
window.addEventListener('beforeunload', () => {socket.disconnect();});

var keys = document.getElementsByClassName("key");
var semikeys = document.getElementsByClassName("semikey");

for (let key of keys) {
    key.ontouchstart = ev => { 
        socket.emit("md", {
            note: ev.target.id,
            mode: mode
        });
    };
    key.ontouchend = ev => {
        socket.emit("mu", {
            note: ev.target.id,
            mode: mode
        });
    };
}

for (let semikey of semikeys) {
    semikey.ontouchstart = ev => { 
        socket.emit("md", {
            note: ev.target.id,
            mode: mode
        });
    };
    semikey.ontouchend = ev => {
        socket.emit("mu", {
            note: ev.target.id,
            mode: mode
        });
    };
}
