import {GameCanvas, GameInstance} from "./tetris";
import {Canvas} from "./canvas";
import config from "./config";


const twitterAPI = require('node-twitter-api');

const c = new Canvas(24, 44);
let gameCanvas = new GameCanvas();

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

let mentions: Action[] = [];

function getMentions() {
    twitter.getTimeline("mentions_timeline", null,
        config.accessToken,
        config.accessSecret,
        (error: string, data: { id_str: string, text: string }[]) => {
            if (error) {
                console.error(error);
            } else {
                for (let i = 0; i < data.length; i++) {
                    let d = data[i];
                    if (!mentions.find(a => a.id === d.id_str)) {
                        let go: Action = {id: d.id_str, resolved: false};
                        let text = d.text.toLowerCase();
                        if (text.indexOf('left')) {
                            go.moveLeft = true;
                        } else if (text.indexOf('right')) {
                            go.moveRight = true;
                        } else if (text.indexOf('rotate')) {
                            go.rotate = true;
                        } else if (text.indexOf('drop')) {
                            go.drop = true;
                        } else {
                            continue;
                        }
                        console.log('adding action ', go);
                        mentions.push(go);
                    }
                }
            }
        }
    );
}

setInterval(() => {
    console.log('getting mentions');
    getMentions();
}, 30 * 1000);
setInterval(() => {
    console.log('ticking');
    processTick();
}, 60 * 1000 * 5);

function processTick() {
    let actions = mentions.filter(a => !a.resolved);
    let moveRight = actions.reduce((a, b) => a + (b.moveRight ? 1 : 0), 0);
    let moveLeft = actions.reduce((a, b) => a + (b.moveLeft ? 1 : 0), 0);
    let rotate = actions.reduce((a, b) => a + (b.rotate ? 1 : 0), 0);
    let drop = actions.reduce((a, b) => a + (b.drop ? 1 : 0), 0);


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

    for (let i = 0; i < mentions.length; i++) {
        mentions[i].resolved = true;
    }

    console.clear();
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
                console.log(data);
            }
        }
    );
}

//https://twitter.com/TwtPlayTetris
