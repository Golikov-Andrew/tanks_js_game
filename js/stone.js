class Stone extends GameObject {
    constructor(app, stage, x, y, a) {
        super(app, stage);

        this.width = 100
        this.length = 100
        this.x = x
        this.y = y
        this.a = deg_to_rad(a)
        this.collision_objects = [
            new CollisionSphere(this.app, this, 0, 0, 50),
            new CollisionSphere(this.app, this, 30, 10, 30),
            new CollisionSphere(this.app, this, -30, 40, 30),
        ]
    }

    draw() {
        this.app.ctx.beginPath();
        this.app.ctx.strokeWidth = 1;
        this.app.ctx.fillStyle = '#888888';
        this.app.draw_circle(0, 0, 50);
        this.app.ctx.fill();
        this.app.draw_circle(30, 10, 30);
        this.app.ctx.fill();
        this.app.draw_circle(-30, 40, 30);
        this.app.ctx.closePath()
        this.app.ctx.fill();
        if(this.app.debug_mode){
            this.app.draw_circle(0, 0, 2)
        }
        // this.get_global_xy()

    }


}