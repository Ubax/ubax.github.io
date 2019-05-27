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
class Fraction {
    constructor(nominator, denominator) {
        this.numerator = nominator;
        this.denominator = denominator;
    }
    getValue() {
        return this.numerator / this.denominator;
    }
}
class Multiply {
    constructor(a, b) {
        this.a = a;
        this.b = b;
    }
    getValue() {
        return this.a * this.b;
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
    step(h) {
        let l2 = this.ball2.line;
        let l1 = this.ball1.line;
        let m1 = this.ball1.mass;
        let m2 = this.ball2.mass;
        let mu = m2 / m1;
        let rod = l1;
        const g = GRAVITY;
        let sqr = x => x * x;
        let A1 = (alpha1, alpha2, p1, p2) => new Fraction(p1 * p2 * Math.sin(alpha1 - alpha2), l1 * l2 * (m1 + m2 * sqr(Math.sin(alpha1 - alpha2)))).getValue();
        let A2 = (alpha1, alpha2, p1, p2) => new Fraction(new Multiply(sqr(p1) * sqr(l2) * m2 - 2 * p1 * p2 * m2 * l1 * l2 * Math.cos(alpha1 - alpha2) + sqr(p2) * sqr(l1) * (m1 + m2), Math.sin(2 * (alpha1 - alpha2))).getValue(), 2 * sqr(l1) * sqr(l2) * sqr(m1 + m2 * sqr(Math.sin(alpha1 - alpha2)))).getValue();
        let f1 = (alpha1, alpha2, p1, p2) => {
            return new Fraction(p1 * l2 - p2 * l1 * Math.cos(alpha1 - alpha2), sqr(l1) * l2 * (m1 + m2 * sqr(Math.sin(alpha1 - alpha2)))).getValue();
        };
        let f2 = (alpha1, alpha2, p1, p2) => {
            return new Fraction(p2 * (m1 + m2) * l1 - p1 * m2 * l2 * Math.cos(alpha1 - alpha2), m2 * l1 * sqr(l2) * (m1 + m2 * sqr(Math.sin(alpha1 - alpha2)))).getValue();
        };
        let f3 = (alpha1, alpha2, p1, p2) => {
            return -(m1 + m2) * GRAVITY * l1 * Math.sin(alpha1) - A1(alpha1, alpha2, p1, p2) + A2(alpha1, alpha2, p1, p2);
        };
        let f4 = (alpha1, alpha2, p1, p2) => {
            return -m2 * GRAVITY * l2 * Math.sin(alpha2) + A1(alpha1, alpha2, p1, p2) - A2(alpha1, alpha2, p1, p2);
        };
        var k1 = new Array();
        var k2 = new Array();
        var k3 = new Array();
        var k4 = new Array();
        k1[0] = f1(this.ball1.alpha, this.ball2.alpha, this.p1, this.p2) * h;
        k1[1] = f2(this.ball1.alpha, this.ball2.alpha, this.p1, this.p2) * h;
        k1[2] = f3(this.ball1.alpha, this.ball2.alpha, this.p1, this.p2) * h;
        k1[3] = f4(this.ball1.alpha, this.ball2.alpha, this.p1, this.p2) * h;
        k2[0] = f1(this.ball1.alpha + 1 / 2 * k1[0], this.ball2.alpha + 1 / 2 * k1[1], this.p1 + 1 / 2 * k1[2], this.p2 + 1 / 2 * k1[3]) * h;
        k2[1] = f2(this.ball1.alpha + 1 / 2 * k1[0], this.ball2.alpha + 1 / 2 * k1[1], this.p1 + 1 / 2 * k1[2], this.p2 + 1 / 2 * k1[3]) * h;
        k2[2] = f3(this.ball1.alpha + 1 / 2 * k1[0], this.ball2.alpha + 1 / 2 * k1[1], this.p1 + 1 / 2 * k1[2], this.p2 + 1 / 2 * k1[3]) * h;
        k2[3] = f4(this.ball1.alpha + 1 / 2 * k1[0], this.ball2.alpha + 1 / 2 * k1[1], this.p1 + 1 / 2 * k1[2], this.p2 + 1 / 2 * k1[3]) * h;
        k3[0] = f1(this.ball1.alpha + 1 / 2 * k2[0], this.ball2.alpha + 1 / 2 * k2[1], this.p1 + 1 / 2 * k2[2], this.p2 + 1 / 2 * k2[3]) * h;
        k3[1] = f2(this.ball1.alpha + 1 / 2 * k2[0], this.ball2.alpha + 1 / 2 * k2[1], this.p1 + 1 / 2 * k2[2], this.p2 + 1 / 2 * k2[3]) * h;
        k3[2] = f3(this.ball1.alpha + 1 / 2 * k2[0], this.ball2.alpha + 1 / 2 * k2[1], this.p1 + 1 / 2 * k2[2], this.p2 + 1 / 2 * k2[3]) * h;
        k3[3] = f4(this.ball1.alpha + 1 / 2 * k2[0], this.ball2.alpha + 1 / 2 * k2[1], this.p1 + 1 / 2 * k2[2], this.p2 + 1 / 2 * k2[3]) * h;
        k4[0] = f1(this.ball1.alpha + k3[0], this.ball2.alpha + k3[1], this.p1 + k3[2], this.p2 + k3[3]) * h;
        k4[1] = f2(this.ball1.alpha + k3[0], this.ball2.alpha + k3[1], this.p1 + k3[2], this.p2 + k3[3]) * h;
        k4[2] = f3(this.ball1.alpha + k3[0], this.ball2.alpha + k3[1], this.p1 + k3[2], this.p2 + k3[3]) * h;
        k4[3] = f4(this.ball1.alpha + k3[0], this.ball2.alpha + k3[1], this.p1 + k3[2], this.p2 + k3[3]) * h;
        this.ball1.alpha = this.ball1.alpha + 1 / 6 * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]);
        this.ball2.alpha = this.ball2.alpha + 1 / 6 * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]);
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
        contextGraph.fillStyle = "#A5E6BA";
        contextGraph.fillRect(hx + this.ball1.x + this.ball2.x, -this.ball1.y - this.ball2.y, 2, 2);
        contextGraph.fillStyle = "#4F345A";
        contextGraph.fillRect(hx + this.ball1.x, -this.ball1.y, 2, 2);
    }
    stepAndDraw(h, canvasGraphId, canvasBallsId) {
        this.step(h);
        this.draw(canvasGraphId, canvasBallsId);
    }
}
