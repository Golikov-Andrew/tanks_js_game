let test_x = 0
let test_y = 0

class App {
    constructor(debug_mode = false) {
        this.canvas_element = document.querySelector('#viewport')
        this.ctx = this.canvas_element.getContext('2d')
        this.viewport_width = 500
        this.viewport_height = 500
        this.tanks = []
        this.stage = null
        this.debug_mode = debug_mode

        this.previous = null
        this.elapsed = null
        this.gamepad = null
    }

    set_stage(stage) {
        this.stage = stage
    }

    init() {
        this.tanks = this.stage.tanks

    }

    update() {
        if (this.gamepad !== null) this.gamepad_handle();
        for (let i = 0; i < this.tanks.length; i++) {
            this.tanks[i].behavior()
            this.tanks[i].update()
        }
        for (let i = 0; i < this.stage.active_bullets.length; i++) {
            this.stage.active_bullets[i].update()
        }

    }

    redraw() {
        // app.ctx.clearRect(0, 0, app.viewport_width, app.viewport_height)
        app.ctx.reset()
        for (let i = 0; i < app.tanks.length; i++) {
            app.tanks[i].redraw()
        }
        for (let i = 0; i < app.stage.stones.length; i++) {
            app.stage.stones[i].redraw()
        }
        for (let i = 0; i < app.stage.active_bullets.length; i++) {
            app.stage.active_bullets[i].redraw()
        }
        app.stage.redraw()

        // console.log(rad_to_deg(app.tanks[0].get_global_a()))
        // console.log(rad_to_deg(app.tanks[0].children.tower.get_global_a()))
        // let test_xya = app.tanks[0].children.tower.get_global_xya()
        let test_xya = app.tanks[0].collision_objects[1].get_global_xya()
        // console.log(test_xya.x, test_xya.y, rad_to_deg(test_xya.a))

        // app.ctx.save()
        // app.ctx.beginPath()
        //
        // app.ctx.lineWidth=2
        // app.ctx.strokeStyle='blue'
        //
        // for (let i = 0, t, tower, gun; i < this.tanks.length; i++) {
        //     t = this.tanks[i]
        //
        //     for (let j = 0, co; j <t.collision_objects.length; j++) {
        //         co = t.collision_objects[j]
        //         app.draw_circle(co.gx, co.gy, 5)
        //     }
        //     tower = t.children.tower
        //     app.draw_circle(tower.gx, tower.gy, 5)
        //     gun = tower.children.gun
        //     app.draw_circle(gun.gx, gun.gy, 5)
        // }
        // app.ctx.stroke()
        // app.ctx.restore()
    }

    frame(timestamp) {
        if (!app.previous) app.previous = timestamp;
        app.elapsed = timestamp - app.previous;
        app.update(app.elapsed / 1000)

        app.redraw()


        app.previous = timestamp
        window.requestAnimationFrame(app.frame)
    }

    draw_circle(x, y, r) {
        this.ctx.beginPath()
        this.ctx.arc(
            x, y, r, 0, 2 * Math.PI
        )
        this.ctx.stroke()
    }

    gamepad_handle() {
        const gamepads = navigator.getGamepads();
        if (!gamepads) {
            return;
        }
        this.gamepad = gamepads[0];
        if (this.gamepad.id === 'SHANWAN Controller (STANDARD GAMEPAD Vendor: 045e Product: 028e)') {
            if (this.gamepad.buttons[0].pressed) {
                tank.fire();
                // tank.speed_rotate = deg_to_rad(-5);
            }
            // else if(this.gamepad.buttons[1].pressed){
            //     tank.speed_rotate = deg_to_rad(5);
            // }else{
            //     tank.speed_rotate = 0;
            // }

            // if (this.gamepad.buttons[2].pressed) {
            //     tank.speed = 1;
            // }else if(this.gamepad.buttons[3].pressed){
            //     tank.speed = -1;
            // }else{
            //     tank.speed = 0;
            // }

            if (this.gamepad.axes[0] !== 0) {
                tank.speed_rotate = this.gamepad.axes[0] * 0.05;
            }
            else {
                tank.speed_rotate = 0
            }

            if (this.gamepad.axes[2] !== 0) {
                tank.children.tower.speed_rotate = this.gamepad.axes[2] * 0.05;
            }
            else {
                tank.children.tower.speed_rotate = 0;
            }

            if (this.gamepad.axes[1] !== 0) {
                tank.speed = -this.gamepad.axes[1];
            }
            if (this.gamepad.axes[3] !== 0) {
                tank.speed = -this.gamepad.axes[3];
            }
            if (this.gamepad.axes[1] === 0 && this.gamepad.axes[3] === 0) {
                tank.speed = 0
            }
        }


    }
}