import {Canvas} from "./canvas";

export class GameCanvas {

    private blockSize = 2;
    public boardWidth = 10;
    public boardHeight = 20;
    public board: GameBoard;
    private slotIndexes: number[] = [0, 1, 2, 3, 4, 5, 6];

    constructor() {
        this.reset();

        /*        require(['libs/keyboard.js'], (keyboardJS) => {
                    var leftDown = false;
                    var rightDown = false;
                    var downDown = false;
                    var upDown = false;
                    var enterDown = false;

                    keyboardJS.bind('left', (e) => {
                        if (leftDown)return;
                        leftDown = true;
                        this.moveLeft();
                    }, (e) => leftDown = false);

                    keyboardJS.bind('right', (e) => {
                        if (rightDown)return;
                        rightDown = true;
                        this.moveRight();
                    }, (e) => rightDown = false);

                    keyboardJS.bind('enter', (e) => {
                        if (downDown)return;
                        downDown = true;
                        this.newPiece(true);
                    }, (e) => downDown = false);

                    keyboardJS.bind('down', (e) => {
                        if (upDown)return;
                        upDown = true;
                        this.moveDown();
                    }, (e) => upDown = false);
                    keyboardJS.bind('up', (e) => {
                        if (enterDown)return;
                        enterDown = true;
                        this.rotate();
                    }, (e) => enterDown = false);
                })*/
        ;

     }

    public rotate() {
        let origSlot = this.board.currentPiece.currentSlot;
        this.board.currentPiece.currentSlot = (this.board.currentPiece.currentSlot + 1) % 4;
        if (this.collidesWalls()) {
            this.board.currentPiece.currentSlot = origSlot;
            return false;
        }
        var fail = false;
        this.checkCollision(() => {
            this.board.currentPiece.currentSlot = origSlot;
            fail = true;
        });
        return !fail;
    }

    public moveDown() {
        this.board.currentPosition.y++;
        var fail = false;
        this.checkCollision(() => {
            this.board.currentPosition.y--;
            fail = true;
        });
        return !fail;

    }

    public moveRight() {
        this.board.currentPosition.x++;
        if (this.collidesWalls()) {
            this.board.currentPosition.x--;
            return false;
        } else {
            var fail = false;
            this.checkCollision(() => {
                this.board.currentPosition.x--;
                fail = true;
            });
            if (fail) return false;
        }
    }

    public moveLeft() {
        this.board.currentPosition.x--;
        if (this.collidesWalls()) {
            this.board.currentPosition.x++;
            return false;
        }
        else {
            var fail = false;
            this.checkCollision(() => {
                this.board.currentPosition.x++;
                fail = true;
            });
            if (fail) return false;
        }
        return true;
    }

    private reset() {
        this.board = new GameBoard();
        this.newPiece(false);
    }

    tick() {
        this.board.currentPosition.y++;

        this.checkCollision(() => {
            this.board.currentPosition.y--;
        });

    }

    private checkCollision(undoMove: () => void) {
        if (this.collides()) {
            undoMove();
            for (let y = -1; y < this.boardHeight + 1; y++) {
                for (let x = -1; x < this.boardWidth + 1; x++) {
                    if (this.board.currentPiece) {
                        if (this.board.currentPiece.slot[this.board.currentPosition.x - x] &&
                            this.board.currentPiece.slot[this.board.currentPosition.x - x][this.board.currentPosition.y - y]) {
                            this.board.slots[x][y] = this.board.currentPiece.gameSlot;
                        }
                    }
                }
            }


            this.newPiece(false);
        }
    }


    private collides() {
        for (let y = -1; y < this.boardHeight + 1; y++) {
            for (let x = -1; x < this.boardWidth + 1; x++) {
                let solid = false;
                if (y === this.boardHeight) {
                    solid = true;
                }
                if (this.board.slots[x] && (this.board.slots[x][y])) {
                    solid = true;
                }

                if (this.board.currentPiece) {

                    if (this.board.currentPiece.slot[this.board.currentPosition.x - x] &&
                        this.board.currentPiece.slot[this.board.currentPosition.x - x][this.board.currentPosition.y - y]) {
                        if (solid) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }


    private collidesWalls() {
        for (let y = -1; y < this.boardHeight + 1; y++) {
            for (let x = -1; x < this.boardWidth + 1; x++) {
                let solid = false;
                if (x === -1 || x === this.boardWidth) {
                    solid = true;
                }
                if (this.board.slots[x] && (this.board.slots[x][y])) {
                    solid = true;
                }

                if (this.board.currentPiece) {

                    if (this.board.currentPiece.slot[this.board.currentPosition.x - x] &&
                        this.board.currentPiece.slot[this.board.currentPosition.x - x][this.board.currentPosition.y - y]) {
                        if (solid) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }

    public newPiece(swap: boolean) {

        for (let y = this.boardHeight - 1; y >= 0; y--) {
            let bad = false;
            for (let x = 0; x < this.boardWidth; x++) {
                if (!this.board.slots[x][y]) {
                    bad = true;
                    break;
                }
            }
            if (!bad) {
                for (let _y = y; _y > 0; _y--) {
                    for (let x = 0; x < this.boardWidth; x++) {
                        this.board.slots[x][_y] = this.board.slots[x][_y - 1];
                    }
                }
                y++;
            }
        }

        if (swap) {

            if (this.board.swapPiece) {
                [this.board.currentPiece, this.board.swapPiece] = [this.board.swapPiece, this.board.currentPiece];
            } else {
                this.board.swapPiece = this.board.currentPiece;
                this.nextPiece();
            }

            this.board.currentPosition.x = 5;
            this.board.currentPosition.y = this.board.currentPiece.slot.length - 1;
            if (this.collides()) {
                this.reset();
            }


        } else {
            this.nextPiece();

            this.board.currentPosition.x = 5;
            this.board.currentPosition.y = this.board.currentPiece.slot.length - 1;
            if (this.collides()) {
                this.reset();
            }
        }
    }

    private nextPiece() {
        this.board.bagPiece++;
        if (this.board.bagPiece === 7) {
            this.board.bagPiece = 0;
            this.slotIndexes.sort((a, b) => Math.random() * 100 - 50);
            for (let i = 0; i < this.slotIndexes.length; i++) {
                let ind = this.slotIndexes[i];
                this.board.currentPieces[i] = GamePiece.pieces[this.slotIndexes[ind]];
                this.board.currentPieces[i].currentSlot = 0;
            }
        }
    }

    public render(c: Canvas): string {
        c.clear();
        for (let x = 0; x < 32; x += 2) {
            for (let y = 0; y < 64; y += 4) {
                c.set(x, y);
            }
        }

        for (let y = -1; y < this.boardHeight + 1; y++) {
            for (let x = -1; x < this.boardWidth + 1; x++) {
                let drawBlock = false;
                let on: boolean;
                if (x === -1 || x === this.boardWidth || y === -1 || y === this.boardHeight) {
                    on = true;
                    drawBlock = true;
                } else {
                    let slot: GameSlot;
                    if (this.board.slots[x] && (slot = this.board.slots[x][y])) {
                        on = true;
                        drawBlock = true;
                    }

                    if (this.board.currentPiece) {
                        if (this.board.currentPiece.slot[this.board.currentPosition.x - x] &&
                            this.board.currentPiece.slot[this.board.currentPosition.x - x][this.board.currentPosition.y - y]) {
                            slot = this.board.currentPiece.gameSlot;
                            on = true;
                            drawBlock = true;
                        }
                    }
                }

                if (drawBlock) {
                    if (!on) {
                        c.set((x + 1) * this.blockSize, (y + 1) * this.blockSize);
                        c.set((x + 1) * this.blockSize + 1, (y + 1) * this.blockSize);
                        c.set((x + 1) * this.blockSize, (y + 1) * this.blockSize + 1);
                        c.set((x + 1) * this.blockSize + 1, (y + 1) * this.blockSize + 1);
                    }
                    else {
                        for (let w = 0; w < this.blockSize; w++) {
                            for (let h = 0; h < this.blockSize; h++) {
                                c.set((x + 1) * this.blockSize + w, (y + 1) * this.blockSize + h)
                            }
                        }
                    }
                }
            }
        }
        return c.frame();
    }
}

export class GameBoard {
    bagPiece: number = 6;
    swapPiece: GamePiece;

    constructor() {
        this.slots = [];
        for (let x = 0; x < 10; x++) {
            this.slots[x] = [];
            for (let y = 0; y < 22; y++) {
                this.slots[x][y] = null;
            }
        }
    }

    slots: GameSlot[][];
    currentPieces: GamePiece[] = [];

    get currentPiece(): GamePiece {
        return this.currentPieces[this.bagPiece];
    }

    set currentPiece(value: GamePiece) {
        this.currentPieces[this.bagPiece] = value;
    }

    currentPosition: { x: number, y: number } = {x: 0, y: 0};
}

export class GameSlot {
    constructor(public color: string) {
    }
}

export class GamePiece implements IGamePiece {

    static pieces: GamePiece[] = [
        new GamePiece(new GameSlot('#FFD800'), [//orange L
            GamePiece.flip([
                [!!0, !!0, !!1],
                [!!1, !!1, !!1],
                [!!0, !!0, !!0],
            ]), GamePiece.flip([
                [!!0, !!1, !!0],
                [!!0, !!1, !!0],
                [!!0, !!1, !!1],
            ]), GamePiece.flip([
                [!!0, !!0, !!0],
                [!!1, !!1, !!1],
                [!!1, !!0, !!0],
            ]), GamePiece.flip([
                [!!1, !!1, !!0],
                [!!0, !!1, !!0],
                [!!0, !!1, !!0],
            ])
        ]),
        new GamePiece(new GameSlot('#0026FF'), [//blue L
            GamePiece.flip([
                [!!1, !!0, !!0],
                [!!1, !!1, !!1],
                [!!0, !!0, !!0],
            ]), GamePiece.flip([
                [!!0, !!1, !!1],
                [!!0, !!1, !!0],
                [!!0, !!1, !!0],
            ]), GamePiece.flip([
                [!!0, !!0, !!0],
                [!!1, !!1, !!1],
                [!!0, !!0, !!1],
            ]), GamePiece.flip([
                [!!0, !!1, !!0],
                [!!0, !!1, !!0],
                [!!1, !!1, !!0],
            ])
        ]),
        new GamePiece(new GameSlot('#FFE97F'), [//yellow square
            ([
                [!!0, !!1, !!1, !!0],
                [!!0, !!1, !!1, !!0],
                [!!0, !!0, !!0, !!0]
            ]), ([
                [!!0, !!1, !!1, !!0],
                [!!0, !!1, !!1, !!0],
                [!!0, !!0, !!0, !!0]
            ]), ([
                [!!0, !!1, !!1, !!0],
                [!!0, !!1, !!1, !!0],
                [!!0, !!0, !!0, !!0]
            ]), ([
                [!!0, !!1, !!1, !!0],
                [!!0, !!1, !!1, !!0],
                [!!0, !!0, !!0, !!0]
            ])
        ]),
        new GamePiece(new GameSlot('#00FF21'), [//green s
            GamePiece.flip([
                [!!0, !!1, !!1],
                [!!1, !!1, !!0],
                [!!0, !!0, !!0],
            ]), GamePiece.flip([
                [!!0, !!1, !!0],
                [!!0, !!1, !!1],
                [!!0, !!0, !!1],
            ]), GamePiece.flip([
                [!!0, !!0, !!0],
                [!!0, !!1, !!1],
                [!!1, !!1, !!0],
            ]), GamePiece.flip([
                [!!1, !!0, !!0],
                [!!1, !!1, !!0],
                [!!0, !!1, !!0],
            ])
        ]),
        new GamePiece(new GameSlot('#FF0000'), [//red s
            GamePiece.flip([
                [!!1, !!1, !!0],
                [!!0, !!1, !!1],
                [!!0, !!0, !!0],
            ]), GamePiece.flip([
                [!!0, !!0, !!1],
                [!!0, !!1, !!1],
                [!!0, !!1, !!0],
            ]), GamePiece.flip([
                [!!0, !!0, !!0],
                [!!1, !!1, !!0],
                [!!0, !!1, !!1],
            ]), GamePiece.flip([
                [!!1, !!0, !!0],
                [!!1, !!1, !!0],
                [!!0, !!1, !!0],
            ])
        ]),
        new GamePiece(new GameSlot('#00FFFF'), [//cyan l
            GamePiece.flip([
                [!!0, !!0, !!0, !!0],
                [!!1, !!1, !!1, !!1],
                [!!0, !!0, !!0, !!0],
                [!!0, !!0, !!0, !!0],
            ]), GamePiece.flip([
                [!!0, !!0, !!1, !!0],
                [!!0, !!0, !!1, !!0],
                [!!0, !!0, !!1, !!0],
                [!!0, !!0, !!1, !!0],
            ]), GamePiece.flip([
                [!!0, !!0, !!0, !!0],
                [!!0, !!0, !!0, !!0],
                [!!1, !!1, !!1, !!1],
                [!!0, !!0, !!0, !!0],
            ]), GamePiece.flip([
                [!!0, !!1, !!0, !!0],
                [!!0, !!1, !!0, !!0],
                [!!0, !!1, !!0, !!0],
                [!!0, !!1, !!0, !!0],
            ])
        ])
        ,
        new GamePiece(new GameSlot('#B200FF'), [//purple t
            GamePiece.flip([
                [!!0, !!1, !!0],
                [!!1, !!1, !!1],
                [!!0, !!0, !!0],
            ]), GamePiece.flip([
                [!!0, !!1, !!0],
                [!!0, !!1, !!1],
                [!!0, !!1, !!0],
            ]), GamePiece.flip([
                [!!0, !!0, !!0],
                [!!1, !!1, !!1],
                [!!0, !!1, !!0],
            ]), GamePiece.flip([
                [!!0, !!1, !!0],
                [!!1, !!1, !!0],
                [!!0, !!1, !!0],
            ])
        ])

    ];

    private static flip(box: boolean[][]): boolean[][] {
        var bbox: boolean[][] = [];
        for (var x = 0; x < box.length; x++) {
            bbox[x] = [];
        }

        for (var x = 0; x < box.length; x++) {
            for (var y = 0; y < box[x].length; y++) {
                bbox[x][y] = box[y][x];
            }
        }
        return bbox;

    }

    public currentSlot: number = 0;

    constructor(public gameSlot: GameSlot, public slots: boolean[][][]) {
    }

    public get slot(): boolean[][] {
        return this.slots[this.currentSlot];
    }

    public set slot(piece: boolean[][]) {
        throw new Error("Cannot set slot.");
    }

    public get color(): string {
        return this.gameSlot.color;
    }

    public set color(color: string) {
        throw new Error("Cannot set color.");
    }
}

export class GameInstance implements IGameInstance {
    get boardHeight(): number {
        return this.gameCanvas.boardHeight;
    }

    get boardWidth(): number {
        return this.gameCanvas.boardWidth;
    }

    constructor(private gameCanvas: GameCanvas) {
    }


    moveLeft(): boolean {
        var okay = this.gameCanvas.moveLeft();
        return okay;
    }

    isBlocked(x: number, y: number): boolean {
        return !!this.gameCanvas.board.slots[x][y];
    }

    isOnBoard(x: number, y: number): boolean {
        return x >= 0 && x < this.boardWidth && y >= 0 && y < this.boardHeight;
    }

    swap(): void {
        this.gameCanvas.newPiece(true);
    }

    drop(): void {
        while (this.gameCanvas.moveDown()) ;
    }

    getPiece(index: number): IGamePiece {
        return this.gameCanvas.board.currentPieces[this.gameCanvas.board.bagPiece + index];
    }

    getCurrentPiece(): IGamePiece {
        return this.getPiece(0);
    }

    clone(): GameSlot[][] {
        return this.gameCanvas.board.slots.map(a => a.map(b => b));
    }

    getPosition(): { x: number, y: number, width: number, height: number } {
        let pos = {x: 0, y: 0, width: 0, height: 0};

        let lowestX = 100;
        let lowestY = 100;
        let highestX = 0;
        let highestY = 0;

        let currentPiece = this.gameCanvas.board.currentPiece;
        let slot = currentPiece.slot;
        let px = this.gameCanvas.board.currentPosition.x;
        let py = this.gameCanvas.board.currentPosition.y;

        for (let y = -1; y < this.boardHeight + 1; y++) {
            for (let x = -1; x < this.boardWidth + 1; x++) {
                if (currentPiece) {
                    if (slot[px - x] &&
                        slot[px - x][py - y]) {
                        if (lowestX > x) lowestX = x;
                        if (lowestY > y) lowestY = y;
                        if (highestX < x) highestX = x;
                        if (highestY < y) highestY = y;
                    }
                }
            }
        }

        pos.x = lowestX;
        pos.y = lowestY;

        pos.width = highestX - lowestX;
        pos.height = highestY - lowestY;
        return pos;
    }

    getSwap(): IGamePiece {
        return this.gameCanvas.board.swapPiece;
    }


    moveRight(): boolean {
        var okay = this.gameCanvas.moveRight();
        return okay;
    }

    moveDown(): boolean {
        var okay = this.gameCanvas.moveDown();
        return okay;
    }

    rotate(): boolean {
        var okay = this.gameCanvas.rotate();
        return okay;
    }

    getRotation(): PieceRotation {
        return <PieceRotation>this.gameCanvas.board.currentPiece.currentSlot;
    }

}

interface IGameInstance {
    moveLeft(): boolean;

    isBlocked(x: number, y: number): boolean;

    isOnBoard(x: number, y: number): boolean;

    swap(): void;

    getPiece(index: number): IGamePiece;

    getSwap(): IGamePiece;

    moveRight(): boolean;

    moveDown(): boolean;

    rotate(): boolean;

    drop(): void;

    getRotation(): PieceRotation;

    getCurrentPiece(): IGamePiece;

    getPosition(): { x: number, y: number, width: number, height: number };

    boardHeight: number;
    boardWidth: number;

}

interface IGamePiece {
    slot: boolean[][];
    color: string;
}

declare enum PieceRotation {
    _0, _90, _180, _270
}


