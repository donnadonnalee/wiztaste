const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const html = fs.readFileSync('index.html', 'utf8');

const dom = new JSDOM(html, { runScripts: "dangerously" });
const window = dom.window;

// Wait for a short tick, then trigger a render
setTimeout(() => {
    try {
        if(window.game) {
            console.log("Game object found. Rendering...");
            window.game.canvas = { width: 400, height: 300 };
            window.game.ctx = {
                createLinearGradient: () => ({ addColorStop: () => {} }),
                fillStyle: '',
                fillRect: () => {},
                drawImage: () => {},
                beginPath: () => {},
                closePath: () => {},
                rect: () => {},
                moveTo: () => {},
                lineTo: () => {},
                fill: () => {},
                stroke: () => {},
                strokeRect: () => {},
                strokeStyle: '',
                lineWidth: 1
            };
            window.game.mCtx = window.game.ctx;
            
            // force un-loaded state
            window.assets = { wall: {loaded:false}, floor: {loaded:false}, ceiling: {loaded:false} };
            
            window.game.drawDungeon();
            console.log("Render completed without throwing in unloaded state.");

            window.assets = { wall: {loaded:true, img:{width: 100, height: 100}}, floor: {loaded:false}, ceiling: {loaded:false} };
            window.game.drawDungeon();
            console.log("Render completed without throwing in LOADED state.");
        } else {
            console.log("Game object not found.");
        }
    } catch(e) {
        console.error("RUNTIME ERROR:", e);
    }
}, 500);
