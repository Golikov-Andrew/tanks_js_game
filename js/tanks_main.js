const DEBUG_MODE = false
let gamepad;

const app = new App(DEBUG_MODE)
const stage_1 = new Stage(app, 700, 700)


const player_1 = new Human(app, 'Player 1', new Tank(app, stage_1, 100, 100, 45, 'blue', true))
const player_2 = new Human(app, 'Player 2', new Tank(app, stage_1, 100, 500, -45, 'blue', true))

app.add_player(player_1)
app.add_player(player_2)

stage_1.stones = [
    new Stone(app, stage_1, 200, 200, 45),
    new Stone(app, stage_1, 300, 150, 0),
    new Stone(app, stage_1, 700, 550, 90),
    new Stone(app, stage_1, 200, 450, 90),
]
// const tank = new Tank(app, stage_1, 100, 100, 45, 'blue', true)
// const tank2 = new Tank(app, stage_1, 300, 300, 135, 'red', false)
stage_1.add_tanks([
    player_1.tank,
    player_2.tank,
    new Tank(app, stage_1, 300, 300, 135, 'red', false),
    new Tank(app, stage_1, 400, 400, 135, 'red', false),
    new Tank(app, stage_1, 500, 500, 135, 'red', false),
    new Tank(app, stage_1, 600, 600, 135, 'red', false),


])
app.set_stage(stage_1)
app.init()
app.frame(1000 / 60)

window.onkeydown = function (e) {
    let key = e.key || e.keyCode;
    // console.log(key)
    switch (key) {
        case " ":
            player_1.tank.fire()
            break;

        case "ArrowLeft":
        case 37:
            if (e.ctrlKey) {
                player_1.tank.children.tower.speed_rotate = deg_to_rad(-5);
            } else {
                player_1.tank.speed_rotate = deg_to_rad(-5);
            }
            break;

        case "ArrowUp":
        case 38:
            player_1.tank.speed = 1;
            break;

        case "ArrowRight":
        case 39:
            if (e.ctrlKey) {
                player_1.tank.children.tower.speed_rotate = deg_to_rad(5);
            } else {
                player_1.tank.speed_rotate = deg_to_rad(5);
            }
            break;

        case "ArrowDown":
        case 40:
            player_1.tank.speed = -1;
            break;
    }
}

window.onkeyup = function (e) {
    let key = e.key || e.keyCode;
    // console.log(key)
    switch (key) {
        case "ArrowLeft":
        case 37:
        case "ArrowRight":
        case 39:
            player_1.tank.speed_rotate = 0;
            player_1.tank.children.tower.speed_rotate = 0;
            break;

        case "ArrowUp":
        case 38:
        case "ArrowDown":
        case 40:
            player_1.tank.speed = 0;
            break;
    }
}

window.addEventListener("gamepaddisconnected", (e) => {
    console.log("Waiting for gamepad.")

    // cancelAnimationFrame(start);
});


window.addEventListener("gamepadconnected", (e) => {
    gamepad = navigator.getGamepads()[e.gamepad.index];
    console.log(`Gamepad connected at index ${gamepad.index}: ${gamepad.id}. It has ${gamepad.buttons.length} buttons and ${gamepad.axes.length} axes.`)
    console.log(gamepad.id)
    if(gamepad.index === 0) player_1.gamepad = gamepad
    else if(gamepad.index === 1) player_2.gamepad = gamepad
    // app.gamepad = gamepad
    console.log(gamepad)

});