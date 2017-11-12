import {GameCanvas, GameInstance} from "./tetris";
import {Canvas} from "./canvas";
import config from "./config";


const twitterAPI = require('node-twitter-api');
const fs = require('fs');

const c = new Canvas(30, 36);
let gameCanvas = new GameCanvas();
let actions: Action[] = [];


if (fs.existsSync("game.json")) {
    let data = JSON.parse(fs.readFileSync("game.json", 'utf8'));
    gameCanvas.board.deserialize(data.board);
    actions = data.actions;
}

let instance = new GameInstance(gameCanvas);


const twitter = new twitterAPI({
    consumerKey: config.consumerKey,
    consumerSecret: config.consumerSecret,
});

interface Action {
    id: string,
    resolved: boolean,
    moveLeft?: boolean,
    moveRight?: boolean,
    rotate?: boolean,
    drop?: boolean
}


function getMentions() {
    return new Promise(res => {
        console.log('getting actions');
        twitter.getTimeline("mentions_timeline", null,
            config.accessToken,
            config.accessSecret,
            (error: string, data: { id_str: string, text: string }[]) => {
                if (error) {
                    console.error(error);
                } else {
                    for (let i = 0; i < data.length; i++) {
                        let d = data[i];
                        if (!actions.find(a => a.id === d.id_str)) {
                            let go: Action = {id: d.id_str, resolved: false};
                            let text = d.text.toLowerCase();
                            console.log(text);
                            if (text.indexOf('left')>=0) {
                                go.moveLeft = true;
                            } else if (text.indexOf('right')>=0) {
                                go.moveRight = true;
                            } else if (text.indexOf('rotate')>=0) {
                                go.rotate = true;
                            } else if (text.indexOf('drop')>=0) {
                                go.drop = true;
                            } else {
                                continue;
                            }
                            console.log('adding action ', go);
                            actions.push(go);
                        }
                    }
                    fs.writeFileSync("game.json", JSON.stringify({actions: actions, board: gameCanvas.board.serialize()}));
                }
                res();
            }
        );
    })
}

setInterval(() => {
    getMentions();
}, 30 * 1000);
setInterval(() => {
    getMentions().then(() => {
        processTick();
    })
}, 60 * 1000 * 1);
getMentions();
function processTick() {
    console.log('ticking');
    let unResolvedActions = actions.filter(a => !a.resolved);
    let moveRight = unResolvedActions.reduce((a, b) => a + (b.moveRight ? 1 : 0), 0);
    let moveLeft = unResolvedActions.reduce((a, b) => a + (b.moveLeft ? 1 : 0), 0);
    let rotate = unResolvedActions.reduce((a, b) => a + (b.rotate ? 1 : 0), 0);
    let drop = unResolvedActions.reduce((a, b) => a + (b.drop ? 1 : 0), 0);


    if (moveLeft > moveRight && moveLeft > drop && moveLeft > rotate) {
        instance.moveLeft();
        console.log('moving left');
    }
    if (moveRight > moveLeft && moveRight > drop && moveRight > rotate) {
        instance.moveRight();
        console.log('moving right');
    }
    if (drop > moveLeft && drop > moveRight && drop > rotate) {
        instance.drop();
        console.log('dropping');
    }
    if (rotate > moveLeft && rotate > moveRight && rotate > drop) {
        instance.rotate();
        console.log('rotate');
    }

    for (let i = 0; i < unResolvedActions.length; i++) {
        unResolvedActions[i].resolved = true;
    }

    gameCanvas.tick();
    let output = gameCanvas.render(c);
    process.stdout.write(output);
    twitter.statuses("update", {
            status: output
        },
        config.accessToken,
        config.accessSecret,
        (error: string, data: string) => {
            if (error) {
                console.error(error);
            } else {
                console.log('sent tweet');
            }
        }
    );
}

//https://twitter.com/TwtPlayTetris
