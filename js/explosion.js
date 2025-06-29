class Explosion extends GameObject{
    constructor(app, stage, x, y, power, maxRadius, owner) {
        super(app, stage);

        this.x = x
        this.y = y
        this.a = 0
        this.speed = 0
        this.radius_increase_speed = 1
        this.power = 1
        this.radius = 0
        this.owner = owner
        this.maxRadius = maxRadius
        this.delta_decrease_power = this.power * this.radius_increase_speed / this.maxRadius
        this.collision_objects = [
            new CollisionSphere(this.app, this, 0, 0, 0)
        ]

    }
    update(){
        super.update()
        this.radius += this.radius_increase_speed
        this.collision_objects[0].r += this.radius_increase_speed
        this.power -= this.delta_decrease_power
        console.log(this.power)
        if(this.power < 0 || this.radius > this.maxRadius){
            remove_from_list(this.app.stage.explosions, this)
        }
    }
    draw(ctx) {
        ctx.beginPath();
        ctx.fillStyle = '#FFFF00';
        app.draw_circle(ctx, 0, 0 , this.radius)
        ctx.fill()
        ctx.closePath()
        if (this.app.debug_mode) {
            this.app.draw_circle(ctx, 0, 0, this.radius)
        }
    }
    handle_collisions(){
        let coords = this.collision_objects[0].get_global_xya()
        for (let j = 0, tank; j < this.app.stage.tanks.length; j++) {
            tank = this.app.stage.tanks[j]
            for (let k = 0, col_obj, col_obj_coords, is_dead; k < tank.collision_objects.length; k++) {
                col_obj = tank.collision_objects[k]
                col_obj_coords = col_obj.get_global_xya()
                if (is_intersect(coords, col_obj_coords, this.collision_objects[0].r, col_obj.r)){
                    try{
                        is_dead = tank.damage(this.power)
                        this.app.tooltips.push(new Tooltip(this.app, this.app.stage, tank.live.toFixed(2), col_obj_coords.x, col_obj_coords.y))
                    }catch(e){
                        debugger;
                    }
                    if(this.owner !== undefined){
                        this.owner.player.points += 2
                        this.owner.player.team.points += 2
                    }
                    if(is_dead){
                        if(this.owner !== undefined){
                            this.owner.player.points += 5
                            this.owner.player.team.points += 5
                            // TODO: возможно ошибки, посмотреть внимательно
                            console.log('null', this.owner.player.target_tank)
                            this.owner.player.target_tank = null
                        }
                    }
                    this.owner?.player.monitor.refresh_points()
                    return;
                }
            }
        }
    }
}