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
            this.angle += this.om * t / 1000;
            this.sx = s * Math.cos(this.angle);
            this.sy = s * Math.sin(this.angle);
            this.x += this.sx;
            this.y += this.sy;
        }

        moveBack() {
            this.x -= this.sx;
            this.y -= this.sy;
        }
    }
    class Tank extends movableObject {
        constructor(x, y, angle) {
            super(x, y, angle);
            this.R = 10;
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
            this.sequence = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5],[5, 6], [6, 7],[7, 0]];
        }
    }


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
    function loopGame(){
        ctx.clearRect(0, 0, WIDTH, HEIGHT);
        ctx.strokeStyle = "black";
        ctx.beginPath();
        ctx.rect(0, 0, WIDTH, HEIGHT);
        ctx.closePath();
        ctx.stroke();
    }
    setInterval(loopGame, t);
    //*******objects examples
    let tank1 = new Tank(100, 100, Math.PI/4);
    let bullet = new Bullet(150, 150, Math.PI/4);
    let obstacle = new Obstacle(200, 200);
    drawObject(tank1);
    drawObject(bullet);
    drawObject(obstacle);

});
//сделать функцию loop а в ней update Tank и управление игры