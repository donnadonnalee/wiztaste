/**
             * CONSTANTS & DATA
             */
const VIEW_DIST = 6;
const MAP_SIZE = 16;

const CLASSES = {
    WARRIOR: { name: '戦士', hp: 30, mp: 0, str: 15, int: 5, vit: 15, agi: 8, luk: 5 },
    THIEF: { name: '盗賊', hp: 20, mp: 0, str: 10, int: 8, vit: 8, agi: 15, luk: 15 },
    CLERIC: { name: '僧侶', hp: 22, mp: 12, str: 8, int: 12, vit: 10, agi: 10, luk: 10 },
    MAGE: { name: '魔術師', hp: 15, mp: 25, str: 5, int: 18, vit: 5, agi: 12, luk: 8 },
    SAMURAI: { name: '侍', hp: 25, mp: 5, str: 16, int: 8, vit: 12, agi: 14, luk: 8 },
    MONK: { name: '武闘家', hp: 28, mp: 5, str: 14, int: 6, vit: 14, agi: 16, luk: 6 },
    ARCHER: { name: '狩人', hp: 20, mp: 5, str: 12, int: 8, vit: 10, agi: 18, luk: 12 }
};

const ITEMS = [
    // Consumables (1-5)
    { id: 1, name: '傷薬', type: 'consumable', level: 1, hpRestore: 30, desc: 'HPを30回復' },
    { id: 2, name: '上傷薬', type: 'consumable', level: 4, hpRestore: 100, desc: 'HPを100回復' },
    { id: 3, name: '特大傷薬', type: 'consumable', level: 7, hpRestore: 300, desc: 'HPを300回復' },
    { id: 4, name: 'エリクサー', type: 'consumable', level: 10, hpRestore: 999, desc: 'HPを全回復' },

    // Weapons (10-25)
    { id: 10, name: 'ダガー', type: 'weapon', level: 1, atk: 3, desc: '軽い短剣(ATK+3)' },
    { id: 11, name: 'ショートソード', type: 'weapon', level: 2, atk: 5, req: { str: 5 }, desc: '小型の剣(ATK+5)' },
    { id: 12, name: '木の杖', type: 'weapon', level: 2, atk: 2, int: 5, req: { int: 8 }, desc: '詠唱を助ける(ATK+2, INT+5)' },
    { id: 13, name: 'メイス', type: 'weapon', level: 3, atk: 5, req: { str: 8 }, desc: '僧侶も使える(ATK+5)' },
    { id: 14, name: 'レイピア', type: 'weapon', level: 4, atk: 7, req: { agi: 10 }, desc: '細身の剣(ATK+7)' },
    { id: 15, name: 'ロングソード', type: 'weapon', level: 5, atk: 8, req: { str: 10 }, desc: '標準的な剣(ATK+8)' },
    { id: 16, name: '魔道士の杖', type: 'weapon', level: 5, atk: 4, int: 12, req: { int: 15 }, desc: '魔力帯びた杖(ATK+4, INT+12)' },
    { id: 17, name: 'モーニングスター', type: 'weapon', level: 6, atk: 12, req: { str: 12 }, desc: '棘付き鉄球(ATK+12)' },
    { id: 18, name: 'グラディウス', type: 'weapon', level: 7, atk: 13, req: { agi: 12 }, desc: '暗殺者の短剣(ATK+13)' },
    { id: 19, name: 'バトルアックス', type: 'weapon', level: 8, atk: 15, req: { str: 15 }, desc: '重い斧(ATK+15)' },
    { id: 20, name: 'グレートソード', type: 'weapon', level: 9, atk: 18, req: { str: 18 }, desc: '巨大な両手剣(ATK+18)' },
    { id: 21, name: 'フランベルジュ', type: 'weapon', level: 10, atk: 22, req: { str: 20 }, desc: '波打つ刀身(ATK+22)' },
    { id: 22, name: '大賢者の杖', type: 'weapon', level: 10, atk: 8, int: 25, req: { int: 25 }, desc: '世界樹の枝(ATK+8, INT+25)' },
    { id: 23, name: '妖刀ムラマサ', type: 'weapon', level: 10, atk: 35, agi: 15, req: { agi: 20 }, desc: '呪われし刀(ATK+35, AGI+15)' },
    { id: 24, name: 'エクスカリバー', type: 'weapon', level: 10, atk: 40, req: { str: 30 }, desc: '伝説の聖剣(ATK+40)' },

    // Armors (30-45)
    { id: 30, name: 'ローブ', type: 'armor', level: 1, def: 2, desc: '布の服(DEF+2)' },
    { id: 31, name: '旅人の服', type: 'armor', level: 2, def: 3, desc: '丈夫な服(DEF+3)' },
    { id: 32, name: 'レザーアーマー', type: 'armor', level: 3, def: 4, req: { str: 6 }, desc: '革の鎧(DEF+4)' },
    { id: 33, name: 'シルクのローブ', type: 'armor', level: 4, def: 5, int: 5, req: { int: 10 }, desc: '魔法の衣(DEF+5, INT+5)' },
    { id: 34, name: '盗賊の軽鎧', type: 'armor', level: 5, def: 6, agi: 5, req: { agi: 12 }, desc: '動きやすい(DEF+6, AGI+5)' },
    { id: 35, name: 'チェインメイル', type: 'armor', level: 6, def: 8, req: { str: 15 }, desc: '鎖帷子(DEF+8)' },
    { id: 36, name: 'スケイルメイル', type: 'armor', level: 7, def: 11, req: { str: 18 }, desc: '鱗の鎧(DEF+11)' },
    { id: 37, name: 'プレートメイル', type: 'armor', level: 8, def: 15, req: { str: 20 }, desc: '重装甲(DEF+15)' },
    { id: 38, name: 'ミスリルメイル', type: 'armor', level: 9, def: 20, req: { str: 15 }, desc: '軽く硬い(DEF+20)' },
    { id: 39, name: 'ドラゴンメイル', type: 'armor', level: 10, def: 28, req: { str: 25 }, desc: '竜の鱗で作られた(DEF+28)' },
    { id: 40, name: 'イージスの盾', type: 'armor', level: 10, def: 35, req: { str: 30 }, desc: '神話の盾(DEF+35)' },

    // Accessories (50-60)
    { id: 50, name: '力の腕輪', type: 'accessory', level: 3, atk: 3, desc: '攻撃力アップ(ATK+3)' },
    { id: 51, name: '守りの指輪', type: 'accessory', level: 3, def: 3, desc: '防御力アップ(DEF+3)' },
    { id: 52, name: '疾風の指輪', type: 'accessory', level: 5, agi: 5, desc: '素早さアップ(AGI+5)' },
    { id: 53, name: '賢者の石', type: 'accessory', level: 7, int: 10, desc: '魔力アップ(INT+10)' },
    { id: 54, name: '勇者の証', type: 'accessory', level: 9, atk: 5, def: 5, desc: '攻防アップ(ATK+5, DEF+5)' },
    { id: 55, name: '幸運の兎の足', type: 'accessory', level: 6, luk: 15, desc: '運気アップ(LUK+15)' },
    { id: 56, name: '女神の指輪', type: 'accessory', level: 10, def: 10, int: 5, desc: '加護(DEF+10, INT+5)' }
];

const ITEM_PREFIXES = [
    { name: '呪われた', mult: -1.0, weight: 5 },
    { name: 'ボロボロの', mult: 0.5, weight: 20 },
    { name: '', mult: 1.0, weight: 45 },
    { name: '上質の', mult: 1.5, weight: 20 },
    { name: '名工の', mult: 2.0, weight: 8 },
    { name: '聖なる', mult: 3.0, weight: 2 }
];

