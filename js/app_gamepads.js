class App {
    constructor() {
        this.canvas_element = document.querySelector('#viewport')
        this.ctx = this.canvas_element.getContext('2d')
        this.viewport_width = 500
        this.viewport_height = 500
        // this.tanks = []
        this.stage = new Stage(this)
    }

    init(tanks) {
        this.tanks = tanks
    }

    start() {
        let gamepads = navigator.getGamepads();
        if (gamepads.length !== 0 && gamepads[0] !== null) {
            let gp = gamepads[0];
            if (gp.buttons[0].pressed) {
                console.log('button 1')
                app.tanks[0].parent_y--;
            }
            if (gp.buttons[2].pressed) {
                console.log('button 2')
                app.tanks[0].parent_y++;
            }
            if (gp.buttons[1].pressed) {
                console.log('button 3')
                app.tanks[0].parent_x++;
            }
            if (gp.buttons[3].pressed) {
                console.log('button 4')
                app.tanks[0].parent_x--;
            }
            if(gp.axes[0]!==0){
                console.log('button 5')
                app.tanks[0].parent_a += gp.axes[0]
                console.log('a', app.tanks[0].parent_a)
            }
            // if(gp.axes[1]!==0){
            //     b += gp.axes[1]
            //     console.log('b', b)
            // }
        }



        app.ctx.clearRect(0, 0, app.viewport_width, app.viewport_height)
        for (let i = 0; i < app.tanks.length; i++) {
            app.tanks[i].redraw()
        }
        requestAnimationFrame(app.start)
    }
}