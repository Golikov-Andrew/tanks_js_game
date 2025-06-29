class Bullet extends GameObject {
    constructor(app, stage, owner, x, y, a, firing_range) {
        super(app, stage);

        this.width = 4
        this.length = 16
        this.x = x
        this.y = y
        this.a = a
        this.firing_range = firing_range
        this.speed = 6
        // this.speed_rotate = 0
        // this.is_point_test = true
        this.power = 10
        this.owner = owner
        // this.firing_range = 100000
        this.distance_traveled = 0
        this.collision_objects = [
            new CollisionSphere(this.app, this, 0, 0, 3)
        ]

    }

    handle_collisions(){
        if(this.distance_traveled >= this.firing_range){
            this.boom();
        }
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
                        return;
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

                        this.app.tooltips.push(new Tooltip(this.app, this.app.stage, tank.live.toFixed(2), col_obj_coords.x, col_obj_coords.y))
                        this.owner.player.points += 2
                        this.owner.player.team.points += 2
                        if(is_dead){
                            this.owner.player.points += 5
                            this.owner.player.team.points += 5
                            // TODO: возможно ошибки, посмотреть внимательно
                            console.log('null', this.owner.player.target_tank)
                            this.owner.player.target_tank = null
                        }
                        this.owner.player.monitor.refresh_points()
                        return;
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
    move(){
        super.move()
        this.distance_traveled += this.speed
    }

    boom(){
        this.app.stage.explosions.push(new Explosion(this.app, stage_1, this.x, this.y, this.power, 50))
        remove_from_list(this.owner.active_bullets, this)
        remove_from_list(this.app.stage.active_bullets, this)
        return this.power
    }


}


class Bullet2 extends Bullet{
    constructor(app, stage, owner, x, y, a, firing_range) {
        super(app, stage, owner, x, y, a);
        this.width = 2
        this.length = 4
        this.firing_range = firing_range
        this.speed = 10
        this.distance_traveled = 0
        this.power = 1
    }
    // move(){
    //     super.move()
    //     this.distance_traveled += this.speed
    // }
    boom(){
        this.app.stage.explosions.push(new Explosion(this.app, stage_1, this.x, this.y, this.power, 100))
        remove_from_list(this.owner.active_bullets, this)
        remove_from_list(this.app.stage.active_bullets, this)
        return this.power
    }
    // handle_collisions() {
    //     super.handle_collisions();
    //     if(this.distance_traveled >= this.firing_range){
    //         this.boom();
    //     }
    // }
}