const MONSTER_NAMES = [
    'スライム', 'バット', 'スパイダー', 'スネーク', 'ゴブリン',
    'スケルトン', 'ファントム', 'オーガ', 'デーモン', 'ドラゴン',
    'ゾンビ', 'メイジ', 'ヴァンパイア', 'デーモンメイジ'
];

// HP, ATK, AGI multipliers by base monster to give them unique characteristics
const MONSTER_STATS_MULT = [
    { hp: 1.2, atk: 0.8, agi: 0.5 }, // 0: スライム (High HP, Low AGI)
    { hp: 0.6, atk: 0.8, agi: 1.5 }, // 1: バット (Low HP, High AGI)
    { hp: 0.8, atk: 1.0, agi: 1.2 }, // 2: スパイダー (Fast)
    { hp: 0.7, atk: 1.2, agi: 1.3 }, // 3: スネーク (Fast, High ATK)
    { hp: 1.0, atk: 1.0, agi: 1.0 }, // 4: ゴブリン (Balanced)
    { hp: 0.8, atk: 1.2, agi: 0.8 }, // 5: スケルトン (High ATK, Low HP)
    { hp: 0.5, atk: 1.5, agi: 1.8 }, // 6: ファントム (Glass Cannon, Very Fast)
    { hp: 1.8, atk: 1.5, agi: 0.6 }, // 7: オーガ (Tank, High ATK, Slow)
    { hp: 1.5, atk: 1.3, agi: 1.2 }, // 8: デーモン (Strong all-rounder)
    { hp: 2.0, atk: 2.0, agi: 1.0 }, // 9: ドラゴン (Boss level base)
    { hp: 1.5, atk: 1.1, agi: 0.4 }, // 10: ゾンビ (High HP, Very Slow)
    { hp: 0.7, atk: 1.8, agi: 0.9 }, // 11: メイジ (Low HP, Very High ATK)
    { hp: 1.3, atk: 1.4, agi: 1.5 }, // 12: ヴァンパイア (Strong, Fast)
    { hp: 1.2, atk: 2.0, agi: 1.1 }  // 13: デーモンメイジ (High ATK magic)
];

const ENEMY_VARIANTS = [
    { prefix: 'スモール', filter: 'hue-rotate(90deg) saturate(1.2)', scale: 'transform: scale(0.8);' },
    { prefix: '', filter: 'none', scale: 'transform: scale(1.2);' },
    { prefix: 'レッド', filter: 'hue-rotate(180deg) saturate(2)', scale: 'transform: scale(1.2);' },
    { prefix: 'ダーク', filter: 'hue-rotate(270deg) brightness(0.6)', scale: 'transform: scale(1.2);' },
    { prefix: 'キング', filter: 'hue-rotate(45deg) brightness(1.5)', scale: 'transform: scale(1.6);' }
];

let _generatedMonsters = [];
MONSTER_NAMES.forEach((name, i) => {
    ENEMY_VARIANTS.forEach((v, j) => {
        const htmlStr = `<img src="assets/monster_${i}.png" 
                    style="width:100%; height:100%; object-fit:contain; object-position:bottom; transform-origin:bottom; filter: ${v.filter}; ${v.scale}; image-rendering: pixelated;" />`;

        _generatedMonsters.push({
            name: v.prefix + MONSTER_NAMES[i],
            svgStr: htmlStr,
            baseVal: i * 2 + j * 5,
            imgIndex: i
        });
    });
});
_generatedMonsters.sort((a, b) => a.baseVal - b.baseVal);

const MONSTERS = [];
_generatedMonsters.forEach((m, idx) => {
    const scale = 1 + idx * 0.15; // Flatten curve slightly since we have more variants total
    const statsMult = MONSTER_STATS_MULT[m.imgIndex] || { hp: 1, atk: 1, agi: 1 };

    MONSTERS.push({
        name: m.name,
        level: Math.floor(idx / 7) + 1, // Divide by 7 since total is 14*5 = 70. 70/7 = 10 floors
        hp: Math.floor(15 * scale * statsMult.hp),
        atk: Math.floor(5 * scale * statsMult.atk),
        agi: Math.floor((5 + idx * 0.25) * statsMult.agi),
        exp: Math.floor(10 * scale),
        imgIndex: m.imgIndex,
        svg: m.svgStr
    });
});

function generateMaze(size, depth = 0) {
    const map = Array(size).fill().map(() => Array(size).fill(1));
    const rooms = [];
    const numRooms = 4 + Math.floor(Math.random() * 4);

    for (let i = 0; i < numRooms; i++) {
        const rw = 3 + Math.floor(Math.random() * 3);
        const rh = 3 + Math.floor(Math.random() * 3);
        const rx = 1 + Math.floor(Math.random() * (size - rw - 2));
        const ry = 1 + Math.floor(Math.random() * (size - rh - 2));
        rooms.push({ x: rx, y: ry, w: rw, h: rh });
        for (let y = ry; y < ry + rh; y++) {
            for (let x = rx; x < rx + rw; x++) {
                map[y][x] = 0;
            }
        }
    }

    for (let i = 1; i < rooms.length; i++) {
        const r1 = rooms[i - 1];
        const r2 = rooms[i];
        let x1 = Math.floor(r1.x + r1.w / 2);
        let y1 = Math.floor(r1.y + r1.h / 2);
        let x2 = Math.floor(r2.x + r2.w / 2);
        let y2 = Math.floor(r2.y + r2.h / 2);

        while (x1 !== x2) { map[y1][x1] = 0; x1 += (x2 > x1) ? 1 : -1; }
        while (y1 !== y2) { map[y1][x1] = 0; y1 += (y2 > y1) ? 1 : -1; }
        map[y2][x2] = 0;
    }

    let sx = 1, sy = 1;
    let cx = Math.floor(rooms[0].x + rooms[0].w / 2);
    let cy = Math.floor(rooms[0].y + rooms[0].h / 2);
    while (sx !== cx) { map[sy][sx] = 0; sx += (cx > sx) ? 1 : -1; }
    while (sy !== cy) { map[sy][sx] = 0; sy += (cy > sy) ? 1 : -1; }
    map[1][1] = 2; // Up stair

    const lastRoom = rooms[rooms.length - 1];
    let stairX = lastRoom.x + Math.floor(Math.random() * lastRoom.w);
    let stairY = lastRoom.y + Math.floor(Math.random() * lastRoom.h);
    if (stairX === 1 && stairY === 1) stairX++;
    map[stairY][stairX] = 3;

    // Generate Gimmicks based on depth
    if (depth >= 1) { // Start gimmicks from B2F
        const diff = Math.min(depth * 0.02, 0.15); // Max 15% chance per eligible tile
        for (let y = 1; y < size - 1; y++) {
            for (let x = 1; x < size - 1; x++) {
                if (map[y][x] === 1 && Math.random() < diff * 0.2) {
                    // Convert some walls to hidden doors (4), ensuring they connect to at least one 0
                    if (map[y - 1][x] === 0 || map[y + 1][x] === 0 || map[y][x - 1] === 0 || map[y][x + 1] === 0) {
                        map[y][x] = 4;
                    }
                } else if (map[y][x] === 0 && (x !== stairX && y !== stairY) && (x !== 1 && y !== 1)) {
                    if (Math.random() < diff * 0.3) map[y][x] = 5; // Teleporter
                    else if (Math.random() < diff * 0.4) map[y][x] = 6; // Dark Zone
                    else if (Math.random() < diff * 0.3) map[y][x] = 7; // Spinner
                }
            }
        }
    }

    return map;
}

const LEVELS = [];
for (let i = 0; i < 10; i++) {
    const map = generateMaze(MAP_SIZE, i);
    if (i === 9) {
        for (let r = 0; r < map.length; r++) {
            for (let c = 0; c < map[r].length; c++) {
                if (map[r][c] === 3) map[r][c] = 8;
            }
        }
    }
    LEVELS.push(map);
}

