document.addEventListener('DOMContentLoaded', function () {
    "use strict";

    //Global Constants
    const t = 21;
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
            this.charge += this.recharge * (t / 1000);
            if (this.charge > 100) {
                this.charge = 100;
            }
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
    class Explosion extends gameObject {
        constructor(x, y) {
            super(x, y, 0);
            this.R = 10;
            this.coords = [[0, 0], [7, 3], [0, 8], [-7, 3], [-4, -6], [4, -6]];
            this.sequence = [[0, 1], [0, 2], [0, 3], [0, 4], [0, 5]];
            this.timer = 150;
        }

        update() {
            this.timer -= t;
        }
    }


    //*******objects examples
    let tank1 = new Tank(100, 100, Math.PI / 4);
    let tank2 = new Tank(300, 300, Math.PI / 4);
    let obstacle = new Obstacle(200, 200);
    let bullets = [];
    let explosions = [];

    //***** Draw objects
    let canvas = document.getElementById("canvas");
    let ctx = canvas.getContext("2d");

    function drawObject(object) {
        ctx.translate(object.x, object.y);
        ctx.rotate(object.angle);
        for (let i = 0; i < object.sequence.length; i++) {
            ctx.beginPath();
            let k1 = object.sequence[i][0];
            let k2 = object.sequence[i][1];
            let x1 = object.coords[k1][0];
            let y1 = object.coords[k1][1];
            let x2 = object.coords[k2][0];
            let y2 = object.coords[k2][1];

            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
        }
        ctx.rotate(-object.angle);
        ctx.translate(-object.x, -object.y);
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
    function playAudio(){
        var audio = document.createElement('audio');
        audio.src = '1.mp3';
        audio.style.display = "none";
        audio.autoplay = false;
        audio.onended = function(){
            audio.remove() //Remove when played.
        };
        document.body.appendChild(audio);
        audio.play();
    }
    function playAudio2(){
        var audio = document.createElement('audio');
        audio.src = 'gun19.wav';
        audio.style.display = "none";
        audio.autoplay = false;
        audio.onended = function(){
            audio.remove() //Remove when played.
        };
        document.body.appendChild(audio);
        audio.play();
    }
    function doKeyDown(evt) {
        switch (evt.keyCode) {
            case 32:
                tank1.fire = true;
                break;
            case 49:
                tank2.fire = true;
                break;
            case 38:
                tank1.v = 90;
                break;
            case 40:  /* Down arrow was pressed */
                tank1.v = -90;
                break;
            case 37:  /* Left arrow was pressed */
                tank1.om = -90 * Math.PI / 180;
                break;
            case 39:  /* Right arrow was pressed */
                tank1.om = +90 * Math.PI / 180;
                break;
            case 87:
                tank2.v = 90;
                break;
            case 83:
                tank2.v = -90;
                break;
            case 65:  /* Left arrow was pressed */
                tank2.om = -90 * Math.PI / 180;
                break;
            case 68:  /* Right arrow was pressed */
                tank2.om = +90 * Math.PI / 180;
                break;

        }
    }

    function keyUp(e) {
        switch (e.keyCode) {
            case 32:
                tank1.fire = false;
                break;
            case 49:
                tank2.fire = false;
                break;
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
            case 87:
                tank2.v = 0;
                break;
            case 83:  /* Down arrow was pressed */
                tank2.v = 0;
                break;
            case 65:  /* Left arrow was pressed */
                tank2.om = 0;
                break;
            case 68:  /* Right arrow was pressed */
                tank2.om = 0;
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
        tank2.update();

        if (tank1.fire && tank1.charge >= 100) {
            bullets.push(new Bullet(tank1.x + 30 * Math.cos(tank1.angle), tank1.y + 30 * Math.sin(tank1.angle), tank1.angle));
            playAudio2();
            tank1.charge = 0;
        }
        if (tank2.fire && tank2.charge >= 100) {
            bullets.push(new Bullet(tank2.x + 30 * Math.cos(tank2.angle), tank2.y + 30 * Math.sin(tank2.angle), tank2.angle));
            playAudio2();
            tank2.charge = 0;
        }

        if (ifObjectsConflict(tank1, obstacle)) {
            tank1.moveBack();
        }
        if (ifObjectsConflict(tank2, obstacle)) {
            tank2.moveBack();
        }
        if (ifObjectsConflict(tank1, tank2)) {
            tank1.moveBack();

        }
        if (ifObjectsConflict(tank1, tank2)) {
            tank2.moveBack();
        }

        if (tank1.x < tank1.R || tank1.x > WIDTH - tank1.R || tank1.y < tank1.R || tank1.y > HEIGHT - tank1.R) {
            tank1.moveBack();
        }
        if (tank2.x < tank2.R || tank2.x > WIDTH - tank2.R || tank2.y < tank2.R || tank2.y > HEIGHT - tank2.R) {
            tank2.moveBack();
        }

        for (let i = 0; i < bullets.length; i++) {
            if (bullets[i].x < bullets[i].R || bullets[i].x > WIDTH - bullets[i].R || bullets[i].y < bullets[i].R || bullets[i].y > HEIGHT - bullets[i].R) {
                bullets.splice(i, 1);
            }
        }
        for (let i = 0; i < bullets.length; i++) {
            if (ifObjectsConflict(bullets[i], tank1) || ifObjectsConflict(bullets[i], tank2)){
                explosions.push(new Explosion(bullets[i].x, bullets[i].y));
                playAudio2();
                bullets.splice(i, 1);

            }
        }

        drawObject(obstacle);
        drawObject(tank1);
        drawObject(tank2);
        for(let i = 0; i<explosions.length;i++){
            if(explosions[i].timer<=0){
                explosions.splice(i, 1);
            }
        }
        for (let i = 0; i < explosions.length; i++) {
            explosions[i].update();
            drawObject(explosions[i]);
        }

        for (let i = 0; i < bullets.length; i++) {
            bullets[i].update();
            drawObject(bullets[i]);
        }
    }

    setInterval(loopGame, t);

});
//hitpoints сделать и фрагменты взрыва
//удалить объект танка
//сделать score Для 2х танков