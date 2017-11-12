
export class GameSlot {
    constructor(public color: string) {
    }
}

export interface IGamePiece {
    slot: boolean[][];
    color: string;
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
