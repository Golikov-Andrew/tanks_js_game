let test_x = 0
let test_y = 0

class App {
    constructor(debug_mode = false) {
        this.canvas_element = document.querySelector('#viewport')
        // this.ctx = this.canvas_element.getContext('2d')
        this.viewport_width = 500
        this.viewport_height = 500
        this.tanks = []
        this.stage = null
        this.debug_mode = debug_mode

        this.previous = null
        this.elapsed = null
        // this.gamepad = null
        this.players = {

        }
        this.app_root_element = document.getElementById('app_root_element')
    }

    add_player(player){
        this.players[player.title] = player;
        this.app_root_element.appendChild(player.monitor.element)
    }

    set_stage(stage) {
        this.stage = stage
    }

    init() {
        this.tanks = this.stage.tanks
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

    }



    frame(timestamp) {
        if (!app.previous) app.previous = timestamp;
        app.elapsed = timestamp - app.previous;
        app.update(app.elapsed / 1000)

        for (const title in app.players) {
            app.players[title].monitor.redraw()
        }
        // app.redraw()


        app.previous = timestamp
        window.requestAnimationFrame(app.frame)
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
            if (gamepad !== null){
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

                        if(Date.now() - player.view_changed_at > 1000){

                            player.switch_view()
                        }

                    }

                    if (gamepad.axes[0] !== 0) {
                        player.tank.speed_rotate = gamepad.axes[0] * 0.05;
                    }
                    else {
                        player.tank.speed_rotate = 0
                    }

                    if (gamepad.axes[2] !== 0) {
                        player.tank.children.tower.speed_rotate = gamepad.axes[2] * 0.05;
                    }
                    else {
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