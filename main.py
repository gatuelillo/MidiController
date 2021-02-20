import os

import flask
import flask_socketio
import mido

app = flask.Flask("m2")
app.config["SECRET_KEY"] = os.urandom(16)
socketio = flask_socketio.SocketIO(app)

ports = mido.get_output_names()

"""
    Port selection, to run the program a MIDI Port must be configurated in loopMIDI.
"""
print("Select port: ")
for _ in ports:
    print(" - {}".format(_))
option = None
while not option:
    option = input("Port: ")
    if not option in ports:
        option = None

outport = mido.open_output(option)
"""
    End of port selection
"""

note_on = lambda x, y=0: mido.Message('note_on', note=60 + x, channel = y)
note_off = lambda x, y=0: mido.Message('note_off', note=60 + x, channel = y)

"""
    Resources
"""
@app.route("/")
def index():
    return flask.render_template("index.html")

@app.route("/piano")
def piano():
    return flask.render_template("piano.html")

@app.route("/index.js")
def indexjs():
    return flask.send_from_directory("static", "index.js")

@app.route("/piano.js")
def pianojs():
    return flask.send_from_directory("static", "piano.js")

@app.route("/manifest.json")
def manifestjson():
    return flask.send_from_directory("static", "manifest.json")

"""
    Commands
"""
@socketio.on("md")
def fingerDown(data):
    if data["mode"]:
        msg = note_on(0, int(data["note"]))
    else:
        msg = note_on(int(data["note"]))
    
    outport.send(msg)
    return ""

@socketio.on("mu")
def fingerUp(data):
    if data["mode"]:
        msg = note_off(0, int(data["note"]))
    else:
        msg = note_off(int(data["note"]))

    outport.send(msg)
    return ""

if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", port=80, debug=False)
