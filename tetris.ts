import {Canvas} from "./canvas";
import {GamePiece, GameSlot, IGamePiece} from "./gamePiece";
import {GameBoard} from "./gameBoard";

export class GameCanvas {

    private blockSize = 2;
    public boardWidth = 10;
    public boardHeight = 18;
    public board: GameBoard;

    constructor() {
        this.reset();
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
                this.board.linesCleared++;
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
                this.board.nextPiece();
            }

            this.board.currentPosition.x = 5;
            this.board.currentPosition.y = this.board.currentPiece.slot.length - 1;
            if (this.collides()) {
                this.reset();
            }


        } else {
            this.board.nextPiece();

            this.board.currentPosition.x = 5;
            this.board.currentPosition.y = this.board.currentPiece.slot.length - 1;
            if (this.collides()) {
                this.reset();
            }
        }
    }


    public render(c: Canvas): string {
        c.clear();
        for (let x = 0; x < (this.boardWidth + 2) * this.blockSize; x += 2) {
            for (let y = 0; y < c.height; y += 4) {
                c.set(x, y);
            }
        }

        for (let y = 0; y < this.boardHeight; y++) {
            for (let x = -1; x < this.boardWidth + 1; x++) {
                let drawBlock = false;
                let on: boolean;
                if (x === -1 || x === this.boardWidth) {
                    on = false;
                    drawBlock = true;
                } else {
                    if (this.board.slots[x] && this.board.slots[x][y]) {
                        on = true;
                        drawBlock = true;
                    }

                    if (this.board.currentPiece) {
                        if (this.board.getPiece(0).slot[this.board.currentPosition.x - x] &&
                            this.board.getPiece(0).slot[this.board.currentPosition.x - x][this.board.currentPosition.y - y]) {
                            on = true;
                            drawBlock = true;
                        }
                    }
                }

                if (drawBlock) {
                    if (!on) {
                        c.set((x + 1) * this.blockSize, (y) * this.blockSize);
                        c.set((x + 1) * this.blockSize + 1, (y) * this.blockSize);
                        c.set((x + 1) * this.blockSize, (y) * this.blockSize + 1);
                        c.set((x + 1) * this.blockSize + 1, (y) * this.blockSize + 1);
                    }
                    else {
                        for (let w = 0; w < this.blockSize; w++) {
                            for (let h = 0; h < this.blockSize; h++) {
                                c.set((x + 1) * this.blockSize + w, (y) * this.blockSize + h)
                            }
                        }
                    }
                }
            }
        }

        let piece = this.board.getPiece(1).slots[1];
        let offset = this.board.getPiece(1).color === '#FFE97F' ? 3 : 2;
        for (let y = 0; y < 4; y++) {
            for (let x = 0; x < 4; x++) {
                let on = false;
                if (piece[x] &&
                    piece[x][y]) {
                    on = true;
                }
                if(x===0){
                    c.set((this.boardWidth + offset) * this.blockSize + (x) * this.blockSize, this.blockSize * 2 + (y) * this.blockSize)
                }
                if (on) {
                    for (let w = 0; w < this.blockSize; w++) {
                        for (let h = 0; h < this.blockSize; h++) {
                            c.set((this.boardWidth + offset) * this.blockSize + (x) * this.blockSize + w, this.blockSize * 2 + (y) * this.blockSize + h)
                        }
                    }
                }
            }
        }


        return c.frame().replace(/⠀/g, '');
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
        return this.gameCanvas.board.getPiece(index);
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

declare enum PieceRotation {
    _0, _90, _180, _270
}


