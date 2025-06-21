class Stage extends GameObject {
    constructor(app) {
        super(app, null);
        this.app = app
        this.width = 800
        this.height = 800
        this.tanks = []
        this.stones = []
        this.active_bullets = []
    }

    add_tanks(tanks_list) {
        for (let i = 0; i < tanks_list.length; i++) {
            this.tanks.push(tanks_list[i])
        }
    }

    draw() {
        this.app.ctx.strokeStyle = 'green'
        this.app.ctx.beginPath()
        this.app.ctx.rect(0, 0, this.width, this.height);
        this.app.ctx.stroke();
    }
}