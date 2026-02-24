/**
             * CONSTANTS & DATA
             */
const VIEW_DIST = 6;
const MAP_SIZE = 16;

const CLASSES = {
    WARRIOR: { name: '戦士', hp: 30, mp: 0, str: 15, int: 5, vit: 15, agi: 8, luk: 5 },
    THIEF: { name: '盗賊', hp: 20, mp: 10, str: 10, int: 8, vit: 8, agi: 15, luk: 15 },
    CLERIC: { name: '僧侶', hp: 22, mp: 12, str: 8, int: 12, vit: 10, agi: 10, luk: 10 },
    MAGE: { name: '魔術師', hp: 15, mp: 25, str: 5, int: 18, vit: 5, agi: 12, luk: 8 },
    SAMURAI: { name: '侍', hp: 25, mp: 12, str: 16, int: 8, vit: 12, agi: 14, luk: 8 },
    MONK: { name: '武闘家', hp: 28, mp: 0, str: 14, int: 6, vit: 14, agi: 16, luk: 6 },
    ARCHER: { name: '狩人', hp: 20, mp: 10, str: 12, int: 8, vit: 10, agi: 18, luk: 12 }
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
    { hp: 2.8, atk: 1.5, agi: 0.6 }, // 7: オーガ (Tank, High ATK, Slow)
    { hp: 2.0, atk: 1.8, agi: 1.2 }, // 8: デーモン (Strong all-rounder)
    { hp: 2.5, atk: 2.5, agi: 1.0 }, // 9: ドラゴン (Boss level base)
    { hp: 3.5, atk: 1.1, agi: 0.4 }, // 10: ゾンビ (High HP, Very Slow)
    { hp: 0.7, atk: 3.5, agi: 0.9 }, // 11: メイジ (Low HP, Very High ATK)
    { hp: 1.3, atk: 1.4, agi: 1.5 }, // 12: ヴァンパイア (Strong, Fast)
    { hp: 1.2, atk: 5.0, agi: 1.1 }  // 13: デーモンメイジ (High ATK magic)
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
    // Make late game drastically harder by using an exponential baseline.
    // idx goes up to 69 (14 base monsters * 5 variants).
    // idx / 7 evaluates to floor 0 ~ 9 roughly.
    const floorRaw = idx / 7;
    // Base scale slowly grows, but adds exponential growth for late game
    const scale = 1 + floorRaw * 0.2 + Math.pow(1.3, floorRaw) * 0.15;

    const statsMult = MONSTER_STATS_MULT[m.imgIndex] || { hp: 1, atk: 1, agi: 1 };

    MONSTERS.push({
        name: m.name,
        level: Math.floor(floorRaw) + 1,
        hp: Math.floor(25 * scale * statsMult.hp),
        atk: Math.floor(8 * scale * statsMult.atk),
        agi: Math.floor((5 + floorRaw * 2.5) * statsMult.agi),
        exp: Math.floor(15 * scale * statsMult.hp),
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

    // Seed fixed floor events for 3F(2), 4F(3), 5F(4), 6F(5), 7F(6), 8F(7), and 9F(8)
    if (i >= 2 && i <= 8) {
        let emptySpots = [];
        for (let r = 1; r < map.length - 1; r++) {
            for (let c = 1; c < map[r].length - 1; c++) {
                // Find safe, empty spots that are not stairs or boss
                if (map[r][c] === 0 && !(r === 1 && c === 1) && map[r][c] !== 2 && map[r][c] !== 3 && map[r][c] !== 8) {
                    emptySpots.push({ r, c });
                }
            }
        }
        if (emptySpots.length > 0) {
            let spot = emptySpots[Math.floor(Math.random() * emptySpots.length)];
            map[spot.r][spot.c] = 9; // 9 = Event NPC
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
 * AUDIO MANAGER
 */
class AudioManager {
    constructor() {
        this.sounds = {};
        this.bgmAudio = null;
        this.isMuted = false;
        this.isAudioUnlocked = false;

        this.loadSound('bgm_intro', 'assets/bgm_intro.mp3', true);
        this.loadSound('bgm_explore', 'assets/bgm_explore.mp3', true);
        this.loadSound('bgm_battle', 'assets/bgm_battle.mp3', true);
        this.loadSound('bgm_boss', 'assets/bgm_boss.mp3', true);

        this.loadSound('se_attack', 'assets/se_attack.mp3', false);
        this.loadSound('se_magic', 'assets/se_magic.mp3', false);
        this.loadSound('se_damage', 'assets/se_damage.mp3', false);
        this.loadSound('se_dead', 'assets/se_dead.mp3', false);
        this.loadSound('se_victory', 'assets/se_victory.mp3', false);
    }

    loadSound(name, url, isBgm) {
        const audio = new Audio(url);
        if (isBgm) audio.loop = true;
        this.sounds[name] = audio;
    }

    unlockAudio() {
        if (this.isAudioUnlocked) return;
        // On first interaction, just load the audio tags to ensure the browser has permission
        Object.values(this.sounds).forEach(audio => {
            audio.load();
        });
        this.isAudioUnlocked = true;
    }

    playSE(name, vol = 1.0) {
        if (this.isMuted || !this.sounds[name]) return;
        try {
            const se = this.sounds[name].cloneNode(); // Clone to allow overlapping sounds
            se.volume = vol;
            se.play().catch(e => { }); // Catch missing file/not interacted errors silently
        } catch (e) { }
    }

    playBGM(name, vol = 0.5) {
        if (this.isMuted) return;
        this.stopBGM();
        if (!this.sounds[name]) return;

        try {
            const bgm = this.sounds[name];
            bgm.volume = vol;
            bgm.currentTime = 0;
            bgm.play().catch(e => {
                console.warn(`Could not play ${name}:`, e);
            });
            this.bgmAudio = bgm;
        } catch (e) { }
    }

    stopBGM() {
        if (this.bgmAudio) {
            this.bgmAudio.pause();
            this.bgmAudio.currentTime = 0;
            this.bgmAudio = null;
        }
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        const btn = document.getElementById('btn-mute');
        if (btn) {
            btn.textContent = this.isMuted ? '🔇' : '🔊';
        }

        if (this.isMuted) {
            if (this.bgmAudio) {
                this.bgmAudio.pause();
            }
        } else {
            // Resume BGM if it was playing and we unmuted
            if (this.bgmAudio) {
                this.bgmAudio.play().catch(e => { });
            }
        }
    }
}
const audio = new AudioManager();

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
        this.karma = 0;

        this.currentBattle = null;
        this.turnIndex = 0;
        this.npcFlags = {
            helpedAdventurer: false, event5FDone: false, event9FDone: false,
            metSwordsman: false, event3FDone: false, event7FDone: false,
            savedGoblin: false, friendGoblin: false, event4FDone: false, event6FDone: false,
            event8FDone: false
        };

        this.init();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());

        document.getElementById('btn-reroll').onclick = () => this.rollParty();
        document.getElementById('btn-start').onclick = () => this.startStory();
        document.getElementById('btn-story-next').onclick = () => {
            audio.unlockAudio();
            this.displayNextStory();
        };
        document.getElementById('btn-story-skip').onclick = () => {
            audio.unlockAudio();
            this.startGame();
        };

        // Resume audio on ANY click, then play intro if we are still in START/STORY
        document.addEventListener('click', () => {
            audio.unlockAudio();
            if (!this.introPlayed && (this.state === 'START' || this.state === 'STORY')) {
                audio.playBGM('bgm_intro');
                this.introPlayed = true;
            }
        });

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

    startStory() {
        audio.unlockAudio();

        // Update base stats to include allocated bonus points (used for equipment requirements)
        this.party.forEach(p => {
            p.baseStr = p.str;
            p.baseInt = p.int;
            p.baseVit = p.vit;
            p.baseAgi = p.agi;
            p.baseLuk = p.luk;
        });

        document.getElementById('char-create-screen').style.display = 'none';
        document.getElementById('story-screen').style.display = 'flex';
        this.storyIndex = 0;

        this.state = 'STORY';
        if (!this.introPlayed) {
            audio.playBGM('bgm_intro');
            this.introPlayed = true;
        }
        this.storyMessages = [
            "酒場にて...<br>薄暗い店内に、冒険者たちの喧騒が響いている。",
            "バーテンダー<br>「地下迷宮の話は知っているかい？<br>どうやらあそこには『アビスロード』という強大な魔物が<br>潜んでいて、最近起きている災いの元になっているらしい。」",
            "バーテンダー<br>「これまで多くの冒険者がアビスロードを狩るべく<br>迷宮に入ったが、大多数が帰らぬ者となっている...」",
            "バーテンダー<br>「ヤツには多額の懸賞金がかけられている。<br>倒せば一定期間平和が訪れるが、時が経てばまた復活する<br>厄介な存在だそうだ。」",
            "誰からともなく、名乗りをあげる声があった。",
            `${this.party[0].name}<br>「...なるほどな。<br>この酒場には腕利きが集まってるんだろ？」`,
            "そう言うと、周囲にいた者たちが次々に立ち上がった。",
            `${this.party[1].name}<br>「面白そうじゃないか。<br>ふふ、私も一口乗るよ。」`,
            `${this.party[2].name}<br>「迷宮か...強敵との戦い、悪くないな。<br>私も行こう。」`,
            `${this.party[3].name}<br>「よし、じゃあこの4人で決まりだな！<br>早速迷宮へ乗り込もうぜ！」`,
            "こうして、彼らはその場の勢いで<br>恐るべき迷宮へと足を踏み入れることになった——"
        ];
        this.displayNextStory();
    }

    displayNextStory() {
        const storyContent = document.getElementById('story-content');
        const nextBtn = document.getElementById('btn-story-next');

        if (this.storyIndex >= this.storyMessages.length) {
            document.getElementById('story-screen').style.display = 'none';
            this.startGame();
            return;
        }

        const msg = this.storyMessages[this.storyIndex];
        storyContent.innerHTML = `<div class="story-anim">${msg}</div>`;
        this.storyIndex++;

        nextBtn.style.display = 'none';
        setTimeout(() => {
            nextBtn.style.display = 'inline-block';
            if (this.storyIndex >= this.storyMessages.length) {
                nextBtn.textContent = '迷宮へ向かう';
                nextBtn.style.color = '#f55';
                nextBtn.style.borderColor = '#f55';
            } else {
                nextBtn.textContent = '次へ ▼';
                nextBtn.style.color = '#ffcc00';
                nextBtn.style.borderColor = '#ffcc00';
            }
        }, 800);
    }

    startGame() {
        audio.unlockAudio();
        this.state = 'EXPLORE';
        this.startTime = Date.now();
        document.getElementById('story-screen').style.display = 'none';
        this.addLog("深淵の迷宮へようこそ。B10Fのボス討伐を目指せ。");
        audio.playBGM('bgm_explore');
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
                case 's': this.battleAction('skill'); break;
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
        } else if (tile === 9) { // Event NPC Tile
            if ((this.currentFloor === 2 && !this.npcFlags.event3FDone) ||
                (this.currentFloor === 3 && (!this.npcFlags.event4FDone || (this.npcFlags.friendGoblin && !this.npcFlags.rewardedGoblin))) ||
                (this.currentFloor === 4 && !this.npcFlags.event5FDone) ||
                (this.currentFloor === 5 && !this.npcFlags.event6FDone) ||
                (this.currentFloor === 6 && !this.npcFlags.event7FDone) ||
                (this.currentFloor === 7 && !this.npcFlags.event8FDone) ||
                (this.currentFloor === 8 && !this.npcFlags.event9FDone)) {
                this.addLog("誰かがいるようだ...");
                if (this.currentFloor === 2) this.triggerEvent(3);
                else if (this.currentFloor === 3) this.triggerEvent(4);
                else if (this.currentFloor === 4) this.triggerEvent(5);
                else if (this.currentFloor === 5) this.triggerEvent(6);
                else if (this.currentFloor === 6) this.triggerEvent(7);
                else if (this.currentFloor === 7) this.triggerEvent(8);
                else if (this.currentFloor === 8) this.triggerEvent(9);
            } else {
                this.addLog("しかし、そこにはもう誰もいない...");
            }
        } else if (tile === 4) { // Hidden Door
            this.addLog("隠し扉から奥へ進んだ...");
            floorData[this.playerPos.y][this.playerPos.x] = 0; // Remoe hidden door once stepped on

            if (Math.random() < 0.7) {
                // 70% chance of powerful item
                this.addLog("誰も足を踏み入れていない部屋だ！宝箱を見つけた！");
                const currentLvl = this.currentFloor + 1;
                const minLevel = Math.max(1, currentLvl); // Base floor level
                const maxLevel = Math.min(10, currentLvl + 4); // Up to +4 floor!
                const pool = ITEMS.filter(i => (i.level || 1) >= minLevel && (i.level || 1) <= maxLevel);

                if (pool.length > 0) {
                    const baseDrop = pool[Math.floor(Math.random() * pool.length)];
                    const drop = { ...baseDrop };

                    if (drop.type !== 'consumable') {
                        // Force a good prefix for hidden door loot
                        const goodPrefixes = ITEM_PREFIXES.filter(p => p.mult >= 1.5);
                        let prefix = goodPrefixes[Math.floor(Math.random() * goodPrefixes.length)] || ITEM_PREFIXES[2];
                        drop.name = prefix.name + drop.name;

                        let statArr = [];
                        if (drop.atk !== undefined) { drop.atk = Math.round(drop.atk * prefix.mult); statArr.push(`ATK+${drop.atk}`); }
                        if (drop.def !== undefined) { drop.def = Math.round(drop.def * prefix.mult); statArr.push(`DEF+${drop.def}`); }
                        if (drop.int !== undefined) { drop.int = Math.round(drop.int * prefix.mult); statArr.push(`INT+${drop.int}`); }
                        if (drop.agi !== undefined) { drop.agi = Math.round(drop.agi * prefix.mult); statArr.push(`AGI+${drop.agi}`); }
                        if (drop.luk !== undefined) { drop.luk = Math.round(drop.luk * prefix.mult); statArr.push(`LUK+${drop.luk}`); }

                        drop.desc = `${statArr.join(', ')} (元: ${baseDrop.name})`;
                    }
                    this.inventory.push(drop);
                    this.addLog(`「${drop.name}」を手に入れた！`);
                }
            } else {
                // 30% chance of powerful enemy
                this.addLog("部屋の奥から強力な魔物が現れた！");
                this.startBattle(true); // pass true for hidden door enemy
            }
        } else {
            // Normal floor tile
            this.checkEncounter();
        }
    }

    triggerEvent(floor) {
        this.state = 'EVENT';
        document.getElementById('explore-menu').style.display = 'none';

        const screen = document.getElementById('event-screen');
        const title = document.getElementById('event-title');
        const desc = document.getElementById('event-desc');
        const img = document.getElementById('event-img');
        const options = document.getElementById('event-options');

        screen.style.display = 'flex';
        options.innerHTML = '';

        // Determine event image name
        let imgName = `event_${floor}`;
        if (floor === 9) {
            imgName = this.npcFlags.helpedAdventurer ? 'event_9alive' : 'event_9dead';
        } else if (floor === 7) {
            imgName = this.npcFlags.metSwordsman ? 'event_7mad' : 'event_7dead';
        } else if (floor === 4) {
            // Re-visit case
            if (this.npcFlags.friendGoblin && !this.npcFlags.rewardedGoblin) {
                imgName = 'event_4reunion';
            } else {
                imgName = 'event_4child';
            }
        } else if (floor === 6) {
            imgName = this.npcFlags.savedGoblin ? 'event_6parent_friend' : 'event_6parent_enemy';
        }

        // Load event image
        img.src = `assets/${imgName}.png`;
        img.style.display = 'block';
        img.onerror = () => { img.style.display = 'none'; }; // Hide if image is missing

        if (floor === 3) {
            title.textContent = "気前のよい剣士『アルトリウス』";
            desc.innerHTML = "陽気な笑みを浮かべた見目麗しい剣士が、馴れ馴れしく話しかけてきた。<br><br>「やあ君たち、そんな装備でここに来たのかい？ははは、無茶をする！」<br><br>彼は気のいい男のようだ。自分のおさがりの武器を差し出してきた。<br>「ここでの掟は持ちつ持たれつさ。俺のおさがりだけど、持っていくといい。いつか恩返ししてくれよ？」";

            const btnThanks = document.createElement('button');
            btnThanks.className = 'btn';
            btnThanks.textContent = '受け取る';
            btnThanks.onclick = () => {
                this.karma += 10;
                this.addLog("気前のよい剣士アルトリウスから ロングソード をもらった！");
                this.npcFlags.metSwordsman = true;
                this.npcFlags.event3FDone = true;

                const weapon = ITEMS.find(i => i.name === 'ロングソード');
                if (weapon) this.inventory.push({ ...weapon });
                else this.inventory.push({ name: 'ロングソード', type: 'weapon', level: 2, atk: 5, req: { str: 8 }, desc: '標準的な剣(ATK+5)' });

                this.closeEvent();
            };
            options.appendChild(btnThanks);

        } else if (floor === 4) {
            if (this.npcFlags.friendGoblin && !this.npcFlags.rewardedGoblin) {
                // Re-visit after helping parent
                title.textContent = "ゴブリン親子の再会";
                desc.innerHTML = "以前見逃した小ゴブリンと、親ゴブリンが抱き合って喜んでいる。<br><br>親ゴブリンがこちらに気づき、深く頭を下げて<br>光り輝く小瓶を差し出してきた。";

                const btnAccept = document.createElement('button');
                btnAccept.className = 'btn';
                btnAccept.textContent = '受け取る';
                btnAccept.onclick = () => {
                    this.karma += 30;
                    this.addLog("ゴブリンの親子から 妖精の霊薬 をもらった！");
                    this.npcFlags.rewardedGoblin = true;
                    // Note: Ensure flag event4FDone remains true so standard interaction stops

                    const elixir = {
                        name: '妖精の霊薬', type: 'consumable', infinite: true, targetAll: true, desc: '何度でも使える全体回復薬',
                        effect: () => { this.party.forEach(mbr => { if (mbr.hp > 0) mbr.hp = Math.min(mbr.maxHp, mbr.hp + 50); }); this.addLog(`妖精の霊薬を使った！全員のHPが50回復！`); }
                    };
                    this.inventory.push(elixir);
                    this.closeEvent();
                };
                options.appendChild(btnAccept);

                const btnFight = document.createElement('button');
                btnFight.className = 'btn';
                btnFight.style.color = '#f55';
                btnFight.style.borderColor = '#f55';
                btnFight.textContent = '戦う';
                btnFight.onclick = () => {
                    this.karma -= 100;
                    this.addLog("魔物から施しを受ける義理はない。あなたは全ての持ち物を奪い取るべく剣を抜いた。");
                    this.npcFlags.rewardedGoblin = true;
                    document.getElementById('event-screen').style.display = 'none';

                    this.state = 'BATTLE';
                    this.currentBattle = {
                        isBoss: false,
                        isGoblinEvent: true, // Custom flag
                        monsters: [{
                            id: 'monster-0',
                            name: "キングゴブリン",
                            originalName: "キングゴブリン",
                            hp: 900, maxHp: 900, currentHp: 900, atk: 95, agi: 25, exp: 600, level: 6,
                            svg: `<img src="assets/event_6parent_enemy.png" style="width:100%; height:100%; object-fit:contain; transform:scale(1.5);" />`
                        }],
                        turnOrder: [],
                        phase: 'INPUT',
                        logs: ["防衛のためキングゴブリンが立ちはだかった！"]
                    };

                    document.getElementById('explore-menu').style.display = 'none';
                    document.getElementById('battle-menu').style.display = 'flex';
                    const mo = document.getElementById('monster-overlay');
                    mo.innerHTML = `<div class="monster-img-container" id="monster-img-0">${this.currentBattle.monsters[0].svg}</div>`;
                    mo.style.display = 'flex';
                    mo.style.justifyContent = 'center';

                    audio.playBGM('bgm_battle');
                    this.turnIndex = 0;
                    this.updateUI();
                };
                options.appendChild(btnFight);

            } else {
                title.textContent = "はぐれゴブリン";
                desc.innerHTML = "親とはぐれた子供のゴブリンが壁の隅で震えている。<br><br>ひどく怯えており、こちらに襲いかかってくる様子はない。";

                const btnFight = document.createElement('button');
                btnFight.className = 'btn';
                btnFight.textContent = '戦う';
                btnFight.onclick = () => {
                    this.karma -= 50;
                    this.addLog("魔物の幼生とはいえ、生かしておけばいずれ脅威となる。あなたは静かに武器を構えた。");
                    this.npcFlags.event4FDone = true;
                    document.getElementById('event-screen').style.display = 'none';

                    this.state = 'BATTLE';
                    this.currentBattle = {
                        isBoss: false,
                        monsters: [{
                            id: 'monster-0',
                            name: "スモールゴブリン",
                            originalName: "スモールゴブリン",
                            hp: 40, maxHp: 40, currentHp: 40, atk: 10, agi: 5, exp: 20, level: 4,
                            svg: `<img src="assets/event_4child.png" style="width:100%; height:100%; object-fit:contain; transform:scale(0.8);" />`
                        }],
                        turnOrder: [],
                        phase: 'INPUT',
                        logs: ["スモールゴブリンが現れた！"]
                    };

                    document.getElementById('explore-menu').style.display = 'none';
                    document.getElementById('battle-menu').style.display = 'flex';
                    const mo = document.getElementById('monster-overlay');
                    mo.innerHTML = `<div class="monster-img-container" id="monster-img-0">${this.currentBattle.monsters[0].svg}</div>`;
                    mo.style.display = 'flex';
                    mo.style.justifyContent = 'center';

                    audio.playBGM('bgm_battle');
                    this.turnIndex = 0;
                    this.updateUI();
                };

                const btnMercy = document.createElement('button');
                btnMercy.className = 'btn';
                btnMercy.style.color = '#888';
                btnMercy.textContent = '見逃す';
                btnMercy.onclick = () => {
                    this.karma += 20;
                    this.addLog("不要な戦闘は避けるべきだ。あなたは震えるゴブリンを横目に、足早に退避した。");
                    this.npcFlags.savedGoblin = true;
                    this.npcFlags.event4FDone = true;
                    this.closeEvent();
                };
                options.appendChild(btnFight);
                options.appendChild(btnMercy);
            }

        } else if (floor === 5) {
            title.textContent = "負傷した冒険者";
            desc.innerHTML = "薄気味悪い通路の隅に、<br>血を流して倒れている冒険者がいる。<br><br>息も絶え絶えにこちらを見上げ、<br>助けを求めているようだ...。<br><br>※助ける場合、パーティ全員のMPが0になり、<br>所持している消費アイテム（ポーション等）をすべて失います。";

            const btnHelp = document.createElement('button');
            btnHelp.className = 'btn';
            btnHelp.textContent = '助ける';
            btnHelp.onclick = () => {
                this.karma += 50;
                this.addLog("あなたは手持ちの道具と魔力を駆使して冒険者を治療した！");
                this.npcFlags.helpedAdventurer = true;
                this.npcFlags.event5FDone = true;

                // Set all MP to 0
                this.party.forEach(p => p.mp = 0);

                // Remove all consumable items from inventory
                this.inventory = this.inventory.filter(item => item.type !== 'consumable');

                this.addLog("パーティ全員のMPが0になり、全消費アイテムを失った...");
                this.closeEvent();
            };

            const btnAbandon = document.createElement('button');
            btnAbandon.className = 'btn';
            btnAbandon.style.borderColor = '#888';
            btnAbandon.style.color = '#888';
            btnAbandon.textContent = '見捨てる';
            btnAbandon.onclick = () => {
                this.karma -= 20;
                this.addLog("自分たちの生存すら保証されていない迷宮で、彼を背負う余裕はない。あなたは無言で立ち去った。");
                this.npcFlags.event5FDone = true;
                this.closeEvent();
            };

            options.appendChild(btnHelp);
            options.appendChild(btnAbandon);

        } else if (floor === 7) {
            title.textContent = "狂乱の剣士『アルトリウス』";
            if (this.npcFlags.metSwordsman) {
                desc.innerHTML = "（……彼は、３階でロングソードをくれた気前のよい冒険者だ。あの快活な笑顔は鳴りを潜め、今はただ血走った双眸で虚空を睨みつけている）<br><br>迷宮の瘴気にあてられ、彼の精神は完全に崩壊していた。口元から止めどなく涎を垂らし、かつて君たちに軽口を叩いたその口で、今は意味をなさない呪詛を吐き続けている。<br><br>「アァ…モウ…モウ何モカモオシマイダ…！オマエタチモ、俺ノ邪魔ヲスルノカ…ッ！」<br><br>突如、男が奇声を上げ、得物を振りかざして襲いかかってきた！";

                const btnFight = document.createElement('button');
                btnFight.className = 'btn';
                btnFight.textContent = '戦う';
                btnFight.onclick = () => {
                    this.karma += 10;
                    this.addLog("狂気に飲まれた剣士が襲いかかってきた！");
                    this.npcFlags.event7FDone = true;
                    document.getElementById('event-screen').style.display = 'none';

                    // Trigger custom battle
                    this.state = 'BATTLE';
                    this.currentBattle = {
                        isBoss: false,
                        isSwordsmanEvent: true, // Custom flag to drop item on win
                        monsters: [{
                            id: 'monster-0',
                            name: "狂乱の剣士",
                            originalName: "狂乱の剣士",
                            hp: 1500, maxHp: 1500, currentHp: 1500, atk: 120, agi: 45, exp: 900, level: 7,
                            svg: `<img src="assets/event_7mad.png" style="width:100%; height:100%; object-fit:contain; transform:scale(1.2);" />`
                        }],
                        turnOrder: [],
                        phase: 'INPUT',
                        logs: ["狂乱の剣士 現る！"]
                    };

                    document.getElementById('explore-menu').style.display = 'none';
                    document.getElementById('battle-menu').style.display = 'flex';
                    const mo = document.getElementById('monster-overlay');
                    mo.innerHTML = `<div class="monster-img-container" id="monster-img-0">${this.currentBattle.monsters[0].svg}</div>`;
                    mo.style.display = 'flex';
                    mo.style.justifyContent = 'center';

                    audio.playBGM('bgm_battle');
                    this.turnIndex = 0;
                    this.updateUI();
                };

                const btnRun = document.createElement('button');
                btnRun.className = 'btn';
                btnRun.style.borderColor = '#888';
                btnRun.style.color = '#888';
                btnRun.textContent = '逃げる';
                btnRun.onclick = () => {
                    this.karma -= 10;
                    this.addLog("狂気に蝕まれた彼から目を背け、あなたは足早にその場を離れた。");
                    this.npcFlags.event7FDone = true;

                    // 80% HP reduction
                    this.party.forEach(p => {
                        if (p.hp > 0) {
                            p.hp = Math.max(1, Math.floor(p.hp * 0.2));
                        }
                    });
                    this.addLog("逃走の代償として、パーティ全員が深手を負った（HP残り20%）");
                    this.closeEvent();
                };

                options.appendChild(btnFight);
                options.appendChild(btnRun);

            } else {
                desc.innerHTML = "通路の先で、冒険者の無惨な死体を発見した。<br><br>彼の傍らには、禍々しい血の気を放つ<br>装備品が転がっている。";

                const btnLoot = document.createElement('button');
                btnLoot.className = 'btn';
                btnLoot.style.color = '#888';
                btnLoot.textContent = '奪い取る';
                btnLoot.onclick = () => {
                    this.karma -= 20;
                    this.addLog("これは彼にはもう必要のない物だ。あなたは遺体から装備品を回収した。");
                    this.npcFlags.event7FDone = true;

                    const weapon = { name: "呪われた 狂戦士の剣", type: "weapon", atk: 45, desc: "強力だが所有者の精神を蝕む" };
                    this.inventory.push(weapon);
                    this.closeEvent();
                };
                options.appendChild(btnLoot);
            }

        } else if (floor === 6) {
            title.textContent = "親ゴブリン";
            if (this.npcFlags.savedGoblin) {
                desc.innerHTML = "巨大なキングゴブリンが立ちはだかった！<br>...しかし、敵意はないようだ。<br><br>どうやら、あなたが４階で自分の子供を見逃したことに<br>気づいているらしい。友好的に頭を下げている。";

                const btnNod = document.createElement('button');
                btnNod.className = 'btn';
                btnNod.textContent = '頷く';
                btnNod.onclick = () => {
                    this.karma += 20;
                    this.addLog("キングゴブリンは感謝を示すように低く唸った。");
                    this.npcFlags.friendGoblin = true;
                    this.npcFlags.event6FDone = true;
                    this.closeEvent();
                };
                options.appendChild(btnNod);
            } else {
                desc.innerHTML = "巨大なキングゴブリンが立ちはだかった！<br><br>子供を殺された怒り狂っているのか、<br>こちらを睨みつけ、巨大な棍棒を振り上げている！";

                const btnFight = document.createElement('button');
                btnFight.className = 'btn';
                btnFight.style.color = '#f55';
                btnFight.style.borderColor = '#f55';
                btnFight.textContent = '戦う';
                btnFight.onclick = () => {
                    this.addLog("怒れるキングゴブリンの咆哮が響く！");
                    this.npcFlags.event6FDone = true;
                    document.getElementById('event-screen').style.display = 'none';

                    this.state = 'BATTLE';
                    this.currentBattle = {
                        isBoss: false,
                        monsters: [{
                            id: 'monster-0',
                            name: "怒りのキングゴブリン",
                            originalName: "怒りのキングゴブリン",
                            hp: 900, maxHp: 900, currentHp: 900, atk: 95, agi: 25, exp: 600, level: 6,
                            svg: `<img src="assets/event_6parent_enemy.png" style="width:100%; height:100%; object-fit:contain; transform:scale(1.5);" />`
                        }],
                        turnOrder: [],
                        phase: 'INPUT',
                        logs: ["怒りのキングゴブリンが現れた！"]
                    };

                    document.getElementById('explore-menu').style.display = 'none';
                    document.getElementById('battle-menu').style.display = 'flex';
                    const mo = document.getElementById('monster-overlay');
                    mo.innerHTML = `<div class="monster-img-container" id="monster-img-0">${this.currentBattle.monsters[0].svg}</div>`;
                    mo.style.display = 'flex';
                    mo.style.justifyContent = 'center';

                    audio.playBGM('bgm_battle');
                    this.turnIndex = 0;
                    this.updateUI();
                };
                options.appendChild(btnFight);
            }

        } else if (floor === 8) {
            title.textContent = "闇の賢者";
            desc.innerHTML = "黒衣に身を包んだ、底知れぬ魔力を放つ老人が佇んでいる。<br><br>「ここまで辿り着くとはな。だが、お前たちの力では最深部の主には勝てまい。」<br>「どうだ。使えぬ者一人の『命の灯火』を吾輩に差し出さぬか？<br>それは、組織としての合理的な判断ではないかね……？」<br><br>※同意した場合、選択したメンバーが<strong>永久にロスト</strong>しますが、<br>引き換えに最強クラスの装備セットを入手します。";

            const alive = this.party.filter(p => p.hp > 0);

            if (alive.length <= 1) {
                const btnSolo = document.createElement('button');
                btnSolo.className = 'btn';
                btnSolo.textContent = '話しかける';
                btnSolo.onclick = () => {
                    this.addLog("「ほう…まさか自分自身を捧げるつもりか？…狂っているな。帰るがよい」");
                    this.closeEvent();
                };
                options.appendChild(btnSolo);
            } else {
                // Generate a sacrifice button for each alive member
                alive.forEach(sacrifice => {
                    const btnSacrifice = document.createElement('button');
                    btnSacrifice.className = 'btn';
                    btnSacrifice.style.color = '#f55';
                    btnSacrifice.style.borderColor = '#f55';
                    btnSacrifice.style.marginBottom = '5px';
                    btnSacrifice.textContent = `${sacrifice.name}を犠牲にする`;

                    btnSacrifice.onclick = () => {
                        if (!confirm(`本当に ${sacrifice.name} を生贄に捧げますか？\n(二度と蘇生できなくなります)`)) return;

                        // Unequip items first
                        ['weapon', 'armor', 'accessory'].forEach(slot => {
                            if (sacrifice.equipment[slot]) {
                                this.inventory.push(sacrifice.equipment[slot]);
                                sacrifice.equipment[slot] = null;
                            }
                        });

                        // Perma-death logic
                        sacrifice.hp = 0;
                        sacrifice.baseVit = -999; // Ensures they cannot be revived normally
                        this.karma -= 100;
                        this.addLog(`${sacrifice.name}「う、うそ。今まで一緒にやってきてここまできたんだぞ。一緒にアビスロードを倒そうよ・・・なあ・・・」`);
                        this.addLog(`闇の賢者の魔術により、${sacrifice.name}の命が吸い尽くされた……！`);

                        this.npcFlags.event8FDone = true;

                        // Generate Dark Sage Reward Sets
                        this.addLog("引き換えに「深淵の賢者セット」を手に入れた！");
                        const weapon = { name: "深淵の杖", type: "weapon", atk: 15, req: { int: 25 }, desc: "INT+80 とてつもない魔力を秘めた杖", intBonus: 80 };
                        const armor = { name: "黒き知恵のローブ", type: "armor", def: 30, req: { int: 20 }, desc: "INT+40 闇の魔力を編み込んだ法衣", intBonus: 40 };
                        const acc = { name: "賢者の石の欠片", type: "accessory", atk: 5, def: 5, req: { int: 20 }, desc: "INT+30 膨大な知識を注ぎ込まれた魔石", intBonus: 30 };

                        this.inventory.push(weapon, armor, acc);

                        this.closeEvent();
                    };
                    options.appendChild(btnSacrifice);
                });

                const btnReject = document.createElement('button');
                btnReject.className = 'btn';
                btnReject.style.color = '#888';
                btnReject.style.marginTop = '15px';
                btnReject.textContent = '拒絶する';
                btnReject.onclick = () => {
                    this.karma += 50;
                    this.addLog("「……そうか。ならば己の無力を呪いながら死ぬが良い」");
                    this.addLog("老人は薄れ、闇に溶け込むように消滅した。");
                    this.npcFlags.event8FDone = true;
                    this.closeEvent();
                };
                options.appendChild(btnReject);
            }

        } else if (floor === 9) {
            title.textContent = "９Fでの遭遇";
            if (this.npcFlags.helpedAdventurer) {
                desc.innerHTML = "見覚えのある冒険者が立っている！<br>彼は５階で助けたあの男だ。<br><br>「あの時は本当にありがとう。<br>おかげでここまで来られた。これはお礼だ、使ってくれ！」";

                const btnThanks = document.createElement('button');
                btnThanks.className = 'btn';
                btnThanks.textContent = '受け取る';
                btnThanks.onclick = () => {
                    this.karma += 20;
                    this.addLog("恩返しとして、伝説の装備セットを受け取った！");
                    this.npcFlags.event9FDone = true;

                    // Generate powerful generic items
                    const weapon = { name: "勇者の剣", type: "weapon", atk: 50, desc: "恩知らずには扱えない伝説の剣" };
                    const armor = { name: "英雄の鎧", type: "armor", def: 40, desc: "強固な守護をもたらす鎧" };
                    const acc = { name: "光の指輪", type: "accessory", atk: 10, def: 10, desc: "全ステータスを底上げする指輪" };

                    this.inventory.push(weapon, armor, acc);
                    this.closeEvent();
                };
                options.appendChild(btnThanks);
            } else {
                desc.innerHTML = "通路の先で、冒険者の無惨な死体を発見した。<br>５階で見捨てたあの男のようだ...。<br><br>彼の傍らには、禍々しいオーラを放つ<br>装備品が転がっている。";

                const btnLoot = document.createElement('button');
                btnLoot.className = 'btn';
                btnLoot.style.color = '#888';
                btnLoot.textContent = '奪い取る';
                btnLoot.onclick = () => {
                    this.karma -= 20;
                    this.addLog("これは彼にはもう必要のない物だ。遺体から装備品を回収した。");
                    this.npcFlags.event9FDone = true;

                    const weapon = { name: "呪われた 血塗られた刃", type: "weapon", atk: 60, desc: "強力だが所有者の精神を蝕む" };
                    const armor = { name: "呪われた 怨念の皮鎧", type: "armor", def: 50, desc: "無念を吸い込んだ不吉な防具" };
                    const acc = { name: "呪われた 破滅の首飾り", type: "accessory", atk: 20, def: -20, desc: "大きな力と引き換えに防御を捨てる" };

                    this.inventory.push(weapon, armor, acc);
                    this.closeEvent();
                };
                options.appendChild(btnLoot);
            }
        }
    }

    closeEvent() {
        document.getElementById('event-screen').style.display = 'none';
        document.getElementById('explore-menu').style.display = 'flex';
        this.state = 'EXPLORE';
        this.updateUI();
    }

    updateVisited() {
        const floorArray = this.visited[this.currentFloor];
        if (!floorArray) return;

        const maxLevel = LEVELS[this.currentFloor].length;
        const cx = this.playerPos.x;
        const cy = this.playerPos.y;

        // Reveal 3x3 surrounding tiles
        for (let y = -1; y <= 1; y++) {
            for (let x = -1; x <= 1; x++) {
                const ny = cy + y;
                const nx = cx + x;
                if (ny >= 0 && ny < maxLevel && nx >= 0 && nx < LEVELS[this.currentFloor][ny].length) {
                    floorArray[ny][nx] = true;
                }
            }
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
    startBattle(isHard = false) {
        this.state = 'BATTLE';
        let floorMonsters;

        if (isHard) {
            // Pick enemies from 2-3 floors deeper
            const targetFloor = Math.min(10, this.currentFloor + 2 + Math.floor(Math.random() * 2));
            floorMonsters = MONSTERS.filter(m => m.level === targetFloor);
            if (floorMonsters.length === 0) floorMonsters = MONSTERS.filter(m => m.level === 10);
        } else {
            floorMonsters = MONSTERS.filter(m => m.level === this.currentFloor + 1);
        }

        let numMonsters = 1;
        const r = Math.random();
        if (r > 0.6) numMonsters = 2; // 40% chance of 2
        if (r > 0.9) numMonsters = 3; // 10% chance of 3

        this.currentBattle = {
            monsters: [],
            turnOrder: [],
            phase: 'INPUT',
            isBoss: false
        };

        let moHtml = '';
        for (let i = 0; i < numMonsters; i++) {
            const data = floorMonsters.length > 0 ? floorMonsters[Math.floor(Math.random() * floorMonsters.length)] : MONSTERS[0];
            const mData = { ...data, currentHp: data.hp, id: `monster-${i}`, originalName: data.name };

            // Rename if duplicates exist
            const count = this.currentBattle.monsters.filter(m => m.originalName === mData.originalName).length;
            if (count > 0) mData.name = mData.name + " " + String.fromCharCode(65 + count); // A, B, C...
            else if (numMonsters > 1 && floorMonsters.filter(m => m.name === mData.name).length > 1) {
                mData.name = mData.name + " A";
            }

            this.currentBattle.monsters.push(mData);
            this.addLog(`${mData.name}が現れた！`);
            moHtml += `<div class="monster-img-container" id="monster-img-${i}">${mData.svg}</div>`;
        }

        document.getElementById('explore-menu').style.display = 'none';
        document.getElementById('battle-menu').style.display = 'flex';
        const mo = document.getElementById('monster-overlay');
        mo.innerHTML = moHtml;
        mo.style.display = 'flex'; // Changed to flex over block for side-by-side multiple

        audio.playBGM('bgm_battle');
        this.turnIndex = 0;
        this.updateUI();
    }

    startBossBattle() {
        this.state = 'BATTLE';

        const baseMonster = MONSTERS[MONSTERS.length - 1]; // Use King variant svg
        let bossData = {
            ...baseMonster,
            name: 'アビスロード',
            hp: 8500,
            atk: 180,
            agi: 60,
            exp: 30000,
            level: 10,
            id: 'monster-0'
        };

        this.currentBattle = {
            monsters: [{ ...bossData, currentHp: bossData.hp }],
            turnOrder: [],
            phase: 'INPUT',
            isBoss: true
        };

        this.addLog(`${bossData.name}が現れた！`);
        document.getElementById('explore-menu').style.display = 'none';
        document.getElementById('battle-menu').style.display = 'flex';

        const bossImgStr = `<img src="assets/boss.png" style="width:100%; height:100%; object-fit:contain; object-position:bottom; transform-origin:bottom; image-rendering:pixelated;" onerror="this.onerror=null; this.src='assets/monster_9.png';" />`;

        const mo = document.getElementById('monster-overlay');
        mo.innerHTML = `<div class="monster-img-container" id="monster-img-0" style="flex: none; width: 300px;">${bossImgStr}</div>`;
        mo.style.display = 'flex';
        mo.style.justifyContent = 'center';

        const imgCont = document.getElementById('monster-img-0');
        imgCont.style.transform = 'scale(1.5)';
        imgCont.style.filter = 'drop-shadow(0 0 10px red)';

        audio.playBGM('bgm_boss');
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
        const monsters = this.currentBattle.monsters;

        monsters.forEach(m => {
            if (m.currentHp > 0) {
                this.currentBattle.turnOrder.push({ actor: m, type: 'attack', isPlayer: false });
            }
        });

        this.currentBattle.turnOrder.sort((a, b) => (b.actor.agi || 10) - (a.actor.agi || 10));

        for (let action of this.currentBattle.turnOrder) {
            const aliveMonsters = monsters.filter(m => m.currentHp > 0);
            if (aliveMonsters.length === 0) break;

            if (action.isPlayer) {
                if (action.actor.hp <= 0) continue;
                audio.playSE('se_attack');

                // Pick random live target for standard single-target attacks
                let targetIdx = Math.floor(Math.random() * aliveMonsters.length);
                let monster = aliveMonsters[targetIdx];
                let monsterDOMId = monster.id;

                if (action.type === 'attack') {
                    const wpnAtk = (action.actor.equipment.weapon?.atk || 0) + (action.actor.equipment.accessory?.atk || 0);
                    const dmg = Math.max(1, (action.actor.str + wpnAtk) + Math.floor(Math.random() * 5) - 2);
                    monster.currentHp -= dmg;
                    this.addLog(`${action.actor.name}の攻撃！ ${monster.name}に${dmg}のダメージ！`);
                    this.showHitEffect(monsterDOMId, dmg);
                } else if (action.type === 'skill') {
                    audio.playSE('se_magic');
                    const job = action.actor.job;
                    if (job === '戦士') {
                        if (action.actor.hp > 5) {
                            action.actor.hp -= 5;
                            const wpnAtk = (action.actor.equipment.weapon?.atk || 0) + (action.actor.equipment.accessory?.atk || 0);
                            const dmg = Math.floor(((action.actor.str + wpnAtk) + Math.random() * 5) * 1.5);
                            monster.currentHp -= dmg;
                            this.addLog(`${action.actor.name}の全力斬り！(HP-5) ${monster.name}に${dmg}の大ダメージ！`);
                            this.showHitEffect(monsterDOMId, dmg);
                        } else {
                            this.addLog(`${action.actor.name}は体力が足りない！`);
                        }
                    } else if (job === '武闘家') {
                        if (action.actor.hp > 4) {
                            action.actor.hp -= 4;
                            const dmg = Math.floor(action.actor.str * 1.5 + action.actor.agi * 0.5);
                            monster.currentHp -= dmg;
                            this.addLog(`${action.actor.name}の気功波！(HP-4) ${monster.name}に防御無視の${dmg}ダメージ！`);
                            this.showHitEffect(monsterDOMId, dmg);
                        } else {
                            this.addLog(`${action.actor.name}は体力が足りない！`);
                        }
                    } else if (job === '盗賊') {
                        if (action.actor.mp >= 3) {
                            action.actor.mp -= 3;
                            const dmg = Math.floor(action.actor.agi * 1.8 + Math.random() * 5);
                            monster.currentHp -= dmg;
                            this.addLog(`${action.actor.name}の不意打ち！(MP-3) ${monster.name}に${dmg}のダメージ！`);
                            this.showHitEffect(monsterDOMId, dmg);
                        } else {
                            this.addLog(`${action.actor.name}はMPが足りない！`);
                        }
                    } else if (job === '僧侶') {
                        if (action.actor.mp >= 4) {
                            action.actor.mp -= 4;
                            let target = action.actor;
                            let minHpPct = target.hp / target.maxHp;
                            this.party.forEach(p => {
                                if (p.hp > 0 && (p.hp / p.maxHp) < minHpPct) {
                                    target = p;
                                    minHpPct = p.hp / p.maxHp;
                                }
                            });
                            const heal = Math.max(15, action.actor.int + 10);
                            target.hp = Math.min(target.maxHp, target.hp + heal);
                            this.addLog(`${action.actor.name}のヒール！(MP-4) ${target.name}のHPが${heal}回復！`);
                            const tgtIdx = this.party.indexOf(target);
                            if (tgtIdx !== -1) this.showHealEffect(tgtIdx, heal);
                        } else {
                            this.addLog(`${action.actor.name}はMPが足りない！`);
                        }
                    } else if (job === '魔術師') {
                        if (action.actor.mp >= 5) {
                            action.actor.mp -= 5;
                            this.addLog(`${action.actor.name}のファイヤーボール！(MP-5) 全体に炎が襲う！`);

                            aliveMonsters.forEach(m => {
                                const dmg = Math.max(10, Math.floor(action.actor.int * 1.5 + 5));
                                m.currentHp -= dmg;
                                this.addLog(`${m.name}に${dmg}のダメージ！`);
                                this.showHitEffect(m.id, dmg);
                            });
                        } else {
                            this.addLog(`${action.actor.name}はMPが足りない！`);
                        }
                    } else if (job === '侍') {
                        if (action.actor.mp >= 4) {
                            action.actor.mp -= 4;
                            const wpnAtk = (action.actor.equipment.weapon?.atk || 0) + (action.actor.equipment.accessory?.atk || 0);
                            const dmg1 = Math.floor((action.actor.str + wpnAtk) * 0.8 + Math.random() * 3);
                            const dmg2 = Math.floor((action.actor.str + wpnAtk) * 0.8 + Math.random() * 3);
                            monster.currentHp -= (dmg1 + dmg2);
                            this.addLog(`${action.actor.name}の燕返し！(MP-4) ${monster.name}に${dmg1}と${dmg2}の連続ダメージ！`);
                            this.showHitEffect(monsterDOMId, dmg1 + dmg2);
                        } else {
                            this.addLog(`${action.actor.name}はMPが足りない！`);
                        }
                    } else if (job === '狩人') {
                        if (action.actor.mp >= 3) {
                            action.actor.mp -= 3;
                            const dmg = Math.floor(action.actor.str + action.actor.agi * 1.2);
                            monster.currentHp -= dmg;
                            this.addLog(`${action.actor.name}の狙い撃ち！(MP-3) 急所を突いて${monster.name}に${dmg}のダメージ！`);
                            this.showHitEffect(monsterDOMId, dmg);
                        } else {
                            this.addLog(`${action.actor.name}はMPが足りない！`);
                        }
                    }
                } else if (action.type === 'run') {
                    if (Math.random() > 0.4) {
                        this.addLog("逃げ出した！");
                        audio.playBGM('bgm_explore');
                        this.endBattle(false);
                        return;
                    } else this.addLog("逃げられなかった！");
                }

                monsters.forEach(m => {
                    if (m.currentHp <= 0 && !m.deadLogged) {
                        m.deadLogged = true;
                        this.addLog(`${m.name}を倒した！`);
                    }
                });
            } else {
                if (action.actor.currentHp <= 0) continue; // Skip attacks if monster died before turn
                const aliveParty = this.party.filter(p => p.hp > 0);
                if (aliveParty.length === 0) break;

                const pIdx = this.party.findIndex(p => p === aliveParty[Math.floor(Math.random() * aliveParty.length)]);
                const target = this.party[pIdx];
                if (target) {
                    const armDef = (target.equipment.armor?.def || 0) + (target.equipment.accessory?.def || 0);
                    const dmg = Math.max(1, action.actor.atk - Math.floor((target.vit + armDef) / 2) + Math.floor(Math.random() * 3));
                    target.hp = Math.max(0, target.hp - dmg);
                    this.addLog(`${action.actor.name}の攻撃！ ${target.name}は${dmg}のダメージ！`);
                    this.showPartyHitEffect(pIdx, dmg);
                    audio.playSE('se_damage');
                }

                this.party.forEach(p => {
                    if (p.hp <= 0 && !p.deadLogged) {
                        p.deadLogged = true;
                        this.addLog(`${p.name}は倒れた...`);
                    }
                });
            }
            this.updateUI();

            // Re-check for remaining enemies after applying damage
            const remain = monsters.filter(m => m.currentHp > 0);
            if (remain.length === 0) break;

            await new Promise(r => setTimeout(r, 600));
        }

        const remainMonsters = monsters.filter(m => m.currentHp > 0);
        if (remainMonsters.length === 0) {
            audio.playSE('se_dead');
            this.addLog(`魔物たちを討伐した！`);
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
            audio.playBGM('bgm_explore');
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

    showHitEffect(monsterId, dmgNum) {
        audio.playSE('se_attack');
        // monsterId is 'monster-0', but DOM id is 'monster-img-0'
        const domId = monsterId.replace('monster-', 'monster-img-');
        const mNode = document.getElementById(domId);
        if (!mNode) return;
        mNode.classList.remove('target-hit');
        void mNode.offsetWidth; // trigger reflow
        mNode.classList.add('target-hit');

        const rect = mNode.getBoundingClientRect();

        const popup = document.createElement('div');
        popup.className = 'damage-popup';
        popup.textContent = dmgNum;
        // Calculate center position relative to document viewport
        popup.style.left = `${rect.left + (rect.width || 100) / 2 + window.scrollX}px`;
        popup.style.top = `${rect.top + (rect.height || 100) / 2 - 20 + window.scrollY}px`;

        document.body.appendChild(popup);
        setTimeout(() => { if (popup.parentNode) popup.remove(); }, 1000);

        // Hide monster smoothly if HP dropped to 0
        const mData = this.currentBattle.monsters.find(m => m.id === monsterId);
        if (mData && mData.currentHp <= 0) {
            mNode.style.transition = 'all 0.5s ease-out';
            mNode.style.opacity = '0';
            mNode.style.transform = 'scale(0.1)';
            setTimeout(() => {
                mNode.style.display = 'none';
            }, 500);
        }
    }

    showHealEffect(partyIdx, healNum) {
        const pNode = document.getElementById(`party-member-${partyIdx}`);
        if (!pNode) return;

        const rect = pNode.getBoundingClientRect();

        const popup = document.createElement('div');
        popup.className = 'heal-popup';
        popup.textContent = healNum;
        popup.style.left = `${rect.left + rect.width / 2 + window.scrollX}px`;
        popup.style.top = `${rect.top + rect.height / 2 - 20 + window.scrollY}px`;

        document.body.appendChild(popup);
        setTimeout(() => { if (popup.parentNode) popup.remove(); }, 1000);
    }

    showPartyHitEffect(partyIdx, dmgNum) {
        const pNode = document.getElementById(`party-member-${partyIdx}`);
        if (!pNode) return;
        pNode.classList.remove('target-hit');
        void pNode.offsetWidth; // trigger reflow
        pNode.classList.add('target-hit');

        const rect = pNode.getBoundingClientRect();

        const popup = document.createElement('div');
        popup.className = 'damage-popup';
        popup.textContent = dmgNum;
        popup.style.left = `${rect.left + rect.width / 2 + window.scrollX}px`;
        popup.style.top = `${rect.top + rect.height / 2 - 20 + window.scrollY}px`;

        document.body.appendChild(popup);
        setTimeout(() => { if (popup.parentNode) popup.remove(); }, 1000);
    }

    endBattle(won) {
        const mo = document.getElementById('monster-overlay');
        mo.style.transform = '';
        mo.style.filter = '';
        mo.innerHTML = '';

        if (won) {
            audio.playSE('se_victory');
            if (this.currentBattle.isBoss) {
                this.triggerEnding();
                return;
            }

            if (this.currentBattle.isSwordsmanEvent) {
                this.addLog("狂乱の剣士を退けた...！強力な名刀を手に入れた。");
                const specialWpn = { name: "名刀・狂瀾", type: "weapon", atk: 65, req: { str: 20 }, desc: "生気を吸う妖刀(ATK+65)" };
                this.inventory.push(specialWpn);
            }
            if (this.currentBattle.isGoblinEvent) {
                this.addLog("キングゴブリンを打ち倒すと、その手から小瓶と鉈が転がり落ちた…。");
                const elixir = {
                    name: '妖精の霊薬', type: 'consumable', infinite: true, targetAll: true, desc: '何度でも使える全体回復薬',
                    effect: () => { this.party.forEach(mbr => { if (mbr.hp > 0) mbr.hp = Math.min(mbr.maxHp, mbr.hp + 50); }); this.addLog(`妖精の霊薬を使った！全員のHPが50回復！`); }
                };
                const goblinWpn = { name: "キングゴブリンの鉈", type: "weapon", atk: 25, req: { str: 15 }, desc: "荒々しい一撃を放つ鉈(ATK+25)" };
                this.inventory.push(elixir, goblinWpn);
            }

            const exp = this.currentBattle.monsters.reduce((sum, m) => sum + m.exp, 0);
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
        if (won && !this.currentBattle?.isBoss) {
            audio.playBGM('bgm_explore');
        }
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
                    karma: this.karma,
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

                // XSS対策：HTMLタグのエスケープ処理
                const safeName = typeof data.name === 'string' ?
                    data.name.replace(/[&<>'"]/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[m])) : '名無し';
                const safeTime = typeof data.timeStr === 'string' ?
                    data.timeStr.replace(/[&<>'"]/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[m])) : '';
                const karmaStr = data.karma !== undefined ? `<span style="color:#aaf; font-size:12px; margin-left:10px;">[カルマ: ${parseInt(data.karma, 10)}]</span>` : '';

                html += `<div class="rank-item"><span>${rank}. ${safeName}${karmaStr}</span> <span style="color:#ffcc00;">${safeTime}</span></div>`;
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
                                ${p.job === '僧侶' ? `<button class="btn" style="padding:4px; font-size:10px; margin-bottom:2px;" onclick="game.castCampMagic(${idx})">回復魔法(3MP)</button>` : ''}
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
                        ? (item.targetAll
                            ? `<button class="btn" style="padding:2px 5px; font-size:10px;" onclick="game.useItem(null, ${itemIdx})">使う</button>`
                            : `<button class="btn" style="padding:2px 5px; font-size:10px;" onclick="game.showTargetSelection(${itemIdx}, 'use')">使う</button>`)
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
        if (caster.job !== '僧侶') return;
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
        let target = null;
        if (charIdx !== null && charIdx !== undefined) {
            target = this.party[charIdx];
            if (target && target.hp <= 0) {
                this.addLog(`${target.name}は倒れている...`);
                return;
            }
        }

        if (item.type === 'consumable') {
            if (item.effect) {
                item.effect(target); // Call custom effect (target might be null for targetAll items)
            } else if (target) {
                if (item.hpRestore) {
                    target.hp = Math.min(target.maxHp, target.hp + item.hpRestore);
                    this.addLog(`${target.name}は${item.name}を使った。HPが回復した！`);
                } else if (item.mpRestore) {
                    target.mp = Math.min(target.maxMp, target.mp + item.mpRestore);
                    this.addLog(`${target.name}は${item.name}を使った。MPが回復した！`);
                } else if (item.recover) {
                    target.hp = Math.min(target.maxHp, target.hp + item.recover);
                    this.addLog(`${target.name}は${item.name}を使用！ ${target.name}のHPが${item.recover}回復した！`);
                }
            }
            if (!item.infinite) {
                this.inventory.splice(this.inventory.indexOf(item), 1);
            }
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
                // If it's a hidden door (4), make it darker to hint the player
                const isHiddenDoor = (map[oy][ox] === 4);
                if (isHiddenDoor) {
                    ctx.globalAlpha = 0.6; // Darken the wall
                    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
                }

                fillWall(dist, offsetX, 'front');

                if (isHiddenDoor) {
                    ctx.globalAlpha = 1.0; // Reset
                }
                if (map[oy][ox] === 9) {
                    // Optionally draw something in 3D for the NPC Event if we want to
                }
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
                    ctx.fillStyle = '#d3d3d3'; // Light Gray
                } else if (mc === 3) {
                    ctx.fillStyle = '#ff00ff';
                } else if (mc === 2) {
                    ctx.fillStyle = '#00ffff';
                } else if (mc === 6) { // Dark zones show dark green/grey on minimap
                    ctx.fillStyle = '#112211';
                } else if (mc === 8) { // Boss Tile
                    ctx.fillStyle = '#ff0000';
                } else if (mc === 9) { // Event NPC Tile
                    ctx.fillStyle = '#ffff00'; // Yellow
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
            // ID assigned so we can target them for damage/heal floaters
            div.id = `party-member-${i}`;
            div.className = `party-member ${this.state === 'BATTLE' && this.turnIndex === i ? 'active' : ''}`;
            const hpW = (p.hp / p.maxHp) * 100;
            const mpW = p.maxMp > 0 ? (p.mp / p.maxMp) * 100 : 0;
            div.innerHTML = `
                <div style="display:flex; justify-content:space-between; margin-bottom: 2px;"><strong>${p.name}</strong> <span>Lv${p.level} ${p.job}</span></div>
                <div style="display:flex; gap:10px;">
                    <div style="flex:1;">
                        <div class="stat-bar">
                            <div class="stat-fill" style="width:${hpW}%; background:#ff4444;"></div>
                            <div style="position:absolute; top:0; left:0; width:100%; text-align:center; font-size:10px; line-height:14px; text-shadow:1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000; z-index:2;">HP ${p.hp}/${p.maxHp}</div>
                        </div>
                    </div>
                    <div style="flex:1;">
                        <div class="stat-bar">
                            <div class="stat-fill" style="width:${mpW}%; background:#4444ff;"></div>
                            <div style="position:absolute; top:0; left:0; width:100%; text-align:center; font-size:10px; line-height:14px; text-shadow:1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000; z-index:2;">MP ${p.mp}/${p.maxMp}</div>
                        </div>
                    </div>
                </div>
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