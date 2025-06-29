class Tooltip extends GameObject{
    constructor(app, stage, text, x, y) {
        super(app, stage);
        this.text = text
        this.x = x
        this.y = y - 50
        this.nx = this.x
        this.ny = this.y
        this.distance_traveled = 0
    }
    update(){
        this.ny = this.y - 0.5
        console.log(this.y)
        this.distance_traveled++
        this.update_accept(this.ny)
        if(this.distance_traveled >= 100){
            remove_from_list(this.app.tooltips, this)
        }
    }
    draw(ctx){
        ctx.font = "bold 24px serif"
        ctx.fillStyle = "#FFFFFF"
        ctx.fillRect(0, -20, 100, 40)
        // ctx.strokeStyle = "#000000"
        // ctx.strokeRect(0, -20, 100, 40)
        ctx.fillStyle = "#000000"
        ctx.fillText(this.text, 0, 0)
    }
}