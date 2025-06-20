class App {
    constructor(debug_mode = false) {
        this.canvas_element = document.querySelector('#viewport')
        this.ctx = this.canvas_element.getContext('2d')
        this.viewport_width = 500
        this.viewport_height = 500
        this.tanks = []
        this.stage = null
        this.debug_mode = debug_mode

        this.previous = null
        this.elapsed = null
    }

    set_stage(stage){
        this.stage = stage
    }

    init() {
        this.tanks = this.stage.tanks

    }
    update(){

    }
    redraw(){
        app.ctx.clearRect(0, 0, app.viewport_width, app.viewport_height)
        for (let i = 0; i < app.tanks.length; i++) {
            debugger;

            app.tanks[i].redraw()
        }
    }

    frame(timestamp) {
        debugger;
        if (!app.previous) app.previous = timestamp;
        app.elapsed = timestamp - app.previous;
        app.update(app.elapsed / 1000)
        app.redraw()

        app.previous = timestamp
        window.requestAnimationFrame(app.frame)
    }

    draw_circle(x, y, r){
        this.ctx.arc(
            x, y, r, 0, 2 * Math.PI
        )
    }
}