const assets = {
    wall: { img: new Image(), loaded: false },
    floor: { img: new Image(), loaded: false },
    ceiling: { img: new Image(), loaded: false },
    stair_up: { img: new Image(), loaded: false },
    stair_down: { img: new Image(), loaded: false }
};

['wall', 'floor', 'ceiling', 'stair_up', 'stair_down'].forEach(k => {
    assets[k].img.onload = () => { assets[k].loaded = true; if (game) game.render(); };
    assets[k].img.src = `assets/${k}.png`;
});

/**
 * GAME ENGINE
 */
class Game {
    constructor() {
        this.canvas = document.getElementById('view-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.minimapCanvas = document.getElementById('minimap-canvas');
        this.mCtx = this.minimapCanvas.getContext('2d');

        this.currentFloor = 0;
        this.playerPos = { x: 1, y: 1, dir: 1 };
        this.party = [];
        this.inventory = [];
        this.visited = LEVELS.map(() => Array(MAP_SIZE).fill().map(() => Array(MAP_SIZE).fill(false)));
        this.state = 'START';
        this.startTime = null;
        this.clearTime = null;

        this.currentBattle = null;
        this.turnIndex = 0;

        this.init();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());

        document.getElementById('btn-reroll').onclick = () => this.rollParty();
        document.getElementById('btn-start').onclick = () => this.startGame();

        this.rollParty();

        this.updateVisited();
        this.render();

        document.addEventListener('keydown', (e) => this.handleInput(e));
    }

    rollParty() {
        this.party = [];
        const jobs = Object.values(CLASSES);
        let names = [
            // European / Fantasy
            'アレス', 'ルナ', 'ゼロ', 'シオン', 'カイン', 'セリス', 'レオン', 'アリア',
            'クロウ', 'レイ', 'ティナ', 'アーラン', 'ゼクス', 'ノア', 'イリス', 'ファリス',
            // Japanese
            'コテツ', 'ヤマト', 'サクラ', 'カグラ', 'ハヤテ', 'シズク', 'ゲン', 'カエデ',
            // Chinese
            'レイフェイ', 'シャオ', 'リン', 'リュウ', 'メイ', 'シン', 'ラン', 'ユン',
            // Islamic / Middle Eastern
            'アリー', 'アミール', 'ファティマ', 'ハサン', 'ライラ', 'カシム', 'ザラ', 'オマール'
        ];

        // Shuffle names array to pick 4 unique names easily
        for (let i = names.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [names[i], names[j]] = [names[j], names[i]];
        }

        for (let i = 0; i < 4; i++) {
            const job = jobs[Math.floor(Math.random() * jobs.length)];
            const name = names.pop(); // Take one completely unique name
            const bonus = 5 + Math.floor(Math.random() * 11);

            const char = this.createChar(name, job);
            char.bonusLeft = bonus;
            this.party.push(char);
        }
        this.renderCharCreate();
    }

    renderCharCreate() {
        let html = '';
        this.party.forEach((char, idx) => {
            const statRow = (statName, display) => {
                const baseKey = 'base' + statName.charAt(0).toUpperCase() + statName.slice(1);
                const isMin = char[statName] <= char[baseKey];
                const isMax = char.bonusLeft <= 0;
                return `
                            <div style="display:inline-flex; align-items:center; width:90px; margin-bottom:4px;">
                                <span style="display:inline-block; width:30px; font-size:12px;">${display}</span>
                                <button class="btn" style="padding:0 5px; height:18px; font-size:10px;" ${isMin ? 'disabled' : ''} onclick="game.adjustStat(${idx}, '${statName}', -1)">-</button>
                                <span style="display:inline-block; width:20px; text-align:center; font-size:12px;">${char[statName]}</span>
                                <button class="btn" style="padding:0 5px; height:18px; font-size:10px;" ${isMax ? 'disabled' : ''} onclick="game.adjustStat(${idx}, '${statName}', 1)">+</button>
                            </div>
                        `;
            };

            html += `
                        <div style="border: 1px dashed var(--text-color); padding: 5px; background: rgba(0,0,0,0.8);">
                            <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                                <span><strong style="color:#ffcc00;">${char.name} (${char.job})</strong></span>
                                <span style="color:${char.bonusLeft > 0 ? '#5f5' : '#888'}; font-size:12px;">Bonus: ${char.bonusLeft}</span>
                            </div>
                            <div style="display:flex; flex-wrap:wrap; gap:2px;">
                                ${statRow('str', 'STR')}
                                ${statRow('int', 'INT')}
                                ${statRow('vit', 'VIT')}
                                ${statRow('agi', 'AGI')}
                                ${statRow('luk', 'LUK')}
                            </div>
                            <div style="font-size:12px; color:#aaa; margin-top:2px;">HP: ${char.hp} | MP: ${char.mp}</div>
                        </div>
                    `;
        });
        document.getElementById('char-create-list').innerHTML = html;

        const allAssigned = this.party.every(p => p.bonusLeft === 0);
        const btnStart = document.getElementById('btn-start');
        btnStart.disabled = false;
        btnStart.textContent = '冒険開始 (タイマー始動)';
    }

    adjustStat(charIdx, statName, delta) {
        const char = this.party[charIdx];
        const baseKey = 'base' + statName.charAt(0).toUpperCase() + statName.slice(1);

        if (delta > 0 && char.bonusLeft > 0) {
            char[statName]++;
            char.bonusLeft--;
        } else if (delta < 0 && char[statName] > char[baseKey]) {
            char[statName]--;
            char.bonusLeft++;
        }
        this.renderCharCreate();
    }

    startGame() {
        this.state = 'EXPLORE';
        this.startTime = Date.now();
        document.getElementById('char-create-screen').style.display = 'none';
        this.addLog("深淵の迷宮へようこそ。B10Fのボス討伐を目指せ。");
        this.updateTimer();
    }

    updateTimer() {
        if (this.state === 'START' || this.state === 'ENDING') return;

        const now = Date.now();
        const elapsed = Math.floor((now - this.startTime) / 1000);
        const h = String(Math.floor(elapsed / 3600)).padStart(2, '0');
        const m = String(Math.floor((elapsed % 3600) / 60)).padStart(2, '0');
        const s = String(elapsed % 60).padStart(2, '0');

        document.getElementById('timer-display').textContent = `${h}:${m}:${s}`;
        requestAnimationFrame(() => this.updateTimer());
    }

    createChar(name, job) {
        return {
            name, job: job.name, hp: job.hp, maxHp: job.hp, mp: job.mp, maxMp: job.mp,
            str: job.str, int: job.int, vit: job.vit, agi: job.agi, luk: job.luk,
            baseStr: job.str, baseInt: job.int, baseVit: job.vit, baseAgi: job.agi, baseLuk: job.luk,
            bonusLeft: 0,
            level: 1, exp: 0,
            equipment: { weapon: null, armor: null, accessory: null },
            inventory: []
        };
    }

    resize() {
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;
        this.render();
    }

    handleInput(e) {
        if (this.state === 'EXPLORE') {
            switch (e.key) {
                case 'ArrowUp': case 'w': this.move('forward'); break;
                case 'ArrowDown': case 's': this.move('backward'); break;
                case 'ArrowLeft': case 'a': this.move('left'); break;
                case 'ArrowRight': case 'd': this.move('right'); break;
                case 'c': case 'C': this.toggleCamp(); break;
            }
        } else if (this.state === 'CAMP') {
            if (e.key === 'c' || e.key === 'C' || e.key === 'Escape') {
                this.toggleCamp();
            }
        } else if (this.state === 'BATTLE' && this.currentBattle?.phase === 'INPUT') {
            switch (e.key.toLowerCase()) {
                case 'a': this.battleAction('attack'); break;
                case 's': this.battleAction('magic'); break;
                case 'd': this.battleAction('guard'); break;
                case 'f': this.battleAction('run'); break;
            }
        }
    }

