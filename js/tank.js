class TankGun extends GameObject {
    constructor(app, tower) {
        super(app, tower);
        this.x = 20
        this.y = 0
        this.a = 0

        this.charged = 200
        this.charge_time = 200
        this._firing_range_max = 200
        this._firing_range_min = 50
        this._firing_range = this._firing_range_max
        this.children.sight = new Sight(app, this, this._firing_range)

    }
    get firing_range(){
        return this._firing_range
    }
    set firing_range(val){
        if(val < this._firing_range_min) {
            val = this._firing_range_min
        }
        if(val > this._firing_range_max) {
            val = this._firing_range_max
        }
        this._firing_range = val
        this.children.sight.x = this._firing_range
    }

    draw(ctx) {
        ctx.beginPath()
        ctx.fillStyle = '#000000'
        ctx.fillRect(0, -2, 30, 4)
        if (this.app.debug_mode) {
            this.app.draw_circle(ctx, 0, 0, 5)
            this.get_global_xya()
        }
    }
}

class TankTower extends GameObject {
    constructor(app, tank) {
        super(app, tank);
        this.x = 20
        this.y = 0
        this.a = 0
        this.r = 20
        this.speed_rotate = 0

        this.children.gun = new TankGun(this.app, this)
    }

    draw(ctx) {
        ctx.beginPath()
        this.app.draw_circle(ctx, 0, 0, this.r)
        ctx.stroke()
        if (this.app.debug_mode) {
            this.app.draw_circle(ctx, 0, 0, 2)
            this.get_global_xya()
        }
    }

}

class Tank extends GameObject {
    constructor(app, stage, x, y, a) {
        super(app, stage);

        this.width = 50
        this.length = 100
        this.x = x
        this.y = y
        this.a = deg_to_rad(a)
        this.speed = 0
        this.speed_rotate = 0
        this.is_point_test = true
        this.radius_external = 60
        this.is_fire = false

        this.collision_objects = [
            new CollisionSphere(this.app, this, 25, 0, 30),
            new CollisionSphere(this.app, this, -25, 0, 30),
        ]
        this.children.tower = new TankTower(app, this)

        this.gun = this.children.tower.children.gun

        this.active_bullets = []
        this.live_max = 100
        this.live = this.live_max

        this.player = null
        this.color = null
        this.team_color = null
        this.is_human = false
        this.behaviour_tick = 0
        this.behaviour_temp = 10
        this.sound_tank_active = new Audio('sound/tank_active.mp3')
        this.sound_tank_move = new Audio('sound/tank_move.mp3')
        // this.sound_tank_active.loop=true
        this.is_active = false

    }

    attach_to_player(player){
        this.player = player
        this.color = this.player.color
        this.team_color = this.player.team.color
        this.is_human = this.player instanceof Human
        // if(this.is_human){
            this.player.monitor.live_status_element.style.setProperty('--width-val', `100%`)
        // }
    }

    dead() {
        remove_from_list(this.app.stage.tanks, this)
        let snd = new Audio('sound/explosion.mp3')
        if(!this.sound_tank_move.paused) this.sound_tank_move.pause()
        if(!this.sound_tank_active.paused) this.sound_tank_active.pause()
        snd.play()
        this.is_active = false
    }

    get_sight() {
        return this.gun.children.sight

    }

    damage(val) {
        this.live -= val
        this.player.points-=val
        this.player.team.points-=val
        this.player.monitor.refresh_points()

        let val_proc = 100 * this.live / this.live_max
        this.player.monitor.live_status_element.style.setProperty('--width-val', `${val_proc}px`)

        if (this.live <= 0) {
            this.dead()
            this.player.points-=5
            this.player.team.points-=5
            this.player.monitor.refresh_points()
            return true
        }
        return false
    }

