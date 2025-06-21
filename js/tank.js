class TankGun extends GameObject {
    constructor(app, tower) {
        super(app, tower);
        this.x = 20
        this.y = 0
        this.a = 0
    }

    draw() {
        this.app.ctx.beginPath()
        this.app.ctx.fillStyle = '#000000'
        this.app.ctx.fillRect(0, -2, 30, 4)
        if (this.app.debug_mode) {
            this.app.draw_circle(0, 0, 5)
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

    draw() {
        this.app.ctx.beginPath()
        this.app.draw_circle(0, 0, this.r)
        this.app.ctx.stroke()
        if (this.app.debug_mode) {
            this.app.draw_circle(0, 0, 2)
            this.get_global_xya()
        }
    }

}

class Tank extends GameObject {
    constructor(app, stage, x, y, a, color, is_human) {
        super(app, stage);

        this.width = 50
        this.length = 100
        this.x = x
        this.y = y
        this.a = deg_to_rad(a)
        this.speed = 0
        this.speed_rotate = 0
        this.is_point_test = true


        // let test_obj =
        // test_obj.is_point_test = true
        this.collision_objects = [
            new CollisionSphere(this.app, this, 25, 0, 30),
            new CollisionSphere(this.app, this, -25, 0, 30),
        ]
        this.children.tower = new TankTower(app, this)

        this.active_bullets = []
        this.live = 5
        this.color = color
        this.is_human = is_human
        this.behaviour_tick = 0
        this.behaviour_temp = 10

    }

    dead() {
        remove_from_list(this.app.stage.tanks, this)
    }

    damage(val) {
        this.live -= val
        if (this.live <= 0) {
            this.dead()
        }
    }

    behavior() {
        if (!this.is_human) {
            this.behaviour_tick += 1
            if (this.behaviour_tick >= this.behaviour_temp) {
                this.behaviour_tick = 0
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

        }
    }

    handle_collisions() {

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

    draw() {
        this.app.ctx.beginPath();
        this.app.ctx.lineWidth = 1;
        this.app.ctx.strokStyle = '#000000';
        this.app.ctx.strokeRect(-this.length / 2, -this.width / 2, this.length, this.width)
        this.app.ctx.closePath()
        this.app.ctx.stroke();
        this.app.ctx.fillStyle = this.color;
        this.app.ctx.fillRect(-40, -this.width / 2, 10, this.width)
        if (this.app.debug_mode) {
            this.app.draw_circle(0, 0, 2)
        }
        // this.get_global_xy()

    }

    fire() {
        if (this.active_bullets.length > 0) return;
        let global_coords = this.children.tower.children.gun.get_global_xya()
        // console.log(global_coords)
        let new_bullet = new Bullet(
            this.app, this.app.stage, this,
            global_coords.x,
            global_coords.y,
            global_coords.a
        )
        this.active_bullets.push(new_bullet)
        this.app.stage.active_bullets.push(new_bullet)
    }


}