    move(action) {
        if (this.state !== 'EXPLORE') return;

        let { x, y, dir } = this.playerPos;
        const dx = [0, 1, 0, -1][dir];
        const dy = [-1, 0, 1, 0][dir];
        const map = LEVELS[this.currentFloor];

        if (action === 'forward') {
            const nx = x + dx;
            const ny = y + dy;
            if (ny >= 0 && ny < map.length && nx >= 0 && nx < map[ny].length && map[ny][nx] !== 1) {
                this.playerPos.x = nx;
                this.playerPos.y = ny;
                this.checkTile();
            }
        } else if (action === 'backward') {
            const nx = x - dx;
            const ny = y - dy;
            if (ny >= 0 && ny < map.length && nx >= 0 && nx < map[ny].length && map[ny][nx] !== 1) {
                this.playerPos.x = nx;
                this.playerPos.y = ny;
                this.checkTile();
            }
        } else if (action === 'left') {
            this.playerPos.dir = (dir + 3) % 4;
        } else if (action === 'right') {
            this.playerPos.dir = (dir + 1) % 4;
        }

        this.updateVisited();
        this.render();
    }

    checkTile() {
        const floorData = LEVELS[this.currentFloor];
        if (!floorData[this.playerPos.y]) return;

        const tile = floorData[this.playerPos.y][this.playerPos.x];
        if (tile === 3) {
            this.currentFloor++;
            this.addLog(`地下 ${this.currentFloor + 1} 階へ降りた。`);

            let found = false;
            const nextFloor = LEVELS[this.currentFloor];
            for (let r = 0; r < nextFloor.length; r++) {
                for (let c = 0; c < nextFloor[r].length; c++) {
                    if (nextFloor[r][c] === 2) {
                        this.playerPos.x = c;
                        this.playerPos.y = r;
                        found = true;
                        break;
                    }
                }
                if (found) break;
            }

            if (!found) {
                this.playerPos.x = 1;
                this.playerPos.y = 1;
            }

            document.getElementById('floor-indicator').textContent = `B${this.currentFloor + 1}F`;
            this.updateVisited();
        } else if (tile === 2) {
            if (this.currentFloor === 0) {
                this.addLog("地上への階段だ。しかし今は戻れない。");
            } else {
                this.currentFloor--;
                this.addLog(`地下 ${this.currentFloor + 1} 階へ上がった。`);

                let found = false;
                const prevFloor = LEVELS[this.currentFloor];
                for (let r = 0; r < prevFloor.length; r++) {
                    for (let c = 0; c < prevFloor[r].length; c++) {
                        if (prevFloor[r][c] === 3) {
                            this.playerPos.x = c;
                            this.playerPos.y = r;
                            found = true;
                            break;
                        }
                    }
                    if (found) break;
                }

                if (!found) {
                    this.playerPos.x = 1;
                    this.playerPos.y = 1;
                }

                document.getElementById('floor-indicator').textContent = `B${this.currentFloor + 1}F`;
                this.updateVisited();
            }
        } else if (tile === 5) { // Teleporter
            this.addLog("テレポーターだ！");
            let rx, ry;
            do {
                rx = 1 + Math.floor(Math.random() * (MAP_SIZE - 2));
                ry = 1 + Math.floor(Math.random() * (MAP_SIZE - 2));
            } while (floorData[ry][rx] === 1 || floorData[ry][rx] === 4);
            this.playerPos.x = rx;
            this.playerPos.y = ry;
            this.updateVisited();
            this.checkTile(); // Recursive check incase of double trap
        } else if (tile === 7) { // Spinner
            this.addLog("床が回転した！");
            this.playerPos.dir = Math.floor(Math.random() * 4);
            this.checkEncounter();
        } else if (tile === 6) { // Dark Zone
            this.addLog("暗闇だ...");
            this.checkEncounter();
        } else if (tile === 8) { // Boss Tile
            this.addLog("圧倒的な邪悪な気配を感じる...!!");
            this.startBossBattle();
        } else {
            this.checkEncounter();
        }
    }

    updateVisited() {
        if (this.visited[this.currentFloor] && this.visited[this.currentFloor][this.playerPos.y]) {
            this.visited[this.currentFloor][this.playerPos.y][this.playerPos.x] = true;
        }
    }

    checkEncounter() {
        if (Math.random() < 0.12) this.startBattle();
    }

    addLog(text) {
        const logWin = document.getElementById('log-window');
        const entry = document.createElement('div');
        entry.textContent = `> ${text}`;
        logWin.prepend(entry);
    }

    /**
     * BATTLE SYSTEM
     */
    startBattle() {
        this.state = 'BATTLE';
        const floorMonsters = MONSTERS.filter(m => m.level === this.currentFloor + 1);
        const monsterData = floorMonsters.length > 0 ? floorMonsters[Math.floor(Math.random() * floorMonsters.length)] : MONSTERS[0];
        this.currentBattle = {
            monster: { ...monsterData, currentHp: monsterData.hp },
            turnOrder: [],
            phase: 'INPUT'
        };

        this.addLog(`${monsterData.name}が現れた！`);
        document.getElementById('explore-menu').style.display = 'none';
        document.getElementById('battle-menu').style.display = 'flex';
        document.getElementById('monster-overlay').innerHTML = monsterData.svg;
        document.getElementById('monster-overlay').style.display = 'block';

        this.turnIndex = 0;
        this.updateUI();
    }

    startBossBattle() {
        this.state = 'BATTLE';

        const baseMonster = MONSTERS[MONSTERS.length - 1]; // Use King variant svg
        let bossData = {
            ...baseMonster,
            name: 'アビスロード',
            hp: 3000,
            atk: 60,
            exp: 10000,
            level: 10
        };

        this.currentBattle = {
            monster: { ...bossData, currentHp: bossData.hp },
            turnOrder: [],
            phase: 'INPUT',
            isBoss: true
        };

        this.addLog(`${bossData.name}が現れた！`);
        document.getElementById('explore-menu').style.display = 'none';
        document.getElementById('battle-menu').style.display = 'flex';

        const bossImgStr = `<img src="assets/boss.png" style="width:100%; height:100%; object-fit:contain; object-position:bottom; transform-origin:bottom; image-rendering:pixelated;" onerror="this.onerror=null; this.src='assets/monster_9.png';" />`;

        const mo = document.getElementById('monster-overlay');
        mo.innerHTML = bossImgStr;
        mo.style.display = 'block';
        mo.style.transform = 'translateX(-50%) scale(1.5)';
        mo.style.filter = 'drop-shadow(0 0 10px red)';

        this.turnIndex = 0;
        this.updateUI();
    }

    battleAction(type) {
        if (this.state !== 'BATTLE' || this.currentBattle.phase !== 'INPUT') return;
        const actor = this.party[this.turnIndex];
        this.currentBattle.turnOrder.push({ actor, type, isPlayer: true });
        this.turnIndex++;
        if (this.turnIndex >= this.party.length) this.executeBattleTurn();
        else this.updateUI();
    }

