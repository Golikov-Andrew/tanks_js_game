class Stage extends GameObject {
    constructor(app, width, height) {
        super(app, null);
        this.app = app
        this.width = width
        this.height = height
        this.tanks = []
        this.helicopters = []
        this.stones = []
        this.active_bullets = []
    }

    add_tanks(tanks_list) {
        for (let i = 0; i < tanks_list.length; i++) {
            this.tanks.push(tanks_list[i])
        }
    }

    draw(ctx) {
        // for (const title in this.app.players) {
        //     let ctx = this.app.players[title].monitor.ctx
            ctx.strokeStyle = 'green'
            ctx.beginPath()
            ctx.rect(0, 0, this.width, this.height);
            ctx.stroke();
        // }

    }
}