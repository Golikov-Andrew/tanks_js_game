class CollisionSphere extends GameObject {
    constructor(app, parent, x, y, r) {
        super(app, parent);
        this.x = x
        this.y = y
        this.r = r
        this.nx = this.x
        this.ny = this.y
    }

    draw(ctx) {
        ctx.strokeStyle = 'red'
        ctx.beginPath()
        this.app.draw_circle(ctx,0, 0, this.r)
        ctx.stroke()
        if(this.app.debug_mode){
            this.app.draw_circle(ctx, 0, 0, 2)
        }
        // this.get_global_xy()
    }


}