    async executeBattleTurn() {
        this.currentBattle.phase = 'EXECUTE';
        const monster = this.currentBattle.monster;
        this.currentBattle.turnOrder.push({ actor: monster, type: 'attack', isPlayer: false });
        this.currentBattle.turnOrder.sort((a, b) => (b.actor.agi || 10) - (a.actor.agi || 10));

        for (let action of this.currentBattle.turnOrder) {
            if (monster.currentHp <= 0) break;
            if (action.isPlayer) {
                if (action.actor.hp <= 0) continue;
                if (action.type === 'attack') {
                    const wpnAtk = (action.actor.equipment.weapon?.atk || 0) + (action.actor.equipment.accessory?.atk || 0);
                    const dmg = Math.max(1, (action.actor.str + wpnAtk) + Math.floor(Math.random() * 5) - 2);
                    monster.currentHp -= dmg;
                    this.addLog(`${action.actor.name}の攻撃！ ${monster.name}に${dmg}のダメージ！`);
                    this.flashEffect();
                } else if (action.type === 'magic') {
                    if (action.actor.mp >= 5) {
                        action.actor.mp -= 5;
                        const dmg = Math.max(8, action.actor.int + 5);
                        monster.currentHp -= dmg;
                        this.addLog(`${action.actor.name}の魔法！ ${monster.name}に${dmg}のダメージ！`);
                        this.flashEffect();
                    } else {
                        this.addLog(`${action.actor.name}はMPが足りない！`);
                    }
                } else if (action.type === 'run') {
                    if (Math.random() > 0.4) {
                        this.addLog("逃げ出した！");
                        this.endBattle(false);
                        return;
                    } else this.addLog("逃げられなかった！");
                }
            } else {
                const aliveParty = this.party.filter(p => p.hp > 0);
                if (aliveParty.length === 0) break;
                const target = aliveParty[Math.floor(Math.random() * aliveParty.length)];
                if (target) {
                    const armDef = (target.equipment.armor?.def || 0) + (target.equipment.accessory?.def || 0);
                    const dmg = Math.max(1, monster.atk - Math.floor((target.vit + armDef) / 2) + Math.floor(Math.random() * 3));
                    target.hp = Math.max(0, target.hp - dmg);
                    this.addLog(`${monster.name}の攻撃！ ${target.name}は${dmg}のダメージ！`);
                    this.flashEffect();
                }
            }
            this.updateUI();
            await new Promise(r => setTimeout(r, 600));
        }

        if (monster.currentHp <= 0) {
            this.addLog(`${monster.name}を討伐した！`);
            this.endBattle(true);
        } else if (this.party.every(p => p.hp <= 0)) {
            const currentFloorNum = this.currentFloor + 1;
            const penaltySeconds = currentFloorNum * 30;
            const penaltyMs = penaltySeconds * 1000;

            this.addLog("パーティは全滅してしまった...");
            this.addLog("謎の力によってB1Fまで戻された！");
            this.addLog(`（ペナルティ: タイムが${penaltySeconds}秒加算された）`);

            // Apply (floor * 30) seconds penalty to timer
            this.startTime -= penaltyMs;

            // Simple game over: restore health and return to start
            this.party.forEach(p => p.hp = p.maxHp);
            this.playerPos = { x: 1, y: 1, dir: 1 };
            this.currentFloor = 0;
            document.getElementById('floor-indicator').textContent = `B1F`;
            this.updateVisited();
            this.endBattle(false);
        } else {
            this.currentBattle.turnOrder = [];
            this.currentBattle.phase = 'INPUT';
            this.turnIndex = 0;
            this.updateUI();
        }
    }

    flashEffect() {
        const viewport = document.getElementById('viewport-container');
        viewport.classList.add('flash');
        setTimeout(() => viewport.classList.remove('flash'), 200);
    }

    endBattle(won) {
        const mo = document.getElementById('monster-overlay');
        mo.style.transform = '';
        mo.style.filter = '';

        if (won) {
            if (this.currentBattle.isBoss) {
                this.triggerEnding();
                return;
            }
            const exp = this.currentBattle.monster.exp;
            this.party.forEach(p => {
                if (p.hp > 0) {
                    p.exp += exp;
                    if (p.exp >= p.level * 60) {
                        p.level++;
                        p.maxHp += 8;
                        p.maxMp += 4; p.mp = p.maxMp;
                        p.str += 2; p.int += 2;
                        this.addLog(`${p.name}はレベル${p.level}に上がった！`);
                    }
                }
            });

            // Item Drop
            if (Math.random() < 0.4) {
                const currentLvl = this.currentFloor + 1;
                const maxLevel = Math.min(10, currentLvl + 2); // Up to +2 floor
                const minLevel = Math.max(1, currentLvl - 3);  // Down to -3 floor
                const pool = ITEMS.filter(i => (i.level || 1) >= minLevel && (i.level || 1) <= maxLevel);

                if (pool.length > 0) {
                    const baseDrop = pool[Math.floor(Math.random() * pool.length)];
                    const drop = { ...baseDrop }; // Clone object for variants

                    if (drop.type !== 'consumable') {
                        let totalWeight = ITEM_PREFIXES.reduce((sum, p) => sum + p.weight, 0);
                        let r = Math.random() * totalWeight;
                        let prefix = ITEM_PREFIXES[0];
                        for (let p of ITEM_PREFIXES) {
                            r -= p.weight;
                            if (r <= 0) { prefix = p; break; }
                        }

                        if (prefix.name !== '') {
                            drop.name = prefix.name + drop.name;
                            let statArr = [];

                            if (drop.atk !== undefined) {
                                drop.atk = Math.round(drop.atk * prefix.mult);
                                statArr.push(`ATK${drop.atk >= 0 ? '+' : ''}${drop.atk}`);
                            }
                            if (drop.def !== undefined) {
                                drop.def = Math.round(drop.def * prefix.mult);
                                statArr.push(`DEF${drop.def >= 0 ? '+' : ''}${drop.def}`);
                            }
                            if (drop.int !== undefined) {
                                drop.int = Math.round(drop.int * prefix.mult);
                                statArr.push(`INT${drop.int >= 0 ? '+' : ''}${drop.int}`);
                            }
                            if (drop.agi !== undefined) {
                                drop.agi = Math.round(drop.agi * prefix.mult);
                                statArr.push(`AGI${drop.agi >= 0 ? '+' : ''}${drop.agi}`);
                            }
                            if (drop.luk !== undefined) {
                                drop.luk = Math.round(drop.luk * prefix.mult);
                                statArr.push(`LUK${drop.luk >= 0 ? '+' : ''}${drop.luk}`);
                            }

                            drop.desc = `${statArr.join(', ')} (元: ${baseDrop.name})`;
                        }
                    }
                    this.inventory.push(drop);
                    this.addLog(`魔物が宝箱を落とした！「${drop.name}」を手に入れた！`);
                }
            }
        }
        this.state = 'EXPLORE';
        document.getElementById('explore-menu').style.display = 'flex';
        document.getElementById('battle-menu').style.display = 'none';
        document.getElementById('monster-overlay').style.display = 'none';
        this.currentBattle = null;
        this.updateUI();
    }

    triggerEnding() {
        this.state = 'ENDING';
        this.clearTime = Date.now() - this.startTime;

        const elapsed = Math.floor(this.clearTime / 1000);
        const h = String(Math.floor(elapsed / 3600)).padStart(2, '0');
        const m = String(Math.floor((elapsed % 3600) / 60)).padStart(2, '0');
        const s = String(elapsed % 60).padStart(2, '0');
        const timeStr = `${h}:${m}:${s}`;

        document.getElementById('clear-time-display').textContent = timeStr;
        document.getElementById('ending-screen').style.display = 'flex';

        const btn = document.getElementById('btn-submit-score');
        btn.onclick = () => {
            const name = document.getElementById('player-name-input').value.trim() || '名無し';
            btn.disabled = true;
            btn.textContent = '送信中...';

            if (window.firebaseInitialized) {
                const dbRankRef = window.firebaseRef(window.firebaseDB, 'rankings');
                window.firebasePush(dbRankRef, {
                    name: name,
                    time: this.clearTime,
                    timeStr: timeStr,
                    timestamp: Date.now()
                }).then(() => {
                    btn.textContent = '登録完了！';
                }).catch(e => {
                    btn.textContent = 'エラー発生';
                    console.error(e);
                });
            }
        };

        this.loadRankings();
    }

