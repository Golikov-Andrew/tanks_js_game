const DEBUG_MODE = false
let gamepad;

const btn_start_game = document.getElementById('btn_start_game')
btn_start_game.addEventListener('click',()=>{
    app.init()
    app.frame(1000 / 60)
    btn_start_game.setAttribute('disabled', 'disabled')
})

const app = new App(DEBUG_MODE)
const stage_1 = new Stage(app, 1400, 1400)

const team_1 = new Team(app, 'Humans', 'blue');

const player_1 = new Human(app, 'Player 1', '#0976ff')
const player_2 = new Bot(app, 'Player 2', '#00ff91', 2)

team_1.add_player(player_1)
team_1.add_player(player_2)

const tank_1 = new Tank(app, stage_1, 100, 500, 45)
const tank_2 = new Tank(app, stage_1, 100, 300, -45)

player_1.set_tank(tank_1)
player_2.set_tank(tank_2)

app.add_team(team_1)


const team_2 = new Team(app, 'Bots', 'red');

const bot_1 = new Bot(app, 'Bot 1', '#ff099d', 2)
const bot_2 = new Bot(app, 'Bot 2', '#ff09fb', 2)
const bot_3 = new Bot(app, 'Bot 3', '#ff0936', 2)
const bot_4 = new Bot(app, 'Bot 4', '#a509ff', 2)

team_2.add_player(bot_1)
team_2.add_player(bot_2)
team_2.add_player(bot_3)
team_2.add_player(bot_4)

const tank_3 = new Tank(app, stage_1, 300, 300, 135, false)
const tank_4 = new Tank(app, stage_1, 400, 400, 135, false)
const tank_5 = new Tank(app, stage_1, 500, 500, 135, false)
const tank_6 = new Tank(app, stage_1, 600, 600, 135, false)

bot_1.set_tank(tank_3)
bot_2.set_tank(tank_4)
bot_3.set_tank(tank_5)
bot_4.set_tank(tank_6)

app.add_team(team_2)

app.add_player(player_1)
player_2.current_view = 'tower'
app.add_player(player_2)

stage_1.stones = [
    new Stone(app, stage_1, 200, 200, 45),
    new Stone(app, stage_1, 300, 150, 0),
    new Stone(app, stage_1, 700, 550, 90),
    new Stone(app, stage_1, 200, 450, 90),
]
// const tank = new Tank(app, stage_1, 100, 100, 45, 'blue', true)
// const tank2 = new Tank(app, stage_1, 300, 300, 135, 'red', false)

app.set_stage(stage_1)


window.onkeydown = function (e) {
    let key = e.key || e.keyCode;
    // console.log(key)
    switch (key) {
        case "Shift":
            if (Date.now() - player_1.view_changed_at > 1000) {
                player_1.switch_view()
            }
            break;

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
    if (gamepad.index === 0) player_1.gamepad = gamepad
    else if (gamepad.index === 1) player_2.gamepad = gamepad
    // app.gamepad = gamepad
    console.log(gamepad)

});