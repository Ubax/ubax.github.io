class Ball {
    constructor(alpha, line, mass) {
        this._alpha = (alpha / 180.0) * Math.PI;
        this._line = line;
        this._mass = mass;
    }
    get x() {
        return this._line * Math.sin(this.alpha);
    }
    get y() {
        return -this._line * Math.cos(this.alpha);
    }
    get mass() {
        return this._mass;
    }
    get alpha() {
        return this._alpha;
    }
    get line() {
        return this._line;
    }
    set alpha(new_alpha) {
        this._alpha = new_alpha;
    }
    set line(new_line) {
        this._line = new_line;
    }
}
const GRAVITY = 9.81;
class Value {
    constructor(value) {
        this._value = value;
    }
    set value(new_value) {
        this._value = Number(new_value);
    }
    get value() {
        return this._value;
    }
}
class Simulation {
    constructor(ball1, ball2) {
        this.p1 = 0;
        this.p2 = 0;
        this._ball1 = ball1;
        this._ball2 = ball2;
    }
    get ball1() {
        return this._ball1;
    }
    get ball2() {
        return this._ball2;
    }
    step(tau) {
        let f1 = (alpha1, alpha2, p1, p2) => {
            var num11 = p1 - p2 * Math.cos(alpha1 - alpha2);
            var den11 = this._ball1.mass * this._ball1.line * this._ball1.line * (1 + (this._ball2.mass / this._ball1.mass) * Math.sin(alpha1 - alpha2) * Math.sin(alpha1 - alpha2));
            var res1 = num11 / den11;
            return res1;
        };
        let f2 = (alpha1, alpha2, p1, p2) => {
            var num21 = p2 * (1 + (this._ball2.mass / this._ball1.mass)) - p1 * (this._ball2.mass / this._ball1.mass) * Math.cos(alpha1 - alpha2);
            var den21 = this._ball1.mass * this._ball1.line * this._ball1.line * (1 + (this._ball2.mass / this._ball1.mass) * Math.sin(alpha1 - alpha2) * Math.sin(alpha1 - alpha2));
            var res2 = num21 / den21;
            return res2;
        };
        let f3 = (alpha1, alpha2, p1, p2) => {
            var num31 = p1 * p2 * Math.sin(alpha1 - alpha2);
            var den31 = this._ball1.mass * this._ball1.line * this._ball1.line * (1 + (this._ball2.mass / this._ball1.mass) * Math.pow(Math.sin(alpha1 - alpha2), 2));
            var a1 = num31 / den31;
            var num32 = (p1 * p1 * (this._ball2.mass / this._ball1.mass) - 2 * p1 * p2 * (this._ball2.mass / this._ball1.mass) * Math.cos(alpha1 - alpha2) + p2 * p2 * (1 + (this._ball2.mass / this._ball1.mass))) * Math.sin(2 * (alpha1 - alpha2));
            var den32 = 2 * this._ball1.mass * this._ball1.line * this._ball1.line * Math.pow((1 + (this._ball2.mass / this._ball1.mass) * Math.sin(alpha1 - alpha2) * Math.sin(alpha1 - alpha2)), 2);
            var a2 = num32 / den32;
            var res3 = -this._ball1.mass * (1 + (this._ball2.mass / this._ball1.mass)) * GRAVITY * this._ball1.line * Math.sin(alpha1) - a1 + a2;
            return res3;
        };
        let f4 = (alpha1, alpha2, p1, p2) => {
            var num41 = p1 * p2 * Math.sin(alpha1 - alpha2);
            var den41 = this._ball1.mass * this._ball1.line * this._ball1.line * (1 + (this._ball2.mass / this._ball1.mass) * Math.pow(Math.sin(alpha1 - alpha2), 2));
            var a1 = num41 / den41;
            var num42 = (p1 * p1 * (this._ball2.mass / this._ball1.mass) - 2 * p1 * p2 * (this._ball2.mass / this._ball1.mass) * Math.cos(alpha1 - alpha2) + p2 * p2 * (1 + (this._ball2.mass / this._ball1.mass))) * Math.sin(2 * (alpha1 - alpha2));
            var den42 = 2 * this._ball1.mass * this._ball1.line * this._ball1.line * Math.pow((1 + (this._ball2.mass / this._ball1.mass) * Math.sin(alpha1 - alpha2) * Math.sin(alpha1 - alpha2)), 2);
            var a2 = num42 / den42;
            var res4 = -this._ball1.mass * (this._ball2.mass / this._ball1.mass) * GRAVITY * this._ball1.line * Math.sin(alpha2) + a1 - a2;
            return res4;
        };
        var k1 = new Array();
        var k2 = new Array();
        var k3 = new Array();
        var k4 = new Array();
        k1[0] = f1(this._ball1.alpha, this._ball2.alpha, this.p1, this.p2) * tau;
        k1[1] = f2(this._ball1.alpha, this._ball2.alpha, this.p1, this.p2) * tau;
        k1[2] = f3(this._ball1.alpha, this._ball2.alpha, this.p1, this.p2) * tau;
        k1[3] = f4(this._ball1.alpha, this._ball2.alpha, this.p1, this.p2) * tau;
        k2[0] = f1(this._ball1.alpha + 1 / 2 * k1[0], this._ball2.alpha + 1 / 2 * k1[1], this.p1 + 1 / 2 * k1[2], this.p2 + 1 / 2 * k1[3]) * tau;
        k2[1] = f2(this._ball1.alpha + 1 / 2 * k1[0], this._ball2.alpha + 1 / 2 * k1[1], this.p1 + 1 / 2 * k1[2], this.p2 + 1 / 2 * k1[3]) * tau;
        k2[2] = f3(this._ball1.alpha + 1 / 2 * k1[0], this._ball2.alpha + 1 / 2 * k1[1], this.p1 + 1 / 2 * k1[2], this.p2 + 1 / 2 * k1[3]) * tau;
        k2[3] = f4(this._ball1.alpha + 1 / 2 * k1[0], this._ball2.alpha + 1 / 2 * k1[1], this.p1 + 1 / 2 * k1[2], this.p2 + 1 / 2 * k1[3]) * tau;
        k3[0] = f1(this._ball1.alpha + 1 / 2 * k2[0], this._ball2.alpha + 1 / 2 * k2[1], this.p1 + 1 / 2 * k2[2], this.p2 + 1 / 2 * k2[3]) * tau;
        k3[1] = f2(this._ball1.alpha + 1 / 2 * k2[0], this._ball2.alpha + 1 / 2 * k2[1], this.p1 + 1 / 2 * k2[2], this.p2 + 1 / 2 * k2[3]) * tau;
        k3[2] = f3(this._ball1.alpha + 1 / 2 * k2[0], this._ball2.alpha + 1 / 2 * k2[1], this.p1 + 1 / 2 * k2[2], this.p2 + 1 / 2 * k2[3]) * tau;
        k3[3] = f4(this._ball1.alpha + 1 / 2 * k2[0], this._ball2.alpha + 1 / 2 * k2[1], this.p1 + 1 / 2 * k2[2], this.p2 + 1 / 2 * k2[3]) * tau;
        k4[0] = f1(this._ball1.alpha + k3[0], this._ball2.alpha + k3[1], this.p1 + k3[2], this.p2 + k3[3]) * tau;
        k4[1] = f2(this._ball1.alpha + k3[0], this._ball2.alpha + k3[1], this.p1 + k3[2], this.p2 + k3[3]) * tau;
        k4[2] = f3(this._ball1.alpha + k3[0], this._ball2.alpha + k3[1], this.p1 + k3[2], this.p2 + k3[3]) * tau;
        k4[3] = f4(this._ball1.alpha + k3[0], this._ball2.alpha + k3[1], this.p1 + k3[2], this.p2 + k3[3]) * tau;
        this._ball1.alpha = this._ball1.alpha + 1 / 6 * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]);
        this._ball2.alpha = this._ball2.alpha + 1 / 6 * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]);
        this.p1 = this.p1 + 1 / 6 * (k1[2] + 2 * k2[2] + 2 * k3[2] + k4[2]);
        this.p2 = this.p2 + 1 / 6 * (k1[3] + 2 * k2[3] + 2 * k3[3] + k4[3]);
    }
    draw(canvasGraphId, canvasBallsId) {
        const hx = 400;
        const canvasGraph = document.getElementById(canvasGraphId);
        let contextGraph = canvasGraph.getContext("2d");
        const canvasBalls = document.getElementById(canvasBallsId);
        let contextBalls = canvasBalls.getContext("2d");
        contextBalls.fillStyle = "rgba(0,0,0,0)";
        contextBalls.clearRect(0, 0, canvasBalls.width, canvasBalls.height);
        contextBalls.fillStyle = "rgb(0,0,0)";
        contextBalls.beginPath();
        contextBalls.moveTo(hx, 0);
        contextBalls.lineTo(hx + this.ball1.x, -this.ball1.y);
        contextBalls.lineTo(hx + this.ball1.x + this.ball2.x, -this.ball1.y - this.ball2.y);
        contextBalls.stroke();
        contextBalls.closePath();
        contextBalls.beginPath();
        contextBalls.arc(hx + this.ball1.x, -this.ball1.y, this.ball1.mass, 0, 2 * Math.PI);
        contextBalls.fill();
        contextBalls.beginPath();
        contextBalls.arc(hx + this.ball1.x + this.ball2.x, -this.ball1.y - this.ball2.y, this.ball2.mass, 0, 2 * Math.PI);
        contextBalls.fill();
        contextBalls.closePath();
        contextGraph.fillRect(hx + this.ball1.x + this.ball2.x, -this.ball1.y - this.ball2.y, 2, 2);
    }
    stepAndDraw(tau, canvasGraphId, canvasBallsId) {
        this.step(tau);
        this.draw(canvasGraphId, canvasBallsId);
    }
}