    loadRankings() {
        if (!window.firebaseInitialized) return;
        const dbRankRef = window.firebaseRef(window.firebaseDB, 'rankings');
        const q = window.firebaseQuery(dbRankRef, window.firebaseOrderByChild('time'), window.firebaseLimitToFirst(10));

        window.firebaseOnValue(q, (snapshot) => {
            let html = '';
            let rank = 1;
            snapshot.forEach((childSnapshot) => {
                const data = childSnapshot.val();
                html += `<div class="rank-item"><span>${rank}. ${data.name}</span> <span style="color:#ffcc00;">${data.timeStr}</span></div>`;
                rank++;
            });
            document.getElementById('ranking-container').innerHTML = html || 'まだ記録がありません。';
        });
    }

    /**
     * CAMP SYSTEM
     */
    toggleCamp() {
        const campMenu = document.getElementById('camp-menu');
        if (this.state === 'EXPLORE') {
            this.state = 'CAMP';
            document.getElementById('explore-menu').style.display = 'none';
            campMenu.style.display = 'flex';
            this.updateCampUI();
        } else if (this.state === 'CAMP') {
            this.state = 'EXPLORE';
            campMenu.style.display = 'none';
            document.getElementById('explore-menu').style.display = 'flex';
        }
    }

    updateCampUI() {
        const campMenu = document.getElementById('camp-menu');
        if (this.state !== 'CAMP') return;

        let html = '<div class="camp-header">CAMP - パーティ状況</div>';

        this.party.forEach((p, idx) => {
            const nextExp = p.level * 60;
            const wpn = p.equipment.weapon ? p.equipment.weapon.name : 'なし';
            const arm = p.equipment.armor ? p.equipment.armor.name : 'なし';
            const acc = p.equipment.accessory ? p.equipment.accessory.name : 'なし';

            const getBonus = (statKey) => {
                let bonus = 0;
                ['weapon', 'armor', 'accessory'].forEach(slot => {
                    if (p.equipment[slot] && p.equipment[slot][statKey] !== undefined) {
                        bonus += p.equipment[slot][statKey];
                    }
                });
                return bonus !== 0 ? ` <span style="color:${bonus > 0 ? '#5f5' : '#f55'}">(${bonus > 0 ? '+' : ''}${bonus})</span>` : '';
            };

            const strBonus = getBonus('atk');
            const vitBonus = getBonus('def');
            const intBonus = getBonus('int');
            const agiBonus = getBonus('agi');
            const lukBonus = getBonus('luk');

            html += `
                        <div class="camp-character">
                            <div class="camp-char-stats">
                                <strong style="color:var(--text-color); font-size:16px;">${p.name} (${p.job})</strong> - Lv: ${p.level}<br>
                                HP: ${p.hp} / ${p.maxHp} | MP: ${p.mp} / ${p.maxMp}<br>
                                STR: ${p.str}${strBonus} | INT: ${p.int}${intBonus} | VIT: ${p.vit}${vitBonus} | AGI: ${p.agi}${agiBonus} | LUK: ${p.luk}${lukBonus}<br>
                                EXP: ${p.exp} / ${nextExp}<br>
                                <span style="color:#888; font-size:12px;">EQ: [${wpn}] [${arm}] [${acc}]</span>
                            </div>
                            <div class="camp-char-actions">
                                ${p.maxMp > 0 ? `<button class="btn" style="padding:4px; font-size:10px; margin-bottom:2px;" onclick="game.castCampMagic(${idx})">回復魔法(3MP)</button>` : ''}
                                ${p.equipment.weapon ? `<button class="btn" style="padding:2px 4px; font-size:10px; border-color:#833;" onclick="game.unequipItem(${idx}, 'weapon')">武器外す</button>` : ''}
                                ${p.equipment.armor ? `<button class="btn" style="padding:2px 4px; font-size:10px; border-color:#833;" onclick="game.unequipItem(${idx}, 'armor')">鎧外す</button>` : ''}
                                ${p.equipment.accessory ? `<button class="btn" style="padding:2px 4px; font-size:10px; border-color:#833;" onclick="game.unequipItem(${idx}, 'accessory')">装飾外す</button>` : ''}
                            </div>
                        </div>
                    `;
        });

        html += '<div class="camp-header" style="margin-top:10px; font-size:14px;">パーティの手荷物</div>';
        html += '<div style="display:flex; flex-wrap:wrap; gap:5px; margin-bottom:10px;">';
        if (this.inventory.length === 0) {
            html += '<span style="color:#888; font-size:12px;">何も持っていない。</span>';
        } else {
            this.inventory.forEach((item, itemIdx) => {
                html += `
                            <div style="border:1px solid #444; padding:5px; font-size:12px; min-width:100px;">
                                ${item.name} <br>
                                <span style="color:#888; font-size:10px;">${item.desc}</span>
                                ${item.req ? `<br><span style="color:#ffcc00; font-size:10px;">[条件: ${Object.entries(item.req).map(([k, v]) => `${k.toUpperCase()} ${v}`).join(', ')}]</span>` : ''}
                                <br>
                                <div style="margin-top:5px; display:flex; gap:5px;">
                                    ${item.type === 'consumable'
                        ? `<button class="btn" style="padding:2px 5px; font-size:10px;" onclick="game.showTargetSelection(${itemIdx}, 'use')">使う</button>`
                        : `<button class="btn" style="padding:2px 5px; font-size:10px;" onclick="game.showTargetSelection(${itemIdx}, 'equip')">装備</button>`
                    }
                                    <button class="btn" style="padding:2px 5px; font-size:10px; border-color:#833;" onclick="game.dropItem(${itemIdx})">捨てる</button>
                                </div>
                            </div>
                        `;
            });
        }
        html += '</div>';

        // Add close button at the bottom
        html += `<button class="btn" style="margin-top:auto;" onclick="game.toggleCamp()">キャンプ終了 (ESC)</button>`;
        campMenu.innerHTML = html;
    }

    castCampMagic(casterIdx) {
        const caster = this.party[casterIdx];
        if (caster.hp <= 0) {
            this.addLog(`${caster.name}は倒れている...`);
            return;
        }
        if (caster.mp < 3) {
            this.addLog(`${caster.name}はMPが足りない！`);
            return;
        }

        // Find target with lowest HP percentage
        let target = null;
        let lowestPct = 1.0;
        this.party.forEach(p => {
            const pct = p.hp / p.maxHp;
            if (p.hp > 0 && pct < lowestPct && p.hp < p.maxHp) {
                lowestPct = pct;
                target = p;
            }
        });

        if (!target) {
            this.addLog("回復が必要な仲間はいない。");
            return;
        }

        caster.mp -= 3;
        const healAmt = Math.max(15, caster.int + 10);
        target.hp = Math.min(target.maxHp, target.hp + healAmt);

        this.addLog(`${caster.name}の回復魔法！ ${target.name}のHPが${healAmt}回復した。`);
        this.updateCampUI();
        this.updateUI(); // Update side bar too
    }