    behavior() {
        if (!this.is_human) {
            this.behaviour_tick += 1
            if (this.behaviour_tick >= this.behaviour_temp) {
                this.behaviour_tick = 0
                let ai_level = this.player.ai_level

                if(ai_level === 1){
                    let int = get_rand_int(0, 100)
                    if (0 <= int && int < 5) {
                        this.fire()
                    } else if (5 <= int && int < 10) {
                        this.speed = -1;
                    } else if (10 <= int && int < 15) {
                        this.speed = 1;
                    } else if (15 <= int && int < 30) {
                        this.speed = 0;
                    } else if (30 <= int && int < 35) {
                        this.speed_rotate = 0.05;
                    } else if (35 <= int && int < 40) {
                        this.speed_rotate = -0.05;
                    } else if (40 <= int && int < 65) {
                        this.speed_rotate = 0;
                    } else if (65 <= int && int < 70) {
                        this.children.tower.speed_rotate = 0.05;
                    } else if (70 <= int && int < 75) {
                        this.children.tower.speed_rotate = -0.05;
                    } else if (75 <= int && int < 100) {
                        this.children.tower.speed_rotate = 0;
                    }
                }

                else if(ai_level === 2){

                    if(this.player.target_tank === null){
                        for (const team_title in this.app.teams) {
                            if(team_title !== this.player.team.title){
                                for (let i = 0, pl; i <this.app.teams[team_title].players.length; i++) {
                                    pl = this.app.teams[team_title].players[i]
                                    if(pl.tank.is_active){
                                        if(get_distance(pl.tank.x, pl.tank.y, this.x, this.y) < this.player.view_radius_1){
                                            this.player.target_tank = pl.tank
                                            console.log('target_tank', this.player.target_tank)
                                            break
                                        }
                                    }
                                }
                                break
                            }
                        }
                    }else{
                        if(get_distance(this.player.target_tank.x, this.player.target_tank.y, this.x, this.y) >= this.player.view_radius_1){
                            this.player.target_tank = null
                            console.log('loose target')
                        }
                    }

                    let int = get_rand_int(0, 150)
                    if (0 <= int && int < 5) {
                        this.fire()
                    }


                    else if (5 <= int && int < 10) {
                        this.speed = -1;
                    } else if (10 <= int && int < 15) {
                        this.speed = 1;
                    } else if (15 <= int && int < 30) {
                        this.speed = 0;
                    }
                    else if (30 <= int && int < 35) {
                        this.speed_rotate = 0.05;
                    } else if (35 <= int && int < 40) {
                        this.speed_rotate = -0.05;
                    }
                    else if (40 <= int && int < 65) {
                        this.speed_rotate = 0;
                    }


                    // else if (65 <= int && int < 70) {
                    //     this.children.tower.speed_rotate = 0.05;
                    // } else if (70 <= int && int < 75) {
                    //     this.children.tower.speed_rotate = -0.05;
                    // }

                    // else if (75 <= int && int < 100) {
                    //     this.children.tower.speed_rotate = 0;
                    // }
                    else if (65 <= int && int < 150) {
                        let target_alpha = 0;
                        if(this.player.target_tank !== null){
                            let target_tank_coords = this.player.target_tank.get_global_xya()
                            let coords = this.get_global_xya()
                            let tower_coords = this.children.tower.get_global_xya()
                            let dy = tower_coords.y - target_tank_coords.y
                            let dx = tower_coords.x - target_tank_coords.x
                            target_alpha = Math.PI + (Math.atan2(dy, dx) - coords.a) % (Math.PI * 2)
                            // let beta = coords.a % (Math.PI * 2)
                            // if(beta - target_alpha >= Math.PI - 0.01){
                            //     this.children.tower.speed_rotate = -0.05;
                            //
                            // }else if(beta - target_alpha <= Math.PI + 0.01){
                            //     this.children.tower.speed_rotate = 0.05;
                            // }
                            // else{
                            //     this.children.tower.speed_rotate = 0;
                            // }
                            this.children.tower.a = target_alpha
                        }
                    }
                }


            }

        }
    }

