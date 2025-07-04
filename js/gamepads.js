let loopStarted = false;

window.addEventListener("gamepadconnected", (evt) => {
    addGamepad(evt.gamepad);
});
window.addEventListener("gamepaddisconnected", (evt) => {
    removeGamepad(evt.gamepad);
});

function addGamepad(gamepad) {
    const d = document.createElement("div");
    d.setAttribute("id", `controller${gamepad.index}`);

    const t = document.createElement("h1");
    t.textContent = `gamepad: ${gamepad.id}`;
    d.append(t);

    const b = document.createElement("ul");
    b.className = "buttons";
    gamepad.buttons.forEach((button, i) => {
        const e = document.createElement("li");
        e.className = "button";
        e.textContent = `Button ${i}`;
        b.append(e);
    });

    d.append(b);

    const a = document.createElement("div");
    a.className = "axes";

    gamepad.axes.forEach((axis, i) => {
        const wrapper = document.createElement("div");
        const label = document.createElement("span");
        label.innerText = i
        wrapper.appendChild(label)
        const p = document.createElement("progress");
        p.className = "axis";
        p.setAttribute("max", "2");
        p.setAttribute("value", "1");
        p.textContent = i;
        wrapper.appendChild(p)
        a.append(wrapper);
    });

    d.appendChild(a);

    // See https://github.com/luser/gamepadtest/blob/master/index.html
    const start = document.querySelector("#start");
    if (start) {
        start.style.display = "none";
    }

    document.body.append(d);
    if (!loopStarted) {
        requestAnimationFrame(updateStatus);
        loopStarted = true;
    }
}

function removeGamepad(gamepad) {
    document.querySelector(`#controller${gamepad.index}`).remove();
}

function updateStatus() {
    for (const gamepad of navigator.getGamepads()) {
        if (!gamepad) continue;

        const d = document.getElementById(`controller${gamepad.index}`);
        const buttonElements = d.getElementsByClassName("button");

        for (const [i, button] of gamepad.buttons.entries()) {
            const el = buttonElements[i];

            const pct = `${Math.round(button.value * 100)}%`;
            el.style.backgroundSize = `${pct} ${pct}`;
            if (button.pressed) {
                el.textContent = `Button ${i} [PRESSED]`;
                el.style.color = "#42f593";
                el.className = "button pressed";
            } else {
                el.textContent = `Button ${i}`;
                el.style.color = "#2e2d33";
                el.className = "button";
            }
        }

        const axisElements = d.getElementsByClassName("axis");
        for (const [i, axis] of gamepad.axes.entries()) {
            const el = axisElements[i];
            el.textContent = `${i}: ${axis.toFixed(4)}`;
            el.setAttribute("value", axis + 1);
        }
    }

    requestAnimationFrame(updateStatus);
}

const gamepadInfo = document.getElementById("gamepad-info");
const ball = document.getElementById("ball");
let start;
let a = 0;
let b = 0;


function gameLoop() {
    const gamepads = navigator.getGamepads();
    if (!gamepads) {
        return;
    }

    const gp = gamepads[0];
    if (gp.buttons[0].pressed) {
        b--;
    }
    if (gp.buttons[2].pressed) {
        b++;
    }
    if (gp.buttons[1].pressed) {
        a++;
    }
    if (gp.buttons[3].pressed) {
        a--;
    }
    if(gp.axes[0]!==0){
        a += gp.axes[0]
        console.log('a', a)
    }
    if(gp.axes[1]!==0){
        b += gp.axes[1]
        console.log('b', b)
    }

    ball.style.left = `${a * 2}px`;
    ball.style.top = `${b * 2}px`;

    start = requestAnimationFrame(gameLoop);
}

window.addEventListener("gamepaddisconnected", (e) => {
    gamepadInfo.textContent = "Waiting for gamepad.";

    cancelAnimationFrame(start);
});


window.addEventListener("gamepadconnected", (e) => {
    const gp = navigator.getGamepads()[e.gamepad.index];
    gamepadInfo.textContent = `Gamepad connected at index ${gp.index}: ${gp.id}. It has ${gp.buttons.length} buttons and ${gp.axes.length} axes.`;

    gameLoop();
});
