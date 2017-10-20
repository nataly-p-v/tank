document.addEventListener('DOMContentLoaded', function () {
    "use strict";

    //Global Constants
    const t = 42;
    const WIDTH = 600;
    const HEIGHT = 400;

    // **** class Declaration *****
    class gameObject {
        constructor(x, y, angle) {
            this.x = x;
            this.y = y;
            this.angle = angle;
            this.R = 0;
            this.coords = [];
            this.sequence = [];
            this.hitPoints = 0;
        }
    }

    class movableObject extends gameObject {
        constructor(x, y, angle) {
            super(x, y, angle);
            this.v = 0;
            this.om = 0;
            this.sx = 0;
            this.sy = 0;
        }

        update() {
            let s = this.v * t / 1000;
            this.sx = s * Math.cos(this.angle);
            this.sy = s * Math.sin(this.angle);
            this.x += this.sx;
            this.y += this.sy;
            var phi = this.om * t / 1000;
            this.angle += phi;
        }

        moveBack() {
            this.x -= this.sx;
            this.y -= this.sy;
        }
    }
    class Tank extends movableObject {
        constructor(x, y, angle) {
            super(x, y, angle);
            this.R = 15;
            this.coords = [[-15, -10], [15, -10], [15, 10], [-15, 10], [5, 0], [30, 0]];
            this.sequence = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5]];
            this.hitPoints = 5;
            this.charge = 100;
            this.fire = false;
            this.recharge = 200;
        }

        update() {
            super.update();
            this.charge += 200 * (t / 1000);
        }
    }
    class Bullet extends movableObject {
        constructor(x, y, angle) {
            super(x, y, angle);
            this.R = 5;
            this.coords = [[-5, 0], [5, 0]];
            this.sequence = [[0, 1]];
            this.v = 200;
            this.damage = 1;
        }
    }
    class Fragment extends movableObject {
        constructor(x, y, angle) {
            super(x, y, angle);
        }
    }
    class Obstacle extends gameObject {
        constructor(x, y) {
            super(x, y, 0);
            this.R = 10;
            this.coords = [[10, -5], [10, 5], [5, 10], [-5, 10], [-10, 5], [-10, -5], [-5, -10], [5, -10]];
            this.sequence = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 0]];
        }
    }


    //*******objects examples
    let tank1 = new Tank(100, 100, Math.PI / 4);
    let obstacle = new Obstacle(200, 200);

    //***** Draw objects
    let canvas = document.getElementById("canvas");
    let ctx = canvas.getContext("2d");

    function drawObject(object) {

        for (let i = 0; i < object.sequence.length; i++) {
            ctx.beginPath();
            let k1 = object.sequence[i][0];
            let k2 = object.sequence[i][1];
            let x1 = object.coords[k1][0];
            let y1 = object.coords[k1][1];
            let xA = Math.round((x1) * Math.cos(object.angle) - (y1) * Math.sin(object.angle) + object.x);
            let yA = Math.round((x1) * Math.sin(object.angle) + (y1) * Math.cos(object.angle) + object.y);
            let x2 = object.coords[k2][0];
            let y2 = object.coords[k2][1];
            let xB = Math.round((x2) * Math.cos(object.angle) - (y2) * Math.sin(object.angle) + object.x);
            let yB = Math.round((x2) * Math.sin(object.angle) + (y2) * Math.cos(object.angle) + object.y);

            ctx.moveTo(xA, yA);
            ctx.lineTo(xB, yB);
            ctx.stroke();
        }

    }

    function getRandom(min, max) {
        return Math.random() * (max - min) + min;
    }

    function distances(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
    }

    function ifObjectsConflict(object1, object2) {
        let distance = distances(object1.x, object1.y, object2.x, object2.y);
        return distance < object1.R + object2.R;
    }

    function doKeyDown(evt) {
        switch (evt.keyCode) {
            case 38:
                tank1.v = 190;
                break;
            case 40:  /* Down arrow was pressed */
                tank1.v = -190;
                break;
            case 37:  /* Left arrow was pressed */
                tank1.om = -190 * Math.PI / 180;
                break;
            case 39:  /* Right arrow was pressed */
                tank1.om = +190 * Math.PI / 180;
                break;

        }
    }

    function keyUp(e) {
        switch (e.keyCode) {
            case 38:
                tank1.v = 0;
                break;
            case 40:  /* Down arrow was pressed */
                tank1.v = 0;
                break;
            case 37:  /* Left arrow was pressed */
                tank1.om = 0;
                break;
            case 39:  /* Right arrow was pressed */
                tank1.om = 0;
            break;
        }
    }

    window.addEventListener('keydown', doKeyDown, true);
    window.addEventListener('keyup', keyUp, true);

    function loopGame() {
        ctx.clearRect(0, 0, WIDTH, HEIGHT);
        ctx.beginPath();
        ctx.rect(0, 0, WIDTH, HEIGHT);
        ctx.closePath();
        ctx.stroke();

        tank1.update();
        drawObject(obstacle);
        drawObject(tank1);
        if (ifObjectsConflict(tank1, obstacle)) {
            tank1.moveBack();
        }
    }

    setInterval(loopGame, t);

});
//сделать поворот танка через rotate canvas