    handle_collisions() {

        // TODO: replace to another place;
        this.fire()

        if(this.gun.charged < this.gun.charge_time){
            this.gun.charged++
            // if(this.player instanceof Human){
                let val = 100 * this.gun.charged / this.gun.charge_time
                this.player.monitor.charged_status_element.style.setProperty('--width-val', `${val}px`)
            // }
        }



        for (let i = 0, c, coords; i < this.collision_objects.length; i++) {
            c = this.collision_objects[i]
            coords = c.get_global_xya(true)
            if (coords.x + c.r >= this.app.stage.width) {
                this.nx = this.x - 1
                this.na = this.a
                break;
            } else if (coords.x - c.r <= 0) {
                this.nx = this.x + 1
                this.na = this.a
                break;
            }

            if (coords.y + c.r >= this.app.stage.height) {
                this.ny = this.y - 1
                this.na = this.a
                break;
            } else if (coords.y - c.r <= 0) {
                this.ny = this.y + 1
                this.na = this.a
                break;
            }

            for (let j = 0, stone; j < this.app.stage.stones.length; j++) {
                stone = this.app.stage.stones[j]
                for (let k = 0, col_obj, col_obj_coords; k < stone.collision_objects.length; k++) {
                    col_obj = stone.collision_objects[k]
                    col_obj_coords = col_obj.get_global_xya()
                    if (is_intersect(coords, col_obj_coords, c.r, col_obj.r)) {
                        this.nx = this.x
                        this.ny = this.y
                        this.na = this.a
                    }
                }
            }

            for (let j = 0, tank; j < this.app.stage.tanks.length; j++) {
                tank = this.app.stage.tanks[j]
                if (tank === this) continue;
                for (let k = 0, col_obj, col_obj_coords; k < tank.collision_objects.length; k++) {
                    col_obj = tank.collision_objects[k]
                    col_obj_coords = col_obj.get_global_xya()
                    if (is_intersect(coords, col_obj_coords, c.r, col_obj.r)) {
                        this.nx = this.x
                        this.ny = this.y
                        this.na = this.a
                    }
                }
            }
        }


    }

    draw(ctx) {
        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.strokStyle = '#000000';
        ctx.strokeRect(-this.length / 2, -this.width / 2, this.length, this.width)
        ctx.closePath()
        ctx.stroke();
        ctx.fillStyle = this.color;
        ctx.fillRect(-45, -this.width / 2, 10, this.width)
        ctx.fillStyle = this.team_color;
        ctx.fillRect(-35, -this.width / 2, 5, this.width)
        if (this.app.debug_mode) {
            this.app.draw_circle(ctx, 0, 0, 2)
        }
    }

    fire() {
        if(this.is_fire){
            if (this.gun.charged < this.gun.charge_time ) return;
            let fire_sound = new Audio('sound/tank_fire.mp3')
            fire_sound.play()
            let global_coords = this.children.tower.children.gun.get_global_xya()
            let new_bullet = new Bullet(
                this.app, this.app.stage, this,
                global_coords.x,
                global_coords.y,
                global_coords.a,
                this.gun.firing_range
            )
            this.active_bullets.push(new_bullet)
            this.app.stage.active_bullets.push(new_bullet)
            this.gun.charged = 0
            this.player.points--
            this.player.team.points--
            this.player.monitor.refresh_points()
        }




    }

    play_sounds(){
        // if(this.is_active){
        //     if(this.live > 0){
        //         if(this.speed < -0.1 || 0.1 < this.speed ){
        //             this.sound_tank_active.pause()
        //             if(this.sound_tank_move.paused) this.sound_tank_move.play()
        //         }else{
        //             this.sound_tank_move.pause()
        //             if(this.sound_tank_active.paused) this.sound_tank_active.play()
        //         }
        //     }
        //
        // }
    }

}