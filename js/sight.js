class Sight extends GameObject{
    constructor(app, gun, firing_range) {
        super(app, gun);
        this.x = firing_range
        this.y = 0
        this.a = 0

    }

    draw(ctx) {
        ctx.beginPath()
        ctx.strokeStyle = '#000000'
        this.app.draw_circle(ctx, 0, 0, 10)
    }
}