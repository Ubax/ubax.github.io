var FieldType;
(function (FieldType) {
    FieldType[FieldType["Empty"] = 0] = "Empty";
    FieldType[FieldType["Wolf"] = 1] = "Wolf";
    FieldType[FieldType["Rabbit"] = 2] = "Rabbit";
})(FieldType || (FieldType = {}));
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
class DataRecord {
    constructor() {
        this._numberOfRabbits = 0;
        this._numberOfWolves = 0;
    }
    addRabbit() {
        this._numberOfRabbits++;
    }
    addWolf() {
        this._numberOfWolves++;
    }
    get numberOfWolves() {
        return this._numberOfWolves;
    }
    get numberOfRabbits() {
        return this._numberOfRabbits;
    }
}
class DataSet {
    constructor() {
        this.state = [];
    }
    addNewRecord() {
        this.state.push(new DataRecord());
    }
    addRabbit() {
        this.state[this.state.length - 1].addRabbit();
    }
    addWolf() {
        this.state[this.state.length - 1].addWolf();
    }
    get max() {
        let max = 0;
        this.state.forEach(x => max = Math.max(max, x.numberOfRabbits, x.numberOfWolves));
        return max;
    }
    get size() {
        return this.state.length;
    }
    getRecord(i) {
        return this.state[this.state.length - 1 - i];
    }
}
class Symulation {
    constructor(width, height, wolfEatRatio, wolfWalkRatio, rabbitBirthRatio, rabbitApperance, wolfApperance, rectSize = 2) {
        this.width = width;
        this.height = height;
        if (wolfApperance + rabbitApperance >= 1)
            throw new Error("wolfApperance + rabbitApperance should be less than 1");
        this.wolfEatRatio = wolfEatRatio;
        this.wolfWalkRatio = wolfWalkRatio;
        this.rabbitBirthRatio = rabbitBirthRatio;
        this.rabbitApperance = rabbitApperance;
        this.wolfApperance = wolfApperance;
        this.rectSize = rectSize;
        this.initData();
    }
    initData() {
        this.dataHistory = new DataSet();
        this.data = Array.from({ length: this.width + 2 }, (_, x) => Array.from({ length: this.height + 2 }, (_, y) => {
            let chance = Math.random();
            if (chance < this.rabbitApperance)
                return FieldType.Rabbit;
            else if (chance < this.wolfApperance + this.rabbitApperance)
                return FieldType.Wolf;
            return FieldType.Empty;
        }));
        this.newData = Array.from({ length: this.width + 2 }, (_, i) => [...this.data[i]]);
    }
    randomNeibourg() {
        return Math.round(Math.random() * 2 - 1);
    }
    simulateForField(x, y) {
        let neibourghX = this.randomNeibourg();
        let neibourghY = this.randomNeibourg();
        if (this.data[x][y] == FieldType.Wolf) {
            this.dataHistory.addWolf();
            if (this.data[x + neibourghX][y + neibourghY] == FieldType.Rabbit) {
                if (Math.random() < this.wolfEatRatio)
                    this.newData[x + neibourghX][y + neibourghY] = FieldType.Wolf;
            }
            if (this.data[x + neibourghX][y + neibourghY] == FieldType.Empty) {
                if (Math.random() < this.wolfWalkRatio) {
                    this.newData[x][y] = FieldType.Empty;
                    this.newData[x + neibourghX][y + neibourghY] = FieldType.Wolf;
                }
            }
        }
        if (this.data[x][y] == FieldType.Rabbit) {
            this.dataHistory.addRabbit();
            if (this.data[x + neibourghX][y + neibourghY] == FieldType.Empty) {
                if (Math.random() < this.rabbitBirthRatio)
                    this.newData[x + neibourghX][y + neibourghY] = FieldType.Rabbit;
            }
        }
    }
    saveData() {
        for (let x = 1; x <= this.width; x++) {
            for (let y = 1; y <= this.height; y++) {
                this.data[x][y] = this.newData[x][y];
            }
        }
    }
    step() {
        this.dataHistory.addNewRecord();
        for (let x = 1; x <= this.width; x++) {
            for (let y = 1; y <= this.height; y++) {
                this.simulateForField(x, y);
            }
        }
        this.saveData();
    }
    draw(canvasFieldId) {
        const canvasField = document.getElementById(canvasFieldId);
        let contextField = canvasField.getContext("2d");
        contextField.fillStyle = "#0EAD69";
        contextField.fillRect(0, 0, canvasField.width, canvasField.height);
        for (let x = 1; x <= this.width; x++) {
            for (let y = 1; y <= this.height; y++) {
                if (this.data[x][y] == FieldType.Rabbit) {
                    contextField.fillStyle = "#F0F3F5";
                    contextField.fillRect((x - 1) * this.rectSize, (y - 1) * this.rectSize, this.rectSize, this.rectSize);
                }
                else if (this.data[x][y] == FieldType.Wolf) {
                    contextField.fillStyle = "#1C1B18";
                    contextField.fillRect((x - 1) * this.rectSize, (y - 1) * this.rectSize, this.rectSize, this.rectSize);
                }
            }
        }
    }
    drawGraph(canvasGraphId) {
        const canvas = document.getElementById(canvasGraphId);
        let context = canvas.getContext("2d");
        context.fillStyle = "#3BCEAC";
        context.fillRect(0, 0, canvas.width, canvas.height);
        let ratio = canvas.height / this.dataHistory.max;
        for (let i = 0; i < Math.min(this.dataHistory.size, canvas.width); i++) {
            context.fillStyle = "#F0F3F5";
            context.fillRect(canvas.width - i, canvas.height - this.dataHistory.getRecord(i).numberOfRabbits * ratio, 2, 2);
            context.fillStyle = "#1C1B18";
            context.fillRect(canvas.width - i, canvas.height - this.dataHistory.getRecord(i).numberOfWolves * ratio, 2, 2);
        }
    }
    printStats(wolvesNode, rabbitsNode) {
        wolvesNode.innerHTML = this.dataHistory.getRecord(0).numberOfWolves.toString();
        rabbitsNode.innerHTML = this.dataHistory.getRecord(0).numberOfRabbits.toString();
    }
}
