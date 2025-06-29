let test_x = 0
let test_y = 0

class App {
    constructor(debug_mode = false, modeling_mode = false) {
        this.canvas_element = document.querySelector('#viewport')
        // this.ctx = this.canvas_element.getContext('2d')
        this.viewport_width = 500
        this.viewport_height = 500
        this.tanks = []
        this.tooltips = []
        this.stage = null
        this.debug_mode = debug_mode
        this.modeling_mode = modeling_mode

        this.previous = null
        this.elapsed = null
        // this.gamepad = null
        this.players = {}
        this.teams = {}
        this.app_root_element = document.getElementById('app_root_element')
        this.global_info_element = document.getElementById('global_info')
        this.music = new Audio('sound/tanks_game.mp3')
        this.music.loop = true
        this.anim_frame = null

    }

    add_player(player) {
        this.players[player.title] = player;
        this.app_root_element.appendChild(player.monitor.element)
    }

    add_team(team) {
        this.teams[team.title] = team;
    }

    set_stage(stage) {
        this.stage = stage
    }

    init() {
        let tanks = []
        for (const title in this.teams) {
            for (let i = 0; i <this.teams[title].players.length; i++) {
                tanks.push(this.teams[title].players[i].tank)
                this.teams[title].players[i].tank.is_active = true
            }

        }
        stage_1.add_tanks(tanks)

        this.tanks = this.stage.tanks
        // this.music.play()


    }

    show_global_info(){
        let messages = []
        for (const team in this.teams) {
            messages.push(`${team}: ${this.teams[team].points}`)
        }
        this.global_info_element.innerHTML = messages.join('<br>')
    }

    update() {
        this.gamepad_handle();
        for (let i = 0; i < this.tanks.length; i++) {
            this.tanks[i].behavior()
            this.tanks[i].update()
        }
        for (let i = 0; i < this.stage.active_bullets.length; i++) {
            this.stage.active_bullets[i].update()
        }
        this.show_global_info()



    }


    frame(timestamp) {
        if (!app.previous) app.previous = timestamp;
        app.elapsed = timestamp - app.previous;
        app.update(app.elapsed / 1000)

        for (const title in app.players) {
            app.players[title].monitor.redraw()
        }
        // app.redraw()
        for (const title in app.teams) {
            let team = app.teams[title]
            let dead = 0
            for (let i = 0; i < team.players.length; i++) {
                if (team.players[i].tank.live <= 0) dead++
            }
            if(dead === team.players.length){
                delete app.teams[title]

                // alert(`Команда ${team.title} проиграла!!!`)
            }
        }

        if(Object.keys(app.teams).length === 1 && !app.modeling_mode){
            let winner_team_title = Object.keys(app.teams)[0]
            alert(`Команда ${winner_team_title} ВЫЙГРАЛА!!!`)
            window.cancelAnimationFrame(app.anim_frame)
            return;
        }


        app.previous = timestamp
        app.anim_frame = window.requestAnimationFrame(app.frame)
    }

    draw_circle(ctx, x, y, r) {
        ctx.beginPath()
        ctx.arc(
            x, y, r, 0, 2 * Math.PI
        )
        ctx.stroke()
    }

    gamepad_handle() {
        let idx = 0
        for (const title in this.players) {
            let player = this.players[title]
            let gamepad = navigator.getGamepads()[idx]
            // console.log(gamepad)
            if (gamepad !== null) {
                if (gamepad.id === 'SHANWAN Controller (STANDARD GAMEPAD Vendor: 045e Product: 028e)') {
                    if (gamepad.buttons[0].pressed) {
                        player.tank.fire();
                        // tank.speed_rotate = deg_to_rad(-5);
                    }
                    // else if(this.gamepad.buttons[1].pressed){
                    //     tank.speed_rotate = deg_to_rad(5);
                    // }else{
                    //     tank.speed_rotate = 0;
                    // }

                    if (gamepad.buttons[2].pressed) {
                        if (Date.now() - player.view_changed_at > 100) {
                            player.switch_view()
                        }
                    }

                    if (gamepad.axes[0] !== 0) {
                        player.tank.speed_rotate = gamepad.axes[0] * 0.05;
                    } else {
                        player.tank.speed_rotate = 0
                    }

                    if (gamepad.axes[2] !== 0) {
                        player.tank.children.tower.speed_rotate = gamepad.axes[2] * 0.05;
                    } else {
                        player.tank.children.tower.speed_rotate = 0;
                    }

                    if (gamepad.axes[1] !== 0) {
                        player.tank.speed = -gamepad.axes[1];
                    }
                    if (gamepad.axes[3] !== 0) {
                        player.tank.speed = -gamepad.axes[3];
                    }
                    if (gamepad.axes[1] === 0 && gamepad.axes[3] === 0) {
                        player.tank.speed = 0
                    }
                }

            }
            idx++
        }
        // const gamepads = navigator.getGamepads();
        // if (!gamepads) {
        //     return;
        // }
        // this.gamepad = gamepads[0];


    }
}

class AppModeling extends App{
    constructor(debug_mode){
        super(debug_mode, true);

    }
    init(controlled_object) {
        this.stage.helicopters = [controlled_object]
        this.helicopters = this.stage.helicopters
        for (const title in this.teams) {
            for (let i = 0; i <this.teams[title].players.length; i++) {

                if(this.teams[title].players[i].tank !== null){
                    this.stage.tanks.push(this.teams[title].players[i].tank)
                    this.teams[title].players[i].tank.is_active = true
                }
            }

        }
    }
    update() {
        this.gamepad_handle();
        for (let i = 0; i < this.helicopters.length; i++) {
            this.helicopters[i].behavior()
            this.helicopters[i].update()
        }
        for (let i = 0; i < this.stage.active_bullets.length; i++) {
            this.stage.active_bullets[i].update()
        }
        for (let i = 0; i < this.stage.explosions.length; i++) {
            this.stage.explosions[i].update()
        }
        for (let i = 0; i < this.stage.tanks.length; i++) {
            this.stage.tanks[i].update()
        }
        for (let i = 0; i < this.tooltips.length; i++) {
            this.tooltips[i].update()
        }
        this.show_global_info()



    }
    frame(timestamp) {
        if (!app.previous) app.previous = timestamp;
        app.elapsed = timestamp - app.previous;
        app.update(app.elapsed / 1000)

        for (const title in app.players) {
            app.players[title].monitor.redraw()
        }

        for (const title in app.teams) {
            let team = app.teams[title]
            let dead = 0
            for (let i = 0; i < team.players.length; i++) {
                if (team.players[i].controlled_object.live <= 0) dead++
            }
            if(dead === team.players.length){
                delete app.teams[title]
            }
        }

        app.previous = timestamp
        // console.log(123)
        app.anim_frame = window.requestAnimationFrame(app.frame)
    }
}