const DEBUG_MODE = true
const MODELING_MODE = true
let gamepad;

const STAGE_WIDTH = 600
const STAGE_HEIGHT = 600

const app = new AppModeling(DEBUG_MODE, MODELING_MODE)
const stage_1 = new Stage(app, STAGE_WIDTH, STAGE_HEIGHT)

const team_1 = new Team(app, 'Humans', '#0000ff');
const team_2 = new Team(app, 'Bots', '#ff0000');

const player_1 = new HumanModeling(app, 'Player 1', '#0976ff')
const player_2 = new Bot(app, 'Bot 1', '#0976ff', 1)

team_1.add_player(player_1)
team_2.add_player(player_2)

// const controlled_object = new Helicopter(app, stage_1, 100,300, 0)
const controlled_object = new Tank(app, stage_1, 100,300, 0)
const bot_tank = new Tank(app, stage_1, 300,200, 0)
player_1.set_controlled_object(controlled_object)
player_2.set_controlled_object(bot_tank)
player_2.set_tank(bot_tank)

app.add_team(team_1)
app.add_team(team_2)

// player_1.current_view = 'tower'
app.add_player(player_1)

app.set_stage(stage_1)

let player_to_bind_keyboard = player_1
app.init(controlled_object)
// setTimeout(()=>{
    app.frame(1000 / 60)
// }, 1000)


window.onkeydown = function (e) {
    let key = e.key || e.keyCode;
    switch (key) {
        case "Shift":
            if (Date.now() - player_to_bind_keyboard.view_changed_at > 1000) {
                player_to_bind_keyboard.switch_view()
            }
            break;

        case " ":
            player_to_bind_keyboard.controlled_object.is_fire = true
            break;

        case "w":
            player_to_bind_keyboard.controlled_object.gun.firing_range += 2
            break;
        case "s":
            player_to_bind_keyboard.controlled_object.gun.firing_range -= 2
            break;

        case "ArrowLeft":
        case 37:
            if (e.ctrlKey) {
                // player_to_bind_keyboard.controlled_object.children.tower.speed_rotate = deg_to_rad(-5);
            } else {
                player_to_bind_keyboard.controlled_object.speed_rotate = deg_to_rad(-5);
            }
            break;

        case "ArrowUp":
        case 38:
            player_to_bind_keyboard.controlled_object.speed = 1;
            break;

        case "ArrowRight":
        case 39:
            if (e.ctrlKey) {
                // player_to_bind_keyboard.controlled_object.children.tower.speed_rotate = deg_to_rad(5);
            } else {
                player_to_bind_keyboard.controlled_object.speed_rotate = deg_to_rad(5);
            }
            break;

        case "ArrowDown":
        case 40:
            player_to_bind_keyboard.controlled_object.speed = -1;
            break;
    }
}

window.onkeyup = function (e) {
    let key = e.key || e.keyCode;
    // console.log(key)
    switch (key) {
        case " ":
            player_to_bind_keyboard.controlled_object.is_fire = false
            break;
        case "ArrowLeft":
        case 37:
        case "ArrowRight":
        case 39:
            player_to_bind_keyboard.controlled_object.speed_rotate = 0;
            // player_to_bind_keyboard.controlled_object.children.tower.speed_rotate = 0;
            break;

        case "ArrowUp":
        case 38:
        case "ArrowDown":
        case 40:
            player_to_bind_keyboard.controlled_object.speed = 0;
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