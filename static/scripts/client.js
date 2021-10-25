var E = document.getElementById;
var C = document.getElementsByClassName;
var D = document;

function getParam(name) {
    name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
    var results = new RegExp("[\\?&]"+name+"=([^&#]*)").exec(window.location.href);
    if (!results) return "";
    return decodeURIComponent(results[1].replace(/\+/g, " "));
}

var canvas = E("canvas");
var ctx = canvas.getContext("2d");

var version = "beta-1.0.0"

console.log(`%cWelcome to StarKingdoms! Version: ${version}`, "color:blue");

var username = getParam("username");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
window.onresize = function () { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }

if (username == undefined || username == "" || username == " ") { username = "Unnamed"; }

function setServerMsg(msg) { E("content").innerHTML = msg; }
setServerMsg("Connecting...");

// Socket connection here

var players = {};
var player = { x: 0, y:0, rotation: 90, velX: 0, velY: 0 };
const SCALE = 30;
var keys = {};
var usernames = {};
var planets = {};
var modules = [];
var chat = E("chat");
var earth = new Image; earth.src = "static/img/earth.png";
var moon = new Image; moon.src = "static/img/moon.png";
var hearty = new Image; hearty.src = "static/img/hearty.png";
var cargo = new Image; cargo.src = "static/img/cargo.png";
var xPos = 0;
var yPos = 0;
var vel = 0;

var canvasStr = '0px 0px';
var newXPos = 0;
var newYPos = 0;
var newVel = 0;
var newCanvasStr = '0px 0px';

var rewritePos = false;
var rewriteVel = false;
var rewriteCanvasStr = false;

var position = E("position");
var velocity = E("velocity");

function recalculatePositioning() {
    rewritePos = false;
    rewriteVel = false;
    rewriteCanvasStr = false;
    var newXPos = Math.round(player.x / 50);
    var newYPos = Math.round(player.y / 50);
    var newVel = Math.round(Math.sqrt(player.velX * player.velX + player.velY * player.velY));
    var newCanvasStr = `${Math.trunc(-player.x / 10)}px ${Math.trunc(-player.y / 10)}px`;
    if (newXPos != xPos) { rewritePos = true; xPos = newXPos; }
    if (newYPos != yPos) { rewritePos = true; yPos = newYPos; }
    if (newVel != vel) { rewriteVel = true; vel = newVel; }
    if (rewritePos) { position.innerHTML = `Position: ${xPos}, ${yPos}`; }
    if (rewriteVel) { velocity.innerHTML = `Vel: ${vel}`; }
    canvas.style.backgroundPosition = newCanvasStr;
}

function chatMsg(value) {
    // Send socket msg
    console.log(`%cSent chat message to server: ${value}`, "color:green");
}
function mkInlineImg(src) { var img = new Image().src = src; image.style = `display: inline-block; width: 250px; height: auto; vertical-align: top; border: 3px solid #888; border-radius: 5px;`; return img; }
function checkForImgUrl(url) { return(url.match(/\.(jpeg|jpg|gif|png)$/) != null); }
function clearTimeout() { var id = window.setTimeout(function () {}, 0); while (id--) { window.clearTimeout(id); } }
function banMsg(message) { setServerMsg(`Connection refused: You have been banned from StarKingdoms. Reason: ${message}`); clearTimeout(); }

function clientPosUpdate(msg, selfClient, uInfo) { players = msg; player = selfClient; usernames = uInfo; }
function planetPosUpdate(planetInfo) { planets = planetInfo; }
function modulePosUpdate(moduleInfo) { modules = moduleInfo; }

function onChatMessage(text, uname) { if ( checkForImgUrl(text) ) {
    var img = mkInlineImg(text); chat.innerHTML += `<b>${uname}</b>`; chat.appendChild(img);
} else { chat.innerHTML += marked(`**${username}**: ${text}`); chat.scrollTop = chat.scrollHeight; } console.log(`%cRecieved chat message from ${uname}: ${text}`, "color:green"); }

function onReady() { clearTimeout(failConn); clearTimeout(waitConn); }

function draw() {
    let intervalId = setInterval(() => {
	recalculatePositioning();
	ctx.setTransform(1, 0, 0, 1, 0, 0);
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	var camX = -player.x + canvas.width / 2;
	var camY = -player.y + canvas.height / 2;
	ctx.translate(camX, camY);

	if (planets.earth == null) { return; }

	ctx.drawImage(earth, -1250 + planets.earth.x, -1250 + planets.earth.y, 2500, 2500);
	ctx.drawImage(moon, -300 + planets.moon.x, -300 + planets.moon.y, 600, 600);

	ctx.beginPath();
	cgx.strokeStyle = "gray";
	ctx.lineWidth = 5;
	ctx.moveTo(player.x, player.y);
	ctx.lineTo(planets.moon.x, planets.moon.y);
	ctx.stroke();

	ctx.beginPath();
	ctx.strokeStyle = "limegreen";
	ctx.lineWidth = 5;
	ctx.moveTo(player.x, player.y);
	ctx.lineTo(planets.earth.x, planets.earth.y);
	ctx.stroke();

	for (var key of Object.keys(players)) {
	    ctx.save();
	    ctx.translate(players[key].x, players[key].y);

	    ctx.textAlign = "center";
	    ctx.font = "30px Segoe UI";
	    ctx.fillStyle = "white";
	    ctx.fillText(usernames[key], 0, -35);

	    ctx.rotate(players[key].rotation);
	    ctx.drawImage(hearty, -25, -25, 50, 50);
	    ctx.restore();
	}

	for (let i = 0; i < modules.length; i++) {
	    ctx.save();
	    ctx.translate(modules[i].x, modules[i].y);
	    ctx.rotate(modules[i].rotation);
	    ctx.drawImage(cargo, -25, -25, 50, 50);
	    ctx.restore();
	}

	// emit input
    }, 1000/60);
}

draw();

D.onkeydown = (e) => { if (D.activeElement != E("msg")) { keys[e.key] = true; }};
D.onkeyup = (e) => { keys[e.key] = false; };
