class CollisionSphere extends GameObject {
    constructor(app, parent, x, y, r) {
        super(app, parent);
        this.x = x
        this.y = y
        this.r = r
        this.nx = this.x
        this.ny = this.y
    }

    draw() {
        this.app.ctx.strokeStyle = 'red'
        this.app.ctx.beginPath()
        this.app.draw_circle(0, 0, this.r)
        this.app.ctx.stroke()
        if(this.app.debug_mode){
            this.app.draw_circle(0, 0, 2)
        }
        // this.get_global_xy()
    }


}