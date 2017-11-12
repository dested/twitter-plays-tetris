//original implementation by Bence Dányi <madbence@gmail.com>
//https://github.com/madbence/node-drawille

const map = [
    [0x1, 0x8],
    [0x2, 0x10],
    [0x4, 0x20],
    [0x40, 0x80]
];

export class Canvas {
    private _width: number;
    private _height: number;
    private content: Buffer;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
    }

    clear() {
        this.content.fill(0);
    }

    get width() {
        return this._width || 0;
    }

    set width(width: number) {
        width = Math.floor(width / 2) * 2;
        this._width = width;
        this.content = new Buffer(this.width * this.height / 8);
        this.content.fill(0);
    }


    get height() {
        return this._height || 0;
    }

    set height(height: number) {
        height = Math.floor(height / 4) * 4;
        this._height = height;
        this.content = new Buffer(this.width * this.height / 8);
        this.content.fill(0);
    }

    frame(delimiter: string = null): string {
        if (delimiter == null) {
            delimiter = '\n';
        }
        const result = [];
        for (let i = 0, j = 0; i < this.content.length; i++, j++) {
            if (j == this.width / 2) {
                result.push(delimiter);
                j = 0;
            }
            if (this.content[i] === 0) {
                result.push('⠀')
            } else {
                result.push(String.fromCharCode(0x2800 + this.content[i]))
            }
        }
        result.push(delimiter);
        return result.join('');
    }

    set(x: number, y: number) {
        if (!(x >= 0 && x < this.width && y >= 0 && y < this.height)) {
            return;
        }
        x = Math.floor(x);
        y = Math.floor(y);
        const nx = Math.floor(x / 2);
        const ny = Math.floor(y / 4);
        const coord = nx + this.width / 2 * ny;
        const mask = map[y % 4][x % 2];
        this.content[coord] |= mask;
    }
}

