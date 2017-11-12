import {GamePiece, GameSlot, IGamePiece} from "./gamePiece";

export class GameBoard {
    bagPiece: number = 6;
    swapPiece: GamePiece;
    private slotIndexes: number[] = [0, 1, 2, 3, 4, 5, 6];

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

    public serialize() {
        return {
            bagPiece: this.bagPiece,
            slotIndexes: this.slotIndexes,
            slots: this.slots.map(a => a.map(b => !!b)),
            currentPosition: this.currentPosition,
            currentSlot: this.currentPiece.currentSlot
        }
    }

    public deserialize(data: {
        bagPiece: number,
        slotIndexes: number[],
        slots: boolean[][],
        currentPosition: { x: number, y: number },
        currentSlot: number
    }) {
        this.bagPiece = data.bagPiece;
        this.slotIndexes = data.slotIndexes;
        this.slots = data.slots.map(a => a.map(b => b ? new GameSlot('black') : null))
        this.currentPosition = data.currentPosition;
        for (let i = 0; i < this.slotIndexes.length; i++) {
            let ind = this.slotIndexes[i];
            this.currentPieces[i] = GamePiece.pieces[this.slotIndexes[ind]];
            this.currentPieces[i].currentSlot = 0;
        }
        this.currentPiece.currentSlot = data.currentSlot;
    }

    public nextPiece() {
        this.bagPiece++;
        if (this.bagPiece === 7) {
            this.bagPiece = 0;
            this.slotIndexes.sort((a, b) => Math.random() * 100 - 50);
            for (let i = 0; i < this.slotIndexes.length; i++) {
                let ind = this.slotIndexes[i];
                this.currentPieces[i] = GamePiece.pieces[this.slotIndexes[ind]];
                this.currentPieces[i].currentSlot = 0;
            }
        }
    }

    get currentPiece(): GamePiece {
        return this.currentPieces[this.bagPiece];
    }

    set currentPiece(value: GamePiece) {
        this.currentPieces[this.bagPiece] = value;
    }

    getPiece(index: number = 0): GamePiece {
        return this.currentPieces[(this.bagPiece + index) % (this.currentPieces.length)];
    }

    currentPosition: { x: number, y: number } = {x: 0, y: 0};
}
