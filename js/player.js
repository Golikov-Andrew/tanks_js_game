class Player {
    constructor(app, title, color) {
        this.app = app
        this.title = title
        this.color = color
        this.tank = null
        this.view_changed_at = 0
        this.views = [
            'stage',
            'tank_1',
            'tank_2',
            'tower'
        ]
        this.current_view = this.views[0]
        this.team = null // Team
        this.points = 0
        this.monitor = new Monitor(this.app, this)
        this.target_tank = null
        this.view_radius_1 = 400
        this.controlled_object = null
    }

    set_tank(tank) {
        this.tank = tank
        tank.attach_to_player(this)
    }

    set_controlled_object(obj) {
        this.controlled_object = obj
        obj.attach_to_player(this)
    }

    attach_to_team(team) {
        this.team = team
    }

    switch_view(idx) {
        if (idx === undefined) {
            idx = this.views.indexOf(this.current_view)
            idx++
            if (idx >= this.views.length) idx = 0;
        }
        this.current_view = this.views[idx]

        if (this.current_view === 'stage') {
            this.monitor.viewport.width = this.app.stage.width
            this.monitor.viewport.height = this.app.stage.height
        } else {
            this.monitor.reset_scale()
        }
        console.log('change view', this.current_view)
        this.view_changed_at = Date.now()
        this.monitor.title_element.innerHTML = this.title + ' ' + this.current_view
    }
}

class Human extends Player {
    constructor(app, title, color, tank) {
        super(app, title, color);
        this.gamepad = null
        if (tank !== undefined) this.set_tank(tank)

    }

    set_gamepad(gamepad) {
        this.gamepad = gamepad
    }
}

class Bot extends Player {
    constructor(app, title, color, ai_level) {
        super(app, title, color);


        this.ai_level = ai_level // 1 - 5, very easy, easy, medium, strong, very strong
    }
}

class HumanModeling extends Human {
    constructor(app, title, color) {
        super(app, title, color);
        this.monitor = new MonitorModeling(this.app, this)
        this.sight = null
    }
}