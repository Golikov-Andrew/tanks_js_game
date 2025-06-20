// parent - внешний объект, может быть только один
// children - дочерние объекты, может быть ноль и множество, словарь

// x, y - собственные координаты в контексте родителя.
// a - угол в контексте родителя. a = 0 - объект повёрнут вправо.
// width, height - габариты объекта

class Stage {
    constructor(app) {
        this.app = app
        this.width = 500
        this.height = 500
        this.tanks = []
    }

    add_tanks(tanks_list) {
        for (let i = 0; i < tanks_list.length; i++) {
            this.tanks.push(tanks_list[i])
        }
    }
}


class GameObject {
    constructor(app, parent) {
        this.app = app
        this.parent = parent
        this.children = {}
        this.collision_objects = []
    }

    add_child(key, child_obj) {
        this.children[key] = child_obj
    }

    redraw() {
        for (const key in this.children) {
            this.children[key].redraw()
        }
        if (this.app.debug_mode) {
            for (let i = 0; i < this.collision_objects.length; i++) {
                this.collision_objects[i].redraw()
            }
        }
    }
}

class CollisionSphere extends GameObject {
    constructor(app, parent, x, y, r) {
        super(app, parent);
        this.x = x
        this.y = y
        this.r = r
    }

    redraw() {
        this.app.ctx.save()
        this.app.ctx.beginPath()
        this.app.draw_circle(this.x, this.y, this.r)
        this.app.ctx.stroke()
        this.app.ctx.reset()

    }
}

class TankGun extends GameObject {
    constructor(app, tower) {
        super(app, tower);
    }

    redraw() {
        this.app.save()
        this.app.ctx.fillRect(5, 10, 20, 40)
        this.app.reset()

    }
}

class TankTower extends GameObject {
    constructor(app, tank) {
        super(app, tank);
        this.x = -40
        this.y = 25
        this.a = 0
        this.r = 25
        this.speed_a = 1
        this.collision_objects = [
            new CollisionSphere(25, 25, 25)
        ]
        this.children.gun = new TankGun(this.app, this)
    }

    redraw() {
        this.app.ctx.beginPath()
        this.app.draw_circle(0, 0, this.r)
        this.app.ctx.stroke()
        this.gun.redraw()
    }
}

class Tank extends GameObject {
    constructor(app, stage) {
        super(app, stage);

        this.width = 50
        this.length = 100
        this.x = 100
        this.y = 100
        this.a = 30
        this.speed = 1
        this.collision_objects = [
            new CollisionSphere(25, 25, 25),
            new CollisionSphere(25, 75, 25),
        ]
        this.children.tower = new TankTower(app, this)

    }

    redraw() {
        debugger;

        // this.app.ctx.save()
        // this.app.ctx.translate(this.x, this.y)
        // this.app.ctx.rotate(this.a)
        this.app.ctx.beginPath();
        this.app.ctx.strokeWidth = 2;
        this.app.ctx.strokStyle = '#000000';
        this.app.ctx.strokeRect(100, 200, 300, 400)
        this.app.ctx.strokeRect(-this.length / 2, -this.width / 2, this.length / 2, this.width / 2)
        this.app.ctx.closePath()
        this.app.ctx.stroke();
        // this.app.ctx.strokeRect(this.pivot_x - 5, this.parent_y, 10, 10)
        // this.tower.redraw()
        // this.app.ctx.reset()
    }
}