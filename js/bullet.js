class Bullet extends GameObject {
    constructor(app, stage, owner, x, y, a) {
        super(app, stage);

        this.width = 4
        this.length = 16
        this.x = x
        this.y = y
        this.a = a
        this.speed = 6
        // this.speed_rotate = 0
        // this.is_point_test = true
        this.power = 1
        this.owner = owner
        this.collision_objects = [
            new CollisionSphere(this.app, this, 0, 0, 3)
        ]

    }

    handle_collisions(){

        for (let i = 0, c, coords; i < this.collision_objects.length; i++) {
            c = this.collision_objects[i]
            coords = c.get_global_xya(true)
            if (coords.x + c.r >= this.app.stage.width) {
                this.boom()
                return;
            }else if(coords.x - c.r <= 0){
                this.boom()
                return;
            }

            else if (coords.y + c.r >= this.app.stage.height) {
                this.boom()
                return;
            }else if(coords.y - c.r <= 0){
                this.boom()
                return;
            }

            for (let j = 0, stone; j < this.app.stage.stones.length; j++) {
                stone = this.app.stage.stones[j]
                for (let k = 0, col_obj, col_obj_coords; k < stone.collision_objects.length; k++) {
                    col_obj = stone.collision_objects[k]
                    col_obj_coords = col_obj.get_global_xya()
                    if (is_intersect(coords, col_obj_coords, c.r, col_obj.r)){
                        this.boom()
                    }
                }
            }

            for (let j = 0, tank; j < this.app.stage.tanks.length; j++) {
                tank = this.app.stage.tanks[j]
                if(tank === this.owner) continue;
                for (let k = 0, col_obj, col_obj_coords, is_dead; k < tank.collision_objects.length; k++) {
                    col_obj = tank.collision_objects[k]
                    col_obj_coords = col_obj.get_global_xya()
                    if (is_intersect(coords, col_obj_coords, c.r, col_obj.r)){
                        is_dead = tank.damage(this.boom())
                        this.owner.player.points += 2
                        this.owner.player.team.points += 2
                        if(is_dead){
                            this.owner.player.points += 5
                            this.owner.player.team.points += 5
                            console.log('null', this.owner.player.target_tank)
                            this.owner.player.target_tank = null
                        }
                        this.owner.player.monitor.refresh_points()
                    }
                }
            }
        }


    }

    draw(ctx) {
        // for (const title in this.app.players) {
        //     let ctx = this.app.players[title].monitor.ctx
            ctx.beginPath();
            ctx.fillStyle = '#000000';
            ctx.fillRect(-this.length / 2, -this.width / 2, this.length, this.width)
            ctx.closePath()
            ctx.stroke();
            if(this.app.debug_mode){
                this.app.draw_circle(ctx, 0, 0, 2)
            }
        // }

    }

    boom(){
        remove_from_list(this.owner.active_bullets, this)
        remove_from_list(this.app.stage.active_bullets, this)
        // console.log('boom', this.owner.active_bullets)
        return this.power
    }


}