const socket = io();
var mode = true; // Defaults to launchpad mode
window.addEventListener('beforeunload', () => {socket.disconnect();});

socket.on('connect', () => {
    console.log("connected.");
});

socket.on('disconnect', () => {
    console.log("disconnect.");
});

var buttons = document.getElementsByClassName('btn');
console.log(`Buttons: ${buttons.length}`);

for (let i = 0; i < buttons.length; i++) {
    let button = buttons[i];
    button.id = i.toString();
    button.ontouchstart = ev => {
        socket.emit("md", {
            note: ev.target.id,
            mode: mode
        });
    };
    button.ontouchend = ev => {
        socket.emit("mu", {
            note: ev.target.id,
            mode: mode
        });
    };
}

var cmButton = document.getElementById("cm");
cmButton.onclick = ev => {
    mode = !mode;
    showMode();
};

var pianoButton = document.getElementById("piano");
pianoButton.onclick = ev => {
    window.location.assign("/piano");
};

function showMode() {
    let modeDiv = document.getElementById("currentMode");
    modeDiv.textContent = "Mode: " + (mode ? "Launchpad" : "Piano");
}
showMode();