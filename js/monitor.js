class Monitor {
    constructor(app, player) {
        this.app = app
        this.player = player
        this.element = document.createElement('div')
        this.element.classList.add('player_monitor')
        this.viewport = document.createElement('canvas')
        this.default_width = 800
        this.default_height = 800
        this.viewport.width = 800
        this.viewport.height = 800
        this.viewport.classList.add('viewport')
        this.element.appendChild(this.viewport)
        this.ctx = this.viewport.getContext('2d')
        this.dashboard = document.createElement('div')
        this.dashboard.classList.add('dashboard')

        this.title_element = document.createElement('div')
        this.title_element.classList.add('title')
        this.title_element.innerHTML = this.player.title

        this.live_status_element = document.createElement('div')
        this.live_status_element.classList.add('live_status')
        this.live_status_element.innerHTML = 'Live'

        this.charged_status_element = document.createElement('div')
        this.charged_status_element.classList.add('charged_status')
        this.charged_status_element.innerHTML = 'Charge Bullet'

        this.points_status_element = document.createElement('div')
        this.points_status_element.classList.add('points_status')
        this.refresh_points()

        this.debug_info_element = document.createElement('div')
        this.debug_info_element.classList.add('debug_info')
        this.debug_info_element.innerHTML = ''

        this.dashboard.appendChild(this.title_element)
        this.dashboard.appendChild(this.live_status_element)
        this.dashboard.appendChild(this.charged_status_element)
        this.dashboard.appendChild(this.points_status_element)
        this.dashboard.appendChild(this.debug_info_element)
        this.element.appendChild(this.dashboard)
    }

    refresh_points(){
        this.points_status_element.innerHTML = `Points: ${this.player.points}`
    }

    debug_report(message){
        this.debug_info_element.innerHTML = message
    }

    reset_scale() {
        this.viewport.width = this.default_width
        this.viewport.height = this.default_height
    }

    redraw() {
        this.ctx.reset()
        this.ctx.save()
        // this.ctx.translate(this.player.tank.x, this.player.tank.y)
        if (this.player.current_view === 'stage') {

        } else if (this.player.current_view === 'tank_1') {
            this.ctx.translate(400 - this.player.tank.x, 400 - this.player.tank.y)
        }
        else if (this.player.current_view === 'tank_2') {
            // let global_coords = this.player.tank.get_global_xya()
            let x = this.player.tank.x
            let y = this.player.tank.y
            let a = this.player.tank.a
            let l = Math.sqrt(x * x + y * y);

            let x_translate =  - x + 565.685424949 * Math.cos(Math.PI / 2 + a + deg_to_rad(45))
            let y_translate =  - y + 565.685424949 * Math.sin(Math.PI / 2 + a + deg_to_rad(45))
            let a_rotate = -a - Math.PI / 2

            // this.debug_report(`coords: ${Math.round(x)} ${Math.round(y)} ${Math.round(rad_to_deg(a))}<br>
            // Math.cos(a): ${math_cos.toFixed(2)}<br>
            // Math.sin(a): ${Math.sin(a).toFixed(2)}<br>
            // x*Math.cos(a): ${(x*math_cos).toFixed(2)}<br>
            // y*Math.sin(a): ${(y*Math.sin(a)).toFixed(2)}<br>
            // x_translate: ${x_translate.toFixed(2)}<br>
            // y_translate: ${y_translate.toFixed(2)}<br>
            // a_rotate: ${Math.round(rad_to_deg(a_rotate))}<br>
            // l: ${Math.round(l)}<br>
            // `)

            this.ctx.rotate(a_rotate)
            this.ctx.translate(x_translate, y_translate)

        }
        else if (this.player.current_view === 'tower') {
            let global_coords = this.player.tank.children.tower.get_global_xya()
            let x = global_coords.x
            let y = global_coords.y
            let a = global_coords.a
            // let l = Math.sqrt(x * x + y * y);

            let x_translate =  - x + 565.685424949 * Math.cos(Math.PI / 2 + a + deg_to_rad(45))
            let y_translate =  - y + 565.685424949 * Math.sin(Math.PI / 2 + a + deg_to_rad(45))
            let a_rotate = -a - Math.PI / 2
            this.ctx.rotate(a_rotate)
            this.ctx.translate(x_translate, y_translate)
        }

        for (let i = 0; i < app.tanks.length; i++) {
            app.tanks[i].redraw(this.ctx)
        }
        for (let i = 0; i < app.stage.stones.length; i++) {
            app.stage.stones[i].redraw(this.ctx)
        }
        for (let i = 0; i < app.stage.active_bullets.length; i++) {
            app.stage.active_bullets[i].redraw(this.ctx)
        }
        app.stage.redraw(this.ctx)

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
        this.ctx.restore()
    }
}

class MonitorModeling extends Monitor{
    constructor(app, player) {
        super(app, player);



    }
    redraw() {
        this.ctx.reset()
        this.ctx.save()
        if (this.player.current_view === 'stage') {

        } else if (this.player.current_view === 'tank_1') {
            this.ctx.translate(400 - this.player.controlled_object.x, 400 - this.player.controlled_object.y)
        }
        else if (this.player.current_view === 'tank_2') {
            let x = this.player.controlled_object.x
            let y = this.player.controlled_object.y
            let a = this.player.controlled_object.a
            let l = Math.sqrt(x * x + y * y);

            let x_translate =  - x + 565.685424949 * Math.cos(Math.PI / 2 + a + deg_to_rad(45))
            let y_translate =  - y + 565.685424949 * Math.sin(Math.PI / 2 + a + deg_to_rad(45))
            let a_rotate = -a - Math.PI / 2

            this.ctx.rotate(a_rotate)
            this.ctx.translate(x_translate, y_translate)

        }
        else if (this.player.current_view === 'tower') {
            let global_coords = this.player.tank.children.tower.get_global_xya()
            let x = global_coords.x
            let y = global_coords.y
            let a = global_coords.a
            let x_translate =  - x + 565.685424949 * Math.cos(Math.PI / 2 + a + deg_to_rad(45))
            let y_translate =  - y + 565.685424949 * Math.sin(Math.PI / 2 + a + deg_to_rad(45))
            let a_rotate = -a - Math.PI / 2
            this.ctx.rotate(a_rotate)
            this.ctx.translate(x_translate, y_translate)
        }

        for (let i = 0; i < app.stage.helicopters.length; i++) {
            app.stage.helicopters[i].redraw(this.ctx)
        }
        for (let i = 0; i < app.stage.tanks.length; i++) {
            app.stage.tanks[i].redraw(this.ctx)
        }
        for (let i = 0; i < app.stage.active_bullets.length; i++) {
            app.stage.active_bullets[i].redraw(this.ctx)
        }
        for (let i = 0; i < app.stage.explosions.length; i++) {
            app.stage.explosions[i].redraw(this.ctx)
        }
        for (let i = 0; i < app.tooltips.length; i++) {
            app.tooltips[i].redraw(this.ctx)
        }
        app.stage.redraw(this.ctx)
        this.player.controlled_object.get_sight().draw(this.ctx)
        this.ctx.restore()
    }
}