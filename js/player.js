class Player{
    constructor(app, title){
        this.app = app
        this.title = title
        this.tank = null
        this.view_changed_at = 0
        this.views = [
            'stage',
            'tank',
            'tower'
        ]
        this.current_view = this.views[0]
        this.monitor = new Monitor(this.app, this)
    }
    set_tank(tank){
        this.tank = tank
    }
    switch_view(){
        let idx = this.views.indexOf(this.current_view)
        idx++
        if(idx >= this.views.length) idx = 0;
        this.current_view = this.views[idx]
        console.log('change view', this.current_view)
        this.view_changed_at = Date.now()
        this.monitor.dashboard.innerHTML = this.title + ' ' + this.current_view
    }
}

class Human extends Player{
    constructor(app, title, tank){
        super(app, title);
        this.gamepad = null
        if(tank !== undefined) this.set_tank(tank)

    }
    set_gamepad(gamepad){
        this.gamepad = gamepad
    }
}

class Bot extends Player{
    constructor(app, title, ai_level){
        super(app, title);

        this.ai_level = ai_level // 1 - 5, very easy, easy, medium, strong, very strong

    }
}