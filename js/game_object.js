class GameObject {
    constructor(app, parent) {
        this.app = app
        this.parent = parent
        this.children = {}
        this.collision_objects = []
        this.speed = 0
        this.speed_rotate = 0
        this.x = 0
        this.y = 0
        this.a = 0
        this.nx = this.x
        this.ny = this.y
        this.na = this.a
        this.gx = 0
        this.gy = 0
        this.ga = 0
        this.is_point_test = false
    }

    add_child(key, child_obj) {
        this.children[key] = child_obj
    }

    draw() {

    }

    redraw(ctx) {
        // for (const title in this.app.players) {
        //     let ctx = this.app.players[title].monitor.ctx
            ctx.save()
            ctx.translate(this.x, this.y)
            ctx.rotate(this.a)
            this.draw(ctx)
            for (const key in this.children) {
                this.children[key].redraw(ctx)
            }
            if (this.app.debug_mode) {
                for (let i = 0; i < this.collision_objects.length; i++) {
                    this.collision_objects[i].redraw(ctx)
                }
            }
            ctx.restore()
        // }

    }

    move() {
        this.nx = this.x + this.speed * Math.cos(this.a)
        this.ny = this.y + this.speed * Math.sin(this.a)
        // if(this.x < 0) this.x = 0
        // else if(this.x > this.app.stage.width) this.x = this.app.stage.width
        // if(this.y < 0) this.y = 0
        // else if(this.y > this.app.stage.height) this.y = this.app.stage.height
    }

    rotate() {
        this.na = this.a + this.speed_rotate
    }

    handle_collisions(){

    }

    play_sounds(){

    }

    update() {
        this.move()
        this.rotate()
        this.handle_collisions()
        this.update_accept()
        this.play_sounds()
        for (const child_key in this.children) {
            this.children[child_key].update()
        }
    }

    update_accept() {
        this.x = this.nx
        this.y = this.ny
        this.a = this.na
    }

    get_global_xya(is_new_coords) {
        is_new_coords = (is_new_coords !== undefined) ? is_new_coords: false
        let target_obj = this;
        let prefix = is_new_coords ? 'n' : '';
        let a = target_obj[`${prefix}a`];
        let x = target_obj[`${prefix}x`];
        let y = target_obj[`${prefix}y`];

        let x_old = x
        let y_old = y

        let l = Math.sqrt(x * x + y * y);

        // let next_parent = target_obj.parent
        // while (next_parent !== null) {
        //     target_obj = next_parent
        //     l = Math.sqrt(x * x + y * y);
        //     x = l * Math.cos(target_obj[`${prefix}a`] + Math.atan2(y, x)) + target_obj[`${prefix}x`];
        //     y = l * Math.sin(target_obj[`${prefix}a`] + Math.atan2(y, x)) + target_obj[`${prefix}y`];
        //     a = a + target_obj[`${prefix}a`]
        //     next_parent = next_parent.parent
        // }

        // let next_parent = target_obj.parent
        while (target_obj.parent !== null) {
            // target_obj = next_parent
            l = Math.sqrt(x * x + y * y);
            let x_old = x
            let y_old = y
            x = l * Math.cos(target_obj.parent[`${prefix}a`] + Math.atan2(y, x_old)) + target_obj.parent[`${prefix}x`];
            y = l * Math.sin(target_obj.parent[`${prefix}a`] + Math.atan2(y, x_old)) + target_obj.parent[`${prefix}y`];
            // if(x < 0){
            //     y = l * Math.sin(target_obj.parent[`${prefix}a`] + Math.PI - Math.atan2(y, x)) + target_obj.parent[`${prefix}y`];
            // }else{
            //     y = l * Math.sin(target_obj.parent[`${prefix}a`] + Math.atan2(y, x)) + target_obj.parent[`${prefix}y`];
            // }



            a = a + target_obj.parent[`${prefix}a`]
            target_obj = target_obj.parent
        }

        this.ga = a
        this.gx = x
        this.gy = y

        return {
            x: x, y: y, a: a
        }
    }

    get_global_a(){
        let target_obj = this;
        let a = target_obj.a;

        let next_parent = target_obj.parent
        while (next_parent !== null){
            target_obj = next_parent
            a = a + target_obj.a
            next_parent = next_parent.parent
        }
        return a
    }
}