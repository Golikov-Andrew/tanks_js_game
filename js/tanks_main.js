const DEBUG_MODE = false

const app = new App(DEBUG_MODE)
const stage_1 = new Stage(app)
const tank = new Tank(app, stage_1)
stage_1.add_tanks([
    tank
])
app.set_stage(stage_1)
app.init()
app.frame(1000 / 60)