    showTargetSelection(itemIdx, action) {
        const item = this.inventory[itemIdx];
        const campMenu = document.getElementById('camp-menu');

        let html = `<div class="camp-header">${action === 'use' ? '誰が使う？' : '誰が装備する？'} - ${item.name}</div>`;
        html += `<div style="text-align:center; margin-bottom:20px; color:#888;">${item.desc}</div>`;

        html += '<div style="display:flex; flex-direction:column; gap:10px; align-items:center;">';
        this.party.forEach((p, cidx) => {
            let disabled = '';
            let color = '';
            let errorMsg = '';
            let currentEquip = '';

            if (p.hp <= 0) {
                disabled = 'disabled';
                color = '#444';
            } else if (action === 'equip') {
                if (item.req) {
                    // Check requirements
                    for (const [stat, reqVal] of Object.entries(item.req)) {
                        // Base stat check, to prevent equipping items by using other items' bonuses
                        let pStat = p['base' + stat.charAt(0).toUpperCase() + stat.slice(1)] || p[stat];
                        if (pStat < reqVal) {
                            disabled = 'disabled';
                            color = '#844';
                            errorMsg = `(不足: ${stat.toUpperCase()} ${reqVal})`;
                            break;
                        }
                    }
                }
                const currentItem = p.equipment[item.type];
                currentEquip = `<div style="font-size:10px; color:#aaa; margin-top:4px;">[現在: ${currentItem ? currentItem.name : 'なし'}]</div>`;
            }

            if (!color) color = 'var(--text-color)';
            html += `<button class="btn" style="width:200px; padding:10px; color:${color}; border-color:${color}; display:flex; flex-direction:column; align-items:center;" ${disabled} onclick="game.executeItemAction(${cidx}, ${itemIdx}, '${action}')">
                        <div>${p.name} (${p.job}) <span style="color:#f55">${errorMsg}</span></div>
                        ${currentEquip}
                    </button>`;
        });
        html += `</div>`;

        html += `<button class="btn" style="margin-top:auto;" onclick="game.updateCampUI()">キャンセル</button>`;
        campMenu.innerHTML = html;
    }

    executeItemAction(charIdx, itemIdx, action) {
        if (action === 'use') {
            this.useItem(charIdx, itemIdx);
        } else if (action === 'equip') {
            this.equipItem(charIdx, itemIdx);
        }
    }

    useItem(charIdx, itemIdx) {
        const item = this.inventory[itemIdx];
        const target = this.party[charIdx];
        if (target.hp <= 0) {
            this.addLog(`${target.name}は倒れている...`);
            return;
        }
        if (item.type === 'consumable') {
            target.hp = Math.min(target.maxHp, target.hp + item.hpRestore);
            this.addLog(`${target.name}は${item.name}を使った。HPが回復した！`);
            this.inventory.splice(itemIdx, 1);
            this.updateCampUI();
            this.updateUI();
        }
    }

    equipItem(charIdx, itemIdx) {
        const item = this.inventory[itemIdx];
        const target = this.party[charIdx];
        const type = item.type; // 'weapon', 'armor', 'accessory'
        if (target.equipment[type]) {
            this.inventory.push(target.equipment[type]); // put old item back in bag
        }
        target.equipment[type] = item;
        this.inventory.splice(itemIdx, 1);
        this.addLog(`${target.name}は${item.name}を装備した。`);
        this.updateCampUI();
        this.updateUI();
    }

    dropItem(itemIdx) {
        if (confirm(`本当に ${this.inventory[itemIdx].name} を捨てる？`)) {
            this.inventory.splice(itemIdx, 1);
            this.updateCampUI();
        }
    }

    unequipItem(charIdx, slot) {
        const target = this.party[charIdx];
        if (target.equipment[slot]) {
            this.inventory.push(target.equipment[slot]);
            target.equipment[slot] = null;
            this.updateCampUI();
            this.updateUI();
        }
    }

    /**
     * RENDERING (3D Logic)
     */
    render() {
        this.drawDungeon();
        this.drawMinimap();
        this.updateUI();
    }

    drawDungeon() {
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;
        const map = LEVELS[this.currentFloor];
        const curTile = map[this.playerPos.y][this.playerPos.x];

        // Dark Zone (6) completely obscures vision
        if (curTile === 6) {
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, w, h);
            return;
        }

        // Draw ceiling and floor
        if (assets.ceiling.loaded) {
            ctx.drawImage(assets.ceiling.img, 0, 0, w, h / 2);
        } else {
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, w, h / 2);
        }

        if (assets.floor.loaded) {
            ctx.drawImage(assets.floor.img, 0, h / 2, w, h / 2);
            // Add darkness gradient over the loaded texture to blend into the horizon
            const grad = ctx.createLinearGradient(0, h / 2, 0, h);
            grad.addColorStop(0, 'rgba(0,0,0,1)');
            grad.addColorStop(0.3, 'rgba(0,0,0,0.6)');
            grad.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = grad;
            ctx.fillRect(0, h / 2, w, h / 2);
        } else {
            const grad = ctx.createLinearGradient(0, h / 2, 0, h);
            grad.addColorStop(0, '#000');
            grad.addColorStop(0.5, '#111');
            grad.addColorStop(1, '#112');
            ctx.fillStyle = grad;
            ctx.fillRect(0, h / 2, w, h / 2);
        }

        // Draw walls from back to front
        for (let d = VIEW_DIST; d >= 0; d--) {
            this.drawWallsAtDistance(d);
        }
    }

    drawWallsAtDistance(dist) {
        const { x, y, dir } = this.playerPos;
        const dx = [0, 1, 0, -1][dir];
        const dy = [-1, 0, 1, 0][dir];
        const px = [1, 0, -1, 0][dir];
        const py = [0, 1, 0, -1][dir];

        const map = LEVELS[this.currentFloor];
        const tx = x + dx * dist;
        const ty = y + dy * dist;

        if (ty < 0 || ty >= map.length || tx < 0 || tx >= map[ty].length) return;

        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;

        const getProj = (d, offsetX) => {
            // d ranges 0 (player square) to VIEW_DIST. Add offset to push wall slightly back so d=0 doesn't clip past screen
            const scale = 1 / (d + 0.5);
            const hz = h * 0.5 * scale;
            const wz = w * 0.7 * scale;
            // Raise the center point y to lift walls up from the bottom edge
            return { x: w / 2 + (offsetX * wz), y: h / 2 - (h * 0.05), w: wz, h: hz };
        };

        const fillWall = (d, offset, side) => {
            const p1 = getProj(d, offset);
            const p2 = getProj(d + 1, offset);

            let dx, dy, dw, dh;
            if (side === 'front') {
                dx = p1.x - p1.w / 2;
                dy = p1.y - p1.h;
                dw = p1.w;
                dh = p1.h * 2;
                if (assets.wall.loaded) {
                    ctx.drawImage(assets.wall.img, dx, dy, dw, dh);
                } else {
                    ctx.beginPath();
                    ctx.rect(dx, dy, dw, dh);
                    ctx.closePath();
                }
            } else {
                const img = assets.wall.loaded ? assets.wall.img : null;
                const srcW = img ? img.width : 1;
                const srcH = img ? img.height : 1;

                let startX, endX, y1top, y1bot, y2top, y2bot;
                if (side === 'left') {
                    startX = p1.x - p1.w / 2;
                    endX = p2.x - p2.w / 2;
                } else {
                    startX = p1.x + p1.w / 2;
                    endX = p2.x + p2.w / 2;
                }
                y1top = p1.y - p1.h;
                y1bot = p1.y + p1.h;
                y2top = p2.y - p2.h;
                y2bot = p2.y + p2.h;

                if (img) {
                    const steps = Math.ceil(Math.abs(endX - startX));
                    if (steps > 0) {
                        const stepCol = srcW / steps;
                        const wStep = (endX - startX) / steps;
                        const drawWidth = wStep > 0 ? wStep + 1 : wStep - 1;
                        for (let i = 0; i < steps; i++) {
                            const t = i / steps;
                            const cx = startX + wStep * i;
                            const cyTop = y1top + (y2top - y1top) * t;
                            const cyBot = y1bot + (y2bot - y1bot) * t;
                            const ch = cyBot - cyTop;
                            ctx.drawImage(img, Math.floor(i * stepCol), 0, Math.max(1, Math.ceil(stepCol)), srcH, cx, cyTop, drawWidth, ch);
                        }
                    }
                } else {
                    ctx.beginPath();
                    ctx.moveTo(startX, y1top);
                    ctx.lineTo(endX, y2top);
                    ctx.lineTo(endX, y2bot);
                    ctx.lineTo(startX, y1bot);
                    ctx.closePath();
                }
            }

            if (!assets.wall.loaded) {
                const brightness = Math.max(0, 100 - (d * 20));
                ctx.fillStyle = `rgb(0, ${brightness}, 0, 0.9)`;
                ctx.fill();
                ctx.strokeStyle = `rgb(0, ${brightness * 1.5}, 65)`;
                ctx.lineWidth = 2;
                ctx.stroke();
            } else {
                // Apply darkness over image based on depth
                const darkness = Math.max(0, Math.min(0.8, d * 0.15));
                if (darkness > 0) {
                    ctx.fillStyle = `rgba(0, 0, 0, ${darkness})`;
                    if (side === 'front') {
                        ctx.fillRect(dx, dy, dw, dh);
                    } else {
                        ctx.beginPath();
                        let sx = side === 'left' ? p1.x - p1.w / 2 : p1.x + p1.w / 2;
                        let ex = side === 'left' ? p2.x - p2.w / 2 : p2.x + p2.w / 2;
                        ctx.moveTo(sx, p1.y - p1.h);
                        ctx.lineTo(ex, p2.y - p2.h);
                        ctx.lineTo(ex, p2.y + p2.h);
                        ctx.lineTo(sx, p1.y + p1.h);
                        ctx.closePath();
                        ctx.fill();
                    }
                }
            }
        };

        // Draw side walls of depth slice
        for (let offsetX = -3; offsetX <= 3; offsetX++) {
            const ox = tx + offsetX * px;
            const oy = ty + offsetX * py;
            const isSolid = oy >= 0 && oy < map.length && ox >= 0 && ox < map[oy].length && (map[oy][ox] === 1 || map[oy][ox] === 4);

            if (isSolid) {
                if (offsetX < 0) {
                    const rx = tx + (offsetX + 1) * px;
                    const ry = ty + (offsetX + 1) * py;
                    const rightEmpty = !(ry >= 0 && ry < map.length && rx >= 0 && rx < map[ry].length && (map[ry][rx] === 1 || map[ry][rx] === 4));
                    if (rightEmpty) fillWall(dist, offsetX, 'right');
                }
                if (offsetX > 0) {
                    const lx = tx + (offsetX - 1) * px;
                    const ly = ty + (offsetX - 1) * py;
                    const leftEmpty = !(ly >= 0 && ly < map.length && lx >= 0 && lx < map[ly].length && (map[ly][lx] === 1 || map[ly][lx] === 4));
                    if (leftEmpty) fillWall(dist, offsetX, 'left');
                }
            }
        }

        // Draw front walls of depth slice
        for (let offsetX = -3; offsetX <= 3; offsetX++) {
            const ox = tx + offsetX * px;
            const oy = ty + offsetX * py;
            const isSolid = oy >= 0 && oy < map.length && ox >= 0 && ox < map[oy].length && (map[oy][ox] === 1 || map[oy][ox] === 4);

            if (isSolid) {
                fillWall(dist, offsetX, 'front');
            } else {
                const tile = (oy >= 0 && oy < map.length && ox >= 0 && ox < map[oy].length) ? map[oy][ox] : 0;
                // 距離に応じた暗度（壁と同じ計算）
                const darkness = Math.max(0, Math.min(0.8, dist * 0.15));

                if (tile === 3) {
                    const p = getProj(dist + 0.5, offsetX);
                    if (assets.stair_down.loaded) {
                        ctx.drawImage(assets.stair_down.img, p.x - p.w / 2, p.y - p.h, p.w, p.h * 2);
                        if (darkness > 0) {
                            ctx.fillStyle = `rgba(0, 0, 0, ${darkness})`;
                            ctx.fillRect(p.x - p.w / 2, p.y - p.h, p.w, p.h * 2);
                        }
                    } else {
                        ctx.fillStyle = `rgba(255, 0, 255, ${1 - darkness})`;
                        ctx.fillRect(p.x - p.w / 4, p.y + p.h / 2, p.w / 2, p.h / 4);
                    }
                } else if (tile === 2) {
                    const p = getProj(dist + 0.5, offsetX);
                    if (assets.stair_up.loaded) {
                        ctx.drawImage(assets.stair_up.img, p.x - p.w / 2, p.y - p.h, p.w, p.h * 2);
                        if (darkness > 0) {
                            ctx.fillStyle = `rgba(0, 0, 0, ${darkness})`;
                            ctx.fillRect(p.x - p.w / 2, p.y - p.h, p.w, p.h * 2);
                        }
                    } else {
                        ctx.fillStyle = `rgba(0, 255, 255, ${1 - darkness})`;
                        ctx.fillRect(p.x - p.w / 4, p.y - p.h / 4, p.w / 2, p.h / 2);
                    }
                }
            }
        }
    }

    drawMinimap() {
        const ctx = this.mCtx;
        const size = 160 / MAP_SIZE;
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, 160, 160);

        const map = LEVELS[this.currentFloor];
        const visited = this.visited[this.currentFloor];

        for (let y = 0; y < map.length; y++) {
            for (let x = 0; x < map[y].length; x++) {
                if (!visited[y] || !visited[y][x]) continue;

                const mc = map[y][x];
                if (mc === 1 || mc === 4) { // Wall or hidden door
                    ctx.fillStyle = '#00ff41';
                } else if (mc === 3) {
                    ctx.fillStyle = '#ff00ff';
                } else if (mc === 2) {
                    ctx.fillStyle = '#00ffff';
                } else if (mc === 6) { // Dark zones show dark green/grey on minimap
                    ctx.fillStyle = '#112211';
                } else if (mc === 8) { // Boss Tile
                    ctx.fillStyle = '#ff0000';
                } else {
                    // Empty floors, spinners, teleporters all look like safe floor on map
                    ctx.fillStyle = '#113311';
                }
                ctx.fillRect(x * size, y * size, size - 1, size - 1);
            }
        }

        ctx.fillStyle = '#fff';
        const px = this.playerPos.x * size + size / 2;
        const py = this.playerPos.y * size + size / 2;
        ctx.beginPath();
        ctx.arc(px, py, size / 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#fff';
        ctx.beginPath();
        ctx.moveTo(px, py);
        const dx = [0, 1, 0, -1][this.playerPos.dir] * size;
        const dy = [-1, 0, 1, 0][this.playerPos.dir] * size;
        ctx.lineTo(px + dx, py + dy);
        ctx.stroke();
    }

    updateUI() {
        const list = document.getElementById('party-list');
        list.innerHTML = '';
        this.party.forEach((p, i) => {
            const div = document.createElement('div');
            div.className = `party-member ${this.state === 'BATTLE' && this.turnIndex === i ? 'active' : ''}`;
            const hpW = (p.hp / p.maxHp) * 100;
            const mpW = p.maxMp > 0 ? (p.mp / p.maxMp) * 100 : 0;
            div.innerHTML = `
                <div style="display:flex; justify-content:space-between"><strong>${p.name}</strong> <span>Lv${p.level} ${p.job}</span></div>
                <div class="stat-bar"><div class="stat-fill" style="width:${hpW}%"></div></div>
                <div style="font-size:10px">HP ${p.hp}/${p.maxHp}  MP ${p.mp}/${p.maxMp}</div>
            `;
            list.appendChild(div);
        });
        if (this.state === 'BATTLE') {
            document.querySelectorAll('.battle-btn').forEach(b => b.disabled = (this.currentBattle.phase !== 'INPUT'));
        }
    }
}

let game;
window.onload = () => { game = new Game(); };