               ctx.strokeStyle = "gray";
                ctx.lineWidth = 5;
                ctx.moveTo(player.x, player.y);
                ctx.lineTo(planets.moon.x, planets.moon.y);
                ctx.stroke();

                ctx.beginPath();
                ctx.strokeStyle = "limegreen";
                ctx.lineWidth = 5;
                ctx.moveTo(player.x, player.y);
                ctx.lineTo(planets.earth.x, planets.earth.y)
                ctx.stroke();

                for(var key of Object.keys(players)) {
                        ctx.save();
                        ctx.translate(players[key].x, players[key].y);

                        ctx.textAlign = "center";
                        ctx.font = '30px Segoe UI';
                        ctx.fillStyle = "white";
                        ctx.fillText(usernames[key], 0, -35);

                        ctx.rotate(players[key].rotation);
                        ctx.drawImage(hearty, -25, -25, 50, 50);
                        ctx.restore();
                }

                for(let i = 0; i < modules.length; i++) {
                        ctx.save();
                        ctx.translate(modules[i].x, modules[i].y)
                        ctx.rotate(modules[i].rotation);
                        ctx.drawImage(cargo, -25, -25, 50, 50)
                        ctx.restore();
                }

                socket.emit("input", keys);
        }, 1000/60);
}

draw();

document.onkeydown = (e) => {
        if(document.activeElement != document.getElementById('msg')) {
                keys[e.key] = true
        }
};
document.onkeyup = (e) => {
        keys[e.key] = false;
};
