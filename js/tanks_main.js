const DEBUG_MODE = false
let gamepad;

const btn_start_game = document.getElementById('btn_start_game')
btn_start_game.addEventListener('click',()=>{
    app.init()
    app.frame(1000 / 60)
    btn_start_game.setAttribute('disabled', 'disabled')
})

const STAGE_WIDTH = 1400
const STAGE_HEIGHT = 1400

const app = new App(DEBUG_MODE)
const stage_1 = new Stage(app, 1400, 1400)

const team_1 = new Team(app, 'Humans', '#0000ff');

const player_1 = new Human(app, 'Player 1', '#0976ff')
const player_2 = new Bot(app, 'Player 2', '#00ff91', 2)
const player_3 = new Bot(app, 'Player 3', '#09dc81', 2)
const player_4 = new Bot(app, 'Player 4', '#aaff00', 2)
const player_5 = new Bot(app, 'Player 5', '#00d9ff', 2)
// const player_2 = new Human(app, 'Player 2', '#00ff91')

team_1.add_player(player_1)
team_1.add_player(player_2)
team_1.add_player(player_3)
team_1.add_player(player_4)
team_1.add_player(player_5)

let stage_randomizer = new StageRandomizer()
let players_points = stage_randomizer.collect_random_points(0, STAGE_WIDTH, 0, STAGE_HEIGHT, 5, 60)
let bots_points = stage_randomizer.collect_random_points(0, STAGE_WIDTH, 0, STAGE_HEIGHT, 8, 60)
let stones_points = stage_randomizer.collect_random_points(0, STAGE_WIDTH, 0, STAGE_HEIGHT, 10, 80)
let bots_points_team_3 = stage_randomizer.collect_random_points(0, STAGE_WIDTH, 0, STAGE_HEIGHT, 8, 60)

player_1.set_tank(new Tank(app, stage_1, players_points[0].x, players_points[0].y, -90))
player_2.set_tank(new Tank(app, stage_1, players_points[1].x, players_points[1].y, -90))
player_3.set_tank(new Tank(app, stage_1, players_points[2].x, players_points[2].y, -90))
player_4.set_tank(new Tank(app, stage_1, players_points[3].x, players_points[3].y, -90))
player_5.set_tank(new Tank(app, stage_1, players_points[4].x, players_points[4].y, -90))

app.add_team(team_1)


const team_2 = new Team(app, 'Bots', '#00FF00');
const team_3 = new Team(app, 'Beatles', '#FF0000');


const bot_1 = new Bot(app, 'Bot 1', '#FFFF00', 2)
const bot_2 = new Bot(app, 'Bot 2', '#ff09fb', 2)
const bot_3 = new Bot(app, 'Bot 3', '#ff0936', 2)
const bot_4 = new Bot(app, 'Bot 4', '#a509ff', 2)
const bot_5 = new Bot(app, 'Bot 5', '#ff09c6', 2)
const bot_6 = new Bot(app, 'Bot 6', '#ff094b', 2)
const bot_7 = new Bot(app, 'Bot 7', '#7e006a', 2)
const bot_8 = new Bot(app, 'Bot 8', '#6c03a8', 2)

team_2.add_player(bot_1)
team_2.add_player(bot_2)
team_2.add_player(bot_3)
team_2.add_player(bot_4)
team_2.add_player(bot_5)
team_2.add_player(bot_6)
team_2.add_player(bot_7)
team_2.add_player(bot_8)

for (let i = 0, b; i < 8; i++) {
    b = new Bot(app, `Beatle ${i}`, '#000000', 2)
    team_3.add_player(b)
    b.set_tank(new Tank(app, stage_1, bots_points_team_3[i].x, bots_points_team_3[i].y, bots_points_team_3[i].a))
}


bot_1.set_tank(new Tank(app, stage_1, bots_points[0].x, bots_points[0].y, 135, false))
bot_2.set_tank(new Tank(app, stage_1, bots_points[1].x, bots_points[1].y, 135, false))
bot_3.set_tank(new Tank(app, stage_1, bots_points[2].x, bots_points[2].y, 135, false))
bot_4.set_tank(new Tank(app, stage_1, bots_points[3].x, bots_points[3].y, 135, false))
bot_5.set_tank(new Tank(app, stage_1, bots_points[4].x, bots_points[4].y, 135, false))
bot_6.set_tank(new Tank(app, stage_1, bots_points[5].x, bots_points[5].y, 135, false))
bot_7.set_tank(new Tank(app, stage_1, bots_points[6].x, bots_points[6].y, 135, false))
bot_8.set_tank(new Tank(app, stage_1, bots_points[7].x, bots_points[7].y, 135, false))

app.add_team(team_2)
player_1.current_view = 'tower'
app.add_player(player_1)
player_2.current_view = 'tower'
app.add_player(player_2)

app.add_team(team_3)

for (let i = 0; i < stones_points.length; i++) {
    stage_1.stones.push(new Stone(app, stage_1, stones_points[i].x, stones_points[i].y, stones_points[i].a))
}

// const tank = new Tank(app, stage_1, 100, 100, 45, 'blue', true)
// const tank2 = new Tank(app, stage_1, 300, 300, 135, 'red', false)

app.set_stage(stage_1)

let player_to_bind_keyboard = player_2


window.onkeydown = function (e) {
    let key = e.key || e.keyCode;
    // console.log(key)
    switch (key) {
        case "Shift":
            if (Date.now() - player_to_bind_keyboard.view_changed_at > 1000) {
                player_to_bind_keyboard.switch_view()
            }
            break;

        case " ":
            player_to_bind_keyboard.tank.fire()
            break;

        case "ArrowLeft":
        case 37:
            if (e.ctrlKey) {
                player_to_bind_keyboard.tank.children.tower.speed_rotate = deg_to_rad(-5);
            } else {
                player_to_bind_keyboard.tank.speed_rotate = deg_to_rad(-5);
            }
            break;

        case "ArrowUp":
        case 38:
            player_to_bind_keyboard.tank.speed = 1;
            break;

        case "ArrowRight":
        case 39:
            if (e.ctrlKey) {
                player_to_bind_keyboard.tank.children.tower.speed_rotate = deg_to_rad(5);
            } else {
                player_to_bind_keyboard.tank.speed_rotate = deg_to_rad(5);
            }
            break;

        case "ArrowDown":
        case 40:
            player_to_bind_keyboard.tank.speed = -1;
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
            player_to_bind_keyboard.tank.speed_rotate = 0;
            player_to_bind_keyboard.tank.children.tower.speed_rotate = 0;
            break;

        case "ArrowUp":
        case 38:
        case "ArrowDown":
        case 40:
            player_to_bind_keyboard.tank.speed = 0;
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