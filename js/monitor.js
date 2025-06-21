class Monitor{
    constructor(app, player){
        this.app = app
        this.player = player
        this.element = document.createElement('div')
        this.element.classList.add('player_monitor')
        this.viewport = document.createElement('canvas')
        this.viewport.width = 800
        this.viewport.height = 800
        this.viewport.classList.add('viewport')
        this.element.appendChild(this.viewport)
        this.ctx = this.viewport.getContext('2d')
        this.dashboard = document.createElement('div')
        this.dashboard.classList.add('dashboard')
        this.dashboard.innerHTML = this.player.title
        this.element.appendChild(this.dashboard)
    }
    redraw() {
        // app.ctx.clearRect(0, 0, app.viewport_width, app.viewport_height)
        this.ctx.reset()
        this.ctx.save()
        // this.ctx.translate(this.player.tank.x, this.player.tank.y)
        if(this.player.current_view === 'tank'){
            this.ctx.translate(400 - this.player.tank.x, 400 - this.player.tank.y)
        }
        else if(this.player.current_view === 'tower'){
            // let global_tower_coords = this.player.tank.children.tower.get_global_xya()

            // this.ctx.rotate(global_tower_coords.a)
            let x = this.player.tank.x
            let y = this.player.tank.y
            let l = Math.sqrt(x * x + y * y);
            let x_old = x
            let y_old = y
            x = l * Math.cos(Math.atan2(y, x_old));
            y = l * Math.sin(Math.atan2(y, x_old));

            this.ctx.translate(400 - x, 400 - y)
            this.ctx.rotate(-this.player.tank.a - Math.PI / 2)
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
        this.ctx.restore()
    }
}