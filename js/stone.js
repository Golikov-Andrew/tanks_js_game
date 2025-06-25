class Stone extends GameObject {
    constructor(app, stage, x, y, a) {
        super(app, stage);

        this.width = 100
        this.length = 100
        this.radius_external = 80
        this.x = x
        this.y = y
        this.a = deg_to_rad(a)
        this.collision_objects = [
            new CollisionSphere(this.app, this, 0, 0, 50),
            new CollisionSphere(this.app, this, 30, 10, 30),
            new CollisionSphere(this.app, this, -30, 40, 30),
        ]
    }

    draw(ctx) {
        // for (const title in this.app.players) {
        //     let ctx = this.app.players[title].monitor.ctx
            ctx.beginPath();
            ctx.strokeWidth = 1;
            ctx.fillStyle = '#888888';
            this.app.draw_circle(ctx, 0, 0, 50);
            ctx.fill();
            this.app.draw_circle(ctx, 30, 10, 30);
            ctx.fill();
            this.app.draw_circle(ctx, -30, 40, 30);
            ctx.closePath()
            ctx.fill();
            if(this.app.debug_mode){
                this.app.draw_circle(ctx, 0, 0, 2)
            }
        // }


    }


}