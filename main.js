/**
 * MAIN ENTRY POINT
 */

const assets = {
    wall: { img: new Image(), loaded: false },
    floor: { img: new Image(), loaded: false },
    ceiling: { img: new Image(), loaded: false },
    stair_up: { img: new Image(), loaded: false },
    stair_down: { img: new Image(), loaded: false }
};

// Boss images 1-10
for (let i = 1; i <= 10; i++) {
    assets[`boss${i}`] = { img: new Image(), loaded: false };
}

Object.keys(assets).forEach(k => {
    assets[k].img.onload = () => { assets[k].loaded = true; if (window.game) window.game.render(); };
    assets[k].img.src = `assets/${k}.png`;
});

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
        this.thiefSkillActive = LEVELS.map(() => false);
        this.state = 'START';
        this.startTime = null;
        this.karma = 0;
        this.introPlayed = false;

        this.currentBattle = null;
        this.turnIndex = 0;
        this.npcFlags = {
            helpedAdventurer: false, event5FDone: false, event9FDone: false,
            metSwordsman: false, event3FDone: false, event7FDone: false,
            savedGoblin: false, friendGoblin: false, event4FDone: false, event6FDone: false,
            event8FDone: false, hasMirror: false, event1FDone: false
        };
        this.elapsedTimeAtSave = 0;
        this.discardingItemIdx = -1;

        this.init();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());

        document.getElementById('btn-reroll').onclick = () => this.rollParty();
        document.getElementById('btn-start').onclick = () => this.startStory();
        document.getElementById('btn-story-next').onclick = () => { audio.unlockAudio(); this.displayNextStory(); };
        document.getElementById('btn-story-skip').onclick = () => { audio.unlockAudio(); this.startGame(); };

        this.checkSaveData();
        this.rollParty();

        document.addEventListener('click', () => {
            audio.unlockAudio();
            if (!this.introPlayed && (this.state === 'START' || this.state === 'STORY')) {
                audio.playBGM('bgm_intro');
                this.introPlayed = true;
            }
        });

        this.updateVisited();
        this.render();
        document.addEventListener('keydown', (e) => this.handleInput(e));
    }

    resize() {
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;
        this.render();
    }

    rollParty() {
        this.party = [];
        const jobs = Object.values(CLASSES);
        const maleNames = ['アレス', 'ゼロ', 'シオン', 'カイン', 'レオン', 'クロウ', 'アーラン', 'ゼクス', 'ノア', 'コタロウ', 'ヤマト', 'ハヤテ', 'ゲン', 'レイフェイ', 'リュウ', 'シン', 'アミール', 'ハサン', 'カシム', 'オマール'];
        const femaleNames = ['ルチア', 'セリス', 'アリア', 'レイ', 'ティア', 'イリス', 'ファリス', 'サクラ', 'カグラ', 'シズク', 'カエデ', 'シャオ', 'リン', 'メイ', 'ラン', 'ユン', 'アリー', 'ファティマ', 'ライラ', 'ザラ'];

        const usedCombos = new Set();
        while (this.party.length < 4) {
            const gender = Math.random() < 0.5 ? 'male' : 'female';
            const job = jobs[Math.floor(Math.random() * jobs.length)];
            const comboKey = `${job.name}-${gender}`;

            if (usedCombos.has(comboKey)) continue;
            usedCombos.add(comboKey);

            const nameList = gender === 'male' ? maleNames : femaleNames;
            const nameIdx = Math.floor(Math.random() * nameList.length);
            const name = nameList.splice(nameIdx, 1)[0];

            const bonus = 5 + Math.floor(Math.random() * 11);
            const char = this.createChar(name, job, gender);
            char.bonusLeft = bonus;
            this.party.push(char);
        }
        this.renderCharCreate();
    }

    createChar(name, job, gender) {
        let str = job.str, int = job.int, vit = job.vit, agi = job.agi;
        if (gender === 'male') {
            str = Math.round(str * 1.1);
            vit = Math.round(vit * 1.1);
        } else {
            int = Math.round(int * 1.1);
            agi = Math.round(agi * 1.1);
        }

        const portrait = `assets/face_${job.name}_${gender}.jpeg`;

        return {
            name, job: job.name, gender, portrait, desc: job.desc, skillDesc: job.skillDesc,
            hp: job.hp, maxHp: job.hp, mp: job.mp, maxMp: job.mp,
            str, int, vit, agi, luk: job.luk,
            baseStr: str, baseInt: int, baseVit: vit, baseAgi: agi, baseLuk: job.luk,
            bonusLeft: 0, level: 1, exp: 0, gold: 0,
            equipment: { weapon: null, armor: null, accessory: null },
            inventory: [],
            statuses: { poison: false, paralysis: false, confusion: false },
            battleBuffs: {} // For camp skills
        };
    }

    checkSaveData() {
        const saved = localStorage.getItem('wiztaste_save');
        const screen = document.getElementById('char-create-screen');
        if (saved) {
            try {
                const data = JSON.parse(saved);
                const menuArea = screen.querySelector('.char-create-controls') || screen.querySelector('div:last-of-type');
                if (menuArea && !document.getElementById('btn-continue')) {
                    const btn = document.createElement('button');
                    btn.className = 'btn'; btn.id = 'btn-continue';
                    btn.style.borderColor = '#5f5'; btn.style.color = '#5f5'; btn.style.marginRight = '10px';
                    btn.textContent = `続きから (B${data.floor + 1}F)`;
                    btn.onclick = () => { audio.unlockAudio(); this.loadGame(data); };
                    menuArea.prepend(btn);
                    const startBtn = document.getElementById('btn-start');
                    if (startBtn) startBtn.style.display = 'inline-block';
                }
            } catch (e) { console.error("Load failed", e); }
        }
        this.renderCharCreate();
    }

    loadGame(data) {
        this.party = data.party; this.inventory = data.inventory; this.playerPos = data.pos;
        this.currentFloor = data.floor; this.visited = data.visited; this.npcFlags = data.npcFlags;
        this.karma = data.karma; this.elapsedTimeAtSave = data.elapsed || 0;
        this.thiefSkillActive = data.thiefSkillActive || LEVELS.map(() => false);
        if (data.levels) {
            LEVELS.length = 0;
            data.levels.forEach(l => LEVELS.push(l));
        }
        // Migration: Ensure all characters have statuses
        this.party.forEach(p => {
            if (!p.statuses) p.statuses = { poison: false, paralysis: false, confusion: false };
            if (!p.battleBuffs) p.battleBuffs = {};
        });
        this.startTime = Date.now();
        this.state = 'EXPLORE';
        document.getElementById('char-create-screen').style.display = 'none';
        document.getElementById('floor-indicator').textContent = `B${this.currentFloor + 1}F`;
        audio.playBGM('bgm_explore');
        this.updateTimer(); this.render();
        UI.addLog("冒険を再開します。");
    }

    renderCharCreate() {
        let html = '';
        this.party.forEach((char, idx) => {
            const statRow = (stat, label) => {
                const baseKey = 'base' + stat.charAt(0).toUpperCase() + stat.slice(1);
                return `
                    <div style="display:inline-flex; align-items:center; width:90px; margin-bottom:4px; position:relative; z-index:2;">
                        <span style="display:inline-block; width:30px; font-size:12px;">${label}</span>
                        <button class="btn" style="padding:0 5px; height:18px; font-size:10px;" ${char[stat] <= char[baseKey] ? 'disabled' : ''} onclick="window.game.adjustStat(${idx}, '${stat}', -1)">-</button>
                        <span style="display:inline-block; width:20px; text-align:center; font-size:12px;">${char[stat]}</span>
                        <button class="btn" style="padding:0 5px; height:18px; font-size:10px;" ${char.bonusLeft <= 0 ? 'disabled' : ''} onclick="window.game.adjustStat(${idx}, '${stat}', 1)">+</button>
                    </div>`;
            };
            html += `
                <div style="border: 1px dashed #fff; padding: 10px; background: rgba(0,0,0,0.8); position:relative; overflow:hidden; min-height:120px; display:flex; gap:15px;">
                    <!-- Blurred Background Portrait -->
                    <div style="position:absolute; top:0; right:0; width:150px; height:100%; background:url('${char.portrait}') no-repeat center; background-size:cover; filter: blur(8px) brightness(0.4); opacity: 0.5; z-index:1; pointer-events:none; transform: scale(1.2);"></div>
                    
                    <!-- Character Portrait -->
                    <div style="width:80px; height:80px; border:2px solid #555; background: #222; position:relative; z-index:2; flex-shrink:0;">
                         <img src="${char.portrait}" style="width:100%; height:100%; object-fit:cover;" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 1 1%22><rect width=%221%22 height=%221%22 fill=%22%23333%22/></svg>'">
                    </div>

                    <div style="position:relative; z-index:2; flex:1;">
                        <div style="display:flex; justify-content:space-between; margin-bottom:2px;">
                            <span><strong style="color:#ffcc00;">${char.name}</strong> <span style="font-size:12px; color:#aaa;">(${char.job} / ${char.gender === 'male' ? '男' : '女'})</span></span>
                            <span style="color:${char.bonusLeft > 0 ? '#5f5' : '#888'}; font-size:12px;">Bonus: ${char.bonusLeft}</span>
                        </div>
                        <div style="font-size:11px; color:#ccc; margin-bottom:5px;">${char.desc}<br><span style="color:#aaf;">[スキル] ${char.skillDesc}</span></div>
                        <div style="display:flex; flex-wrap:wrap; gap:5px;">${statRow('str', 'STR')}${statRow('int', 'INT')}${statRow('vit', 'VIT')}${statRow('agi', 'AGI')}${statRow('luk', 'LUK')}</div>
                        <div style="font-size:12px; color:#aaa; margin-top:2px;">HP: ${char.hp} | MP: ${char.mp}</div>
                    </div>
                </div>`;
        });
        document.getElementById('char-create-list').innerHTML = html;
        const btnStart = document.getElementById('btn-start');
        btnStart.textContent = '冒険開始';
        btnStart.disabled = false;
    }

    adjustStat(idx, stat, delta) {
        const char = this.party[idx];
        const baseKey = 'base' + stat.charAt(0).toUpperCase() + stat.slice(1);
        if (delta > 0 && char.bonusLeft > 0) { char[stat]++; char.bonusLeft--; }
        else if (delta < 0 && char[stat] > char[baseKey]) { char[stat]--; char.bonusLeft++; }
        if (stat === 'vit') { char.maxHp = CLASSES[Object.keys(CLASSES).find(k => CLASSES[k].name === char.job)].hp + (char.vit - char.baseVit) * 2; char.hp = char.maxHp; }
        if (stat === 'int') { char.maxMp = CLASSES[Object.keys(CLASSES).find(k => CLASSES[k].name === char.job)].mp + (char.int - char.baseInt) * 2; char.mp = char.maxMp; }
        this.renderCharCreate();
    }

    startStory() {
        audio.unlockAudio();
        this.party.forEach(p => { p.baseStr = p.str; p.baseInt = p.int; p.baseVit = p.vit; p.baseAgi = p.agi; p.baseLuk = p.luk; });
        document.getElementById('char-create-screen').style.display = 'none';
        document.getElementById('story-screen').style.display = 'flex';
        this.storyIndex = 0; this.state = 'STORY';
        if (!this.introPlayed) { audio.playBGM('bgm_intro'); this.introPlayed = true; }

        const getIntro = (char) => {
            const patterns = {
                '戦士': { male: '「俺の剣と盾が必要だろう？一緒に行ってやるよ。」', female: '「私の力、役立ててみせるわ。共に行きましょう。」' },
                '盗賊': { male: '「お宝があるなら話は別だ。俺も混ぜてくれよ。」', female: '「面白そうな話ね。私の手癖、試してみる？」' },
                '魔術師': { male: '「未知の魔力......興味深い。私も同行させてもらおう。」', female: '「私の魔法が必要かしら？いいわ、手を貸してあげる。」' },
                '僧侶': { male: '「神の加護があらんことを。私も癒やしの手として参りましょう。」', female: '「怪我人が出るのは放っておけません。私にお任せください。」' },
                '侍': { male: '「この刀、錆びさせるには惜しい。貴殿に助力しよう。」', female: '「私の剣筋、見極めてほしい。お供いたします。」' },
                '武闘家': { male: '「鍛えたこの拳、試させてもらうぜ！面白そうだ！」', female: '「私の体術、迷宮でも通じるはず。一緒に行くわ！」' },
                '狩人': { male: '「遠くから支えてやるよ。俺の矢は外さないぜ。」', female: '「私の弓で道を切り開くわ。連れていってちょうだい。」' },
                'モンク': { male: '「拳と祈り、両方で力になろう。私も行こう。」', female: '「私がお守りします。迷宮の闇に負けはしません。」' },
                'ビショップ': { male: '「大いなる光の導きあらんことを。私が道を照らしましょう。」', female: '「浄化の祈りを捧げます。共に困難を乗り越えましょう。」' }
            };
            const jobPattern = patterns[char.job] || { male: '「俺も行くぜ。よろしくな。」', female: '「私も行くわ。力になるわ。」' };
            return jobPattern[char.gender] || jobPattern.male;
        };

        this.storyMessages = [
            "酒場にて...<br>薄暗い店内に、炭の爆ぜる音と冒険者たちの低いうなりが響いている。",
            "バーテンダー<br>「......また現れたらしいですね。あの『渦』が。」",
            "バーテンダー<br>「迷宮の奥底から噴き出す瘴気が、街の家畜や子供たちを病ませ始めているそうです。この店も仕入れが高騰して大変ですよ......。」",
            `${this.party[0].name}<br>「......ふん、またあの『渦』か。この店には腕利きたちが集まっているようだな。<br>誰か、私と共に『渦』を止めるために立ち上がる者はいないか？」`,
            `${this.party[1].name}<br>${getIntro(this.party[1])}`,
            `${this.party[2].name}<br>${getIntro(this.party[2])}`,
            `${this.party[3].name}<br>${getIntro(this.party[3])}`,
            "こうして、彼らは導かれるように恐るべき迷宮へと足を踏み入れることになった――"
        ];
        this.displayNextStory();
    }

    displayNextStory() {
        const storyContent = document.getElementById('story-content');
        const nextBtn = document.getElementById('btn-story-next');
        const skipBtn = document.getElementById('btn-story-skip');

        if (this.storyIndex >= this.storyMessages.length) {
            if (this.state === 'EPILOGUE') {
                document.getElementById('story-screen').style.display = 'none';
                this.showFinalRanking();
            } else {
                this.startGame();
            }
            return;
        }

        const msg = this.storyMessages[this.storyIndex++];
        storyContent.innerHTML = `<div class="story-anim">${msg}</div>`;

        nextBtn.style.display = 'none';
        if (this.state === 'EPILOGUE') skipBtn.style.display = 'none';

        setTimeout(() => {
            nextBtn.style.display = 'inline-block';
            if (this.storyIndex >= this.storyMessages.length) {
                nextBtn.textContent = this.state === 'EPILOGUE' ? 'エピローグを終える' : '迷宮へ向かう';
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
        audio.unlockAudio(); this.state = 'EXPLORE'; this.startTime = Date.now();
        // Generate new levels for a fresh game
        generateAllLevels();
        document.getElementById('story-screen').style.display = 'none';
        UI.addLog("深淵の迷宮へようこそ。10Fのボス討伐を目指せ。");
        audio.playBGM('bgm_explore'); this.updateTimer();
    }

    updateTimer() {
        if (this.state === 'START' || this.state === 'ENDING') return;
        const now = Date.now();
        const elapsed = Math.floor((this.elapsedTimeAtSave + (now - (this.startTime || now))) / 1000);
        const h = String(Math.floor(elapsed / 3600)).padStart(2, '0');
        const m = String(Math.floor((elapsed % 3600) / 60)).padStart(2, '0');
        const s = String(elapsed % 60).padStart(2, '0');
        document.getElementById('timer-display').textContent = `${h}:${m}:${s}`;
        requestAnimationFrame(() => this.updateTimer());
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
            if (e.key === 'c' || e.key === 'C' || e.key === 'Escape') this.toggleCamp();
            const key = e.key.toLowerCase();
            if (key === 'a') document.getElementById('camp-char-0')?.scrollIntoView();
            else if (key === 's') document.getElementById('camp-char-1')?.scrollIntoView();
            else if (key === 'd') document.getElementById('camp-char-2')?.scrollIntoView();
            else if (key === 'f') document.getElementById('camp-char-3')?.scrollIntoView();
            else if (key === 'i') document.getElementById('camp-inventory')?.scrollIntoView();
        } else if (this.state === 'BATTLE' && this.currentBattle?.phase === 'INPUT') {
            switch (e.key.toLowerCase()) {
                case 'a': this.battleAction('attack'); break;
                case 's': this.battleAction('skill'); break;
                case 'd': this.battleAction('guard'); break;
                case 'f': this.battleAction('run'); break;
            }
        } else if (this.state === 'EVENT' || this.state === 'TREASURE') {
            const idx = ['a', 's', 'd', 'f'].indexOf(e.key.toLowerCase());
            if (idx !== -1) {
                const buttons = document.getElementById('event-options').querySelectorAll('button');
                if (buttons[idx]) buttons[idx].click();
            }
        } else if (this.state === 'START') {
            if (e.key.toLowerCase() === 'r') this.rollParty();
            else if (e.key.toLowerCase() === 's' || e.key === 'Enter') this.startStory();
        }
    }

    move(action) {
        let { x, y, dir } = this.playerPos;
        const dx = [0, 1, 0, -1][dir], dy = [-1, 0, 1, 0][dir];
        const map = LEVELS[this.currentFloor];
        if (action === 'forward' || action === 'backward') {
            const m = action === 'forward' ? 1 : -1;
            const nx = x + dx * m, ny = y + dy * m;
            if (map[ny]?.[nx] !== 1 && map[ny]?.[nx] !== 4) {
                this.playerPos.x = nx; this.playerPos.y = ny;
                this.updateMirrorEffect();
                this.checkTile();

                // Status check on step
                this.party.forEach(p => {
                    if (p.hp > 0 && p.statuses?.poison) {
                        const poiDmg = Math.max(1, Math.floor(this.getEffectiveMaxHp(p) * 0.03));
                        p.hp = Math.max(1, p.hp - poiDmg);
                        UI.addLog(`${p.name}は毒に苦しんでいる...(${poiDmg}ダメージ)`);

                        // Recovery chance per step? Request said 30% for recovery.
                        // Usually recovery is per turn, but can be per step on map.
                        if (Math.random() < 0.05) { // Lower chance on map to make it threatening
                            p.statuses.poison = false;
                            UI.addLog(`${p.name}の毒が消えた。`);
                        }
                    }
                    if (p.hp > 0 && p.statuses?.paralysis) {
                        // Paralysis recovery chance per step (approx 5%)
                        if (Math.random() < 0.05) {
                            p.statuses.paralysis = false;
                            UI.addLog(`${p.name}のしびれが和らいだ。`);
                        }
                    }
                });

            }
        } else if (action === 'left') this.playerPos.dir = (dir + 3) % 4;
        else if (action === 'right') this.playerPos.dir = (dir + 1) % 4;
        this.updateVisited(); this.render();
    }

    updateMirrorEffect() {
        if (!this.npcFlags.hasMirror) return;
        const k = this.karma;
        const regenProb = Math.abs(k) / 100;
        const drainProb = regenProb / 10;

        const applyStat = (prob, type, isGain) => {
            let amount = Math.floor(prob);
            if (Math.random() < (prob - amount)) amount += 1;
            if (amount <= 0) return;

            this.party.forEach(p => {
                if (p.hp <= 0) return;
                if (type === 'HP') {
                    if (isGain) p.hp = Math.min(this.getEffectiveMaxHp(p), p.hp + amount);
                    else p.hp = Math.max(1, p.hp - amount);
                } else {
                    if (isGain) p.mp = Math.min(this.getEffectiveMaxMp(p), p.mp + amount);
                    else p.mp = Math.max(0, p.mp - amount);
                }
            });
        };

        if (k >= 0) {
            applyStat(regenProb, 'HP', true);
            applyStat(drainProb, 'MP', false);
        } else {
            applyStat(regenProb, 'MP', true);
            applyStat(drainProb, 'HP', false);
        }
    }

    checkTile() {
        const floor = LEVELS[this.currentFloor];
        const tile = floor[this.playerPos.y][this.playerPos.x];
        if (tile === 3) {
            if (this.currentFloor === 9) { // 10F handling
                if (!this.npcFlags.boss10FDefeated) {
                    UI.addLog("階段のようなものがあるが、いまはこのフロアの渦を討伐することに専念しよう。");
                    // push player back
                    const { dir } = this.playerPos;
                    this.playerPos.x -= [0, 1, 0, -1][dir];
                    this.playerPos.y -= [-1, 0, 1, 0][dir];
                } else {
                    this.showDeepWarningEvent();
                }
            } else {
                this.changeFloor(1);
            }
        }
        else if (tile === 2) {
            if (this.currentFloor === 9 && this.npcFlags.boss10FDefeated) {
                this.handleEnding();
            } else {
                this.changeFloor(-1);
            }
        }
        else if (tile === 5) { UI.addLog("テレポーターだ！"); this.teleport(); }
        else if (tile === 7) { UI.addLog("床が回転した！"); this.playerPos.dir = Math.floor(Math.random() * 4); }
        else if (tile === 6) { UI.addLog("暗闇だ..."); }
        else if (tile === 8) this.startBossBattle();
        else if (tile === 9) Events.triggerEvent(this, this.currentFloor + 1);
        else if (tile === 4) { UI.addLog("隠し扉から奥へ進んだ..."); floor[this.playerPos.y][this.playerPos.x] = 0; if (Math.random() < 0.7) { this.addLog("誰も足を踏み入れていない部屋だ！宝箱を見つけた！"); this.inventory.push(this.generateLoot()); } else { this.addLog("部屋の奥から強力な魔物が現れた！"); this.startBattle(true); } }
        else this.checkEncounter();
    }

    showDeepWarningEvent() {
        this.state = 'EVENT';
        audio.stopBGM();

        const eventScreen = document.getElementById('event-screen');
        const eventTitle = document.getElementById('event-title');
        const eventImg = document.getElementById('event-img');
        const eventDesc = document.getElementById('event-desc');
        const eventOptions = document.getElementById('event-options');

        eventTitle.textContent = "深淵への入り口";
        eventImg.style.display = 'none'; // No specific image for now

        eventDesc.innerHTML = `<div style="text-align:center;">
            <p>アビスロードは倒れたが、渦の最深奥部からは未だ底知れぬ瘴気が漏れ出している……。</p>
            <p><strong>【警告：ここから先は未知の領域です】</strong></p>
            <p style="font-size: 12px; color: #ffaa55;">
            ・敵は際限なく強くなり、取得経験値は減少します。<br>
            ・上り階段は生成されず、地上へ引き返すことはできません。<br>
            ・全滅した場合、<strong>所持品と装備品を50%ロストし、レベルが半減</strong>します。<br>
            ・全滅後、到達階層が裏ランキングとして記録され、1Fから再スタートとなります。
            </p>
            <p>……それでも進みますか？</p>
            </div>`;

        eventOptions.innerHTML = '';

        const btnYes = document.createElement('button');
        btnYes.className = 'btn';
        btnYes.textContent = 'はい（進む）';
        btnYes.onclick = () => {
            this.closeEvent();
            this.changeFloor(1);
        };
        eventOptions.appendChild(btnYes);

        const btnNo = document.createElement('button');
        btnNo.className = 'btn';
        btnNo.textContent = 'いいえ（戻る）';
        btnNo.onclick = () => {
            UI.addLog("あなたは引き返すことを選んだ。");
            const { dir } = this.playerPos;
            this.playerPos.x -= [0, 1, 0, -1][dir];
            this.playerPos.y -= [-1, 0, 1, 0][dir];
            this.closeEvent();
        };
        eventOptions.appendChild(btnNo);

        eventScreen.style.display = 'flex';
    }

    changeFloor(delta) {
        if (this.currentFloor === 0 && delta === -1) { UI.addLog("地上への階段だ。しかし今は戻れない。"); return; }
        this.currentFloor += delta;
        UI.addLog(`地下 ${this.currentFloor + 1} 階へ。`);
        document.getElementById('floor-indicator').textContent = `B${this.currentFloor + 1}F`;
        if (!LEVELS[this.currentFloor]) {
            LEVELS[this.currentFloor] = generateMaze(MAP_SIZE, this.currentFloor);
            this.visited.push(Array(MAP_SIZE).fill().map(() => Array(MAP_SIZE).fill(false)));
        }
        let found = false, next = LEVELS[this.currentFloor], target = delta === 1 ? 2 : 3;
        for (let r = 0; r < next.length; r++) { for (let c = 0; c < next[r].length; c++) { if (next[r][c] === target) { this.playerPos.x = c; this.playerPos.y = r; found = true; break; } } if (found) break; }
        if (!found) { this.playerPos.x = 1; this.playerPos.y = 1; }
        this.updateVisited();
    }

    checkEncounter() { if (Math.random() < 0.12) this.startBattle(); }

    startBattle(isHard = false) {
        this.state = 'BATTLE';
        audio.playBGM('bgm_battle');

        let floorMonsters;
        let scaleMult = 1;
        let expMult = 1;

        if (this.currentFloor >= 10) { // 11F+
            // Deep endless mode: select from ALL available monsters and scale them up
            floorMonsters = MONSTERS;
            const deepLevel = this.currentFloor - 9; // 1 = 11F, 2 = 12F, etc.
            scaleMult = Math.pow(1.2, deepLevel);
            expMult = Math.max(0.1, 0.5 * Math.pow(0.9, deepLevel));
        } else {
            floorMonsters = isHard ? MONSTERS.filter(m => !m.deepOnly && m.level === Math.min(10, this.currentFloor + 3)) : MONSTERS.filter(m => !m.deepOnly && m.level === this.currentFloor + 1);
        }

        let num = 1, r = Math.random(); if (r > 0.6) num = 2; if (r > 0.9) num = 3;
        this.currentBattle = { monsters: [], turnOrder: [], phase: 'INPUT', isBoss: false };
        let moHtml = '';
        for (let i = 0; i < num; i++) {
            const data = floorMonsters[Math.floor(Math.random() * floorMonsters.length)] || MONSTERS[0];

            // Apply deep endless scaling
            let mHp = data.hp;
            let mAtk = data.atk;
            let mAgi = data.agi;
            let mExp = data.exp;

            if (this.currentFloor >= 10) {
                mHp = Math.floor(mHp * scaleMult);
                mAtk = Math.floor(mAtk * scaleMult);
                mAgi = Math.floor(mAgi * scaleMult);
                mExp = Math.floor(mExp * expMult);
            }

            const m = { ...data, hp: mHp, maxHp: mHp, currentHp: mHp, atk: mAtk, agi: mAgi, exp: mExp, id: `monster-${i}`, originalName: data.name, statuses: { poison: false, paralysis: false, confusion: false } };
            this.currentBattle.monsters.push(m);
            moHtml += `<div class="monster-img-container" id="monster-img-${i}">${m.svg}</div>`;
        }
        document.getElementById('explore-menu').style.display = 'none';
        document.getElementById('battle-menu').style.display = 'flex';
        const mo = document.getElementById('monster-overlay'); mo.innerHTML = moHtml; mo.style.display = 'flex';
        this.turnIndex = 0;
        while (this.turnIndex < this.party.length && this.party[this.turnIndex].hp <= 0) this.turnIndex++;
        this.updateUI();
    }

    startCustomBattle(monsters, flags = {}) {
        this.state = 'BATTLE';
        this.currentBattle = { monsters: monsters.map(m => ({ ...m, currentHp: m.hp, deadLogged: false, originalName: m.name })), turnOrder: [], phase: 'INPUT', ...flags };
        document.getElementById('explore-menu').style.display = 'none';
        document.getElementById('battle-menu').style.display = 'flex';
        const mo = document.getElementById('monster-overlay'); mo.innerHTML = '';
        this.currentBattle.monsters.forEach((m, i) => { const c = document.createElement('div'); c.className = 'monster-img-container'; c.id = `monster-img-${i}`; c.innerHTML = m.svg; mo.appendChild(c); });
        mo.style.display = 'flex';
        if (!flags.keepBGM) audio.playBGM('bgm_battle');
        this.turnIndex = 0;
        while (this.turnIndex < this.party.length && this.party[this.turnIndex].hp <= 0) this.turnIndex++;
        this.updateUI();
    }

    async startBossBattle() {
        const floor = this.currentFloor + 1;
        const isFinalBoss = floor === 10;
        this.state = 'EVENT';
        audio.stopBGM();

        let bossName = "";
        let bossDesc = "";
        let bossImg = `assets/boss${floor}.png`;
        const hpScale = isFinalBoss ? 8500 : (150 * floor + Math.pow(1.3, floor) * 100);
        let bossStats = { hp: hpScale, atk: 20 + floor * 15, agi: 10 + floor * 4, exp: 500 * floor * floor };

        if (isFinalBoss) {
            bossName = "アビスロード";
            bossImg = "assets/boss10.png";
            bossStats = { hp: 8500, atk: 280, agi: 60, exp: 30000 };
            const karma = this.karma;
            let dialogue = "";
            if (karma > 50) dialogue = "「ほう……。その身に宿した光、眩しすぎるな。だが、ここはそのような輝きが届く場所ではないぞ。」";
            else if (karma < -50) dialogue = "「ククク……。お前の中にある闇、心地よいぞ。我が渦の一部として、永遠に溺れるがいい。」";
            else dialogue = "「虚ろな魂よ。目的もなく彷徨う者に、この渦を止めることはできぬ。」";
            bossDesc = `渦の中から一人の老人が現れた。\n老人は静かに、しかし威圧感を持って語りだす。\n\n${dialogue}`;
        } else {
            const floorBosses = {
                1: { name: "マーフィーズゴースト", desc: "奇妙なピエロのような衣装の人間型の生き物が接近してくる。よく見るとそれは腐乱しかけた人間であった。それは何も言わずにこちらへ襲い掛かってきた。" },
                2: { name: "ガスクラウド", desc: "霧の中から微かに光る二つの眼が見えた。その霧が物理的な質量を持ち、毒々しい重圧を放つ雲となって襲い掛かってくる！" },
                3: { name: "ドラゴンフライ", desc: "羽ばたきの音が頭上から聞こえる。巨大な蜻蛉のような魔物が炎を吐き散らしながら急降下してきた！" },
                4: { name: "クリーピングコイン", desc: "通路の隅にコインが山積みにされている。一攫千金を夢見て近づくと、コインが脈打ち、飢えた魔物となって牙を剥いた！" },
                5: { name: "グレーターデーモン", desc: "空間が裂け、禍々しい角を持つ巨漢が現れた。その冷徹な眼差しは、冒険者の魂を品定めするかのように細められた。" },
                6: { name: "ヴァンパイアロード", desc: "豪奢な寝台。そこには夜を統べる貴公子が佇んでいた。彼は優雅にグラスを掲げ、食事の時間を告げた。" },
                7: { name: "キマイラ", desc: "獅子の咆哮、山羊の呻き、蛇の威嚇。三つの意思を宿した怪異が、吐息から炎を漏らしながら飛びかかってきた！" },
                8: { name: "サイデル", desc: "底知れぬ闇の中から、いくつもの影が蠢いている。それは実体を持たぬ幽体、あるいは過去の冒険者の成れの果てか。" },
                9: { name: "フラック", desc: "道化のような色彩豊かな衣装に身を包んだ怪人が現れた。彼は高く笑い、致命的な魔力の波動を指先から放った！" }
            };
            const b = floorBosses[floor];
            bossName = b.name; bossDesc = b.desc;
        }

        await UI.showBlackout(this, floor === 10 ? "空気が一変する..." : "ただならぬ気配が漂う...", 1500, async () => {
            audio.playBGM('bgm_boss');

            const eventScreen = document.getElementById('event-screen');
            const eventTitle = document.getElementById('event-title');
            const eventImg = document.getElementById('event-img');
            const eventDesc = document.getElementById('event-desc');
            const eventOptions = document.getElementById('event-options');

            eventTitle.textContent = isFinalBoss ? "渦の支配者" : `${floor}F 守護者`;
            eventImg.src = bossImg;
            eventImg.style.display = 'block';
            if (isFinalBoss) eventImg.style.filter = 'drop-shadow(0 0 20px #f00)';
            eventDesc.innerHTML = bossDesc;
            eventOptions.innerHTML = '';

            const btn = document.createElement('button');
            btn.className = 'btn';
            btn.textContent = '戦闘開始 (A)';
            btn.onclick = () => {
                this.closeEvent();
                const boss = {
                    id: 'monster-0',
                    name: bossName,
                    hp: bossStats.hp, maxHp: bossStats.hp, currentHp: bossStats.hp,
                    atk: bossStats.atk, agi: bossStats.agi, exp: bossStats.exp, level: floor,
                    svg: `<img src="${bossImg}" style="width:100%; height:100%; object-fit:contain; transform:scale(${isFinalBoss ? 1.8 : 1.5});" />`
                };
                this.startCustomBattle([boss], { isBoss: isFinalBoss, isMidBoss: !isFinalBoss, isMidBossFloor: floor, keepBGM: true });
            };
            eventOptions.appendChild(btn);
            eventScreen.style.display = 'flex';
            UI.addLog(`${bossName}が現れた！`);
        });
    }

    battleAction(type) {
        if (this.state !== 'BATTLE' || this.currentBattle?.phase !== 'INPUT') return;
        this.currentBattle.turnOrder.push({ actor: this.party[this.turnIndex], type, isPlayer: true });
        this.turnIndex++;
        while (this.turnIndex < this.party.length && this.party[this.turnIndex].hp <= 0) this.turnIndex++;
        if (this.turnIndex >= this.party.length) Battle.executeBattleTurn(this);
        else this.updateUI();
    }

    endBattle(won) {
        console.log("endBattle called", won);
        if (!won) { this.exitBattle(); return; }
        const bt = this.currentBattle;
        if (!bt) { console.error("No current battle!"); return; }
        if (bt.isBoss) {
            this.npcFlags[`boss10FDefeated`] = true;
            UI.addLog(`アビスロードを討伐した！しかし、渦の最深部からは未だ瘴気が漏れ出している...`);
            // Turn the boss tile into the downstairs (3) so the player can immediately proceed to 11F
            if (this.currentFloor === 9) {
                LEVELS[9][this.playerPos.y][this.playerPos.x] = 3;
                UI.addLog(`床が崩れ落ち、さらなる深層へ続く大穴（下階段）が現れた！`);
            }
        }
        if (bt.isMidBoss) {
            const floor = bt.isMidBossFloor || (this.currentFloor + 1);
            this.npcFlags[`boss${floor}FDefeated`] = true;
            UI.addLog(`このフロアの守護者を倒した証を得た！`);
        }
        let totalExp = 0; bt.monsters.forEach(m => totalExp += m.exp);
        const alive = this.party.filter(p => p.hp > 0);
        if (alive.length > 0) {
            totalExp = Math.floor(totalExp / alive.length);
            this.party.forEach(p => {
                if (p.hp > 0) {
                    p.exp += totalExp;
                    let nextExp = Math.floor(100 * Math.pow(p.level, 1.5) + 50 * p.level);
                    while (p.exp >= nextExp) {
                        p.exp -= nextExp;
                        this.levelUp(p);
                        nextExp = Math.floor(100 * Math.pow(p.level, 1.5) + 50 * p.level);
                    }
                }
            });
        }
        UI.addLog(`経験値を ${totalExp} 獲得した！`);

        if (bt.isArtoriusLoot) {
            UI.addLog("アルトリウスの装備品一式を手に入れた！");
            this.inventory.push(
                { name: "氷の魔剣", type: "weapon", atk: 18, desc: "冷気を帯びた魔剣(ATK+18)" },
                { name: "スケイルメイル", type: "armor", def: 11, req: { str: 18 }, desc: "精巧な鱗の鎧(DEF+11)" },
                { name: "守りの指輪", type: "accessory", def: 3, desc: "防御力を高める指輪(DEF+3)" }
            );
        }
        if (bt.isSmallGoblinLoot) {
            UI.addLog("スモールゴブリンの「ゴブリンの眼」を手に入れた！");
            this.inventory.push({ name: "ゴブリンの眼", type: "consumable", hpRestore: 20, desc: "魔物の眼。微量ながらHPを回復する(HP+20)" });
        }
        if (bt.isAdventurerLoot) {
            UI.addLog("負傷した騎士の装備品一式を奪い取った！");
            this.inventory.push(
                { name: "バトルアックス", type: "weapon", atk: 15, req: { str: 15 }, desc: "重い斧(ATK+15)" },
                { name: "プレートメイル", type: "armor", def: 15, req: { str: 20 }, desc: "重装甲(DEF+15)" },
                { name: "守りの指輪", type: "accessory", def: 3, desc: "防御力を高める指輪(DEF+3)" }
            );
        }
        if (bt.isKingGoblinLoot) {
            UI.addLog("キングゴブリンの「ゴブリンの鉈」を手に入れた！");
            this.inventory.push({ name: "ゴブリンの鉈", type: "weapon", atk: 30, req: { str: 20 }, desc: "業物だがひどく血生臭い鉈(ATK+30)" });
        }
        if (bt.isSwordsmanEvent) {
            UI.addLog("狂乱の剣士から「狂人装備一式」を剥ぎ取った！");
            this.inventory.push(
                { name: "狂戦士の剣", type: "weapon", atk: 45, desc: "狂気に染まった大剣(ATK+45)" },
                { name: "狂戦士の鎧", type: "armor", def: 35, desc: "痛みを忘れる呪いの鎧(DEF+35)" },
                { name: "狂乱の首飾り", type: "accessory", agi: 10, desc: "理性を削り速度を得る(AGI+10)" }
            );
        }
        if (bt.isDarkSageLoot) {
            UI.addLog("闇の賢者の残した「闇の叡智の結晶」を手に入れた！");
            this.inventory.push({
                name: '闇の叡智の結晶', type: 'consumable', infinite: true, targetAll: true, mpRestore: 20, desc: '何度でも使える魔力の結晶',
                effect: () => {
                    game.party.forEach(p => { if (p.hp > 0) p.mp = Math.min(game.getEffectiveMaxMp(p), p.mp + 20); });
                    UI.addLog(`闇の叡智の結晶から魔力が溢れ出す！全員のMPが20回復した！`);
                }
            });
        }
        if (bt.isGoblinPlunder) {
            UI.addLog("ゴブリンの親子から「妖精の霊薬」と「ゴブリンの鉈」を奪い取った！");
            this.inventory.push({
                name: '妖精の霊薬', type: 'consumable', infinite: true, targetAll: true, hpRestore: 50, desc: '何度でも使える全体回復薬',
                effect: () => {
                    game.party.forEach(mbr => { if (mbr.hp > 0) mbr.hp = Math.min(game.getEffectiveMaxHp(mbr), mbr.hp + 50); });
                    UI.addLog(`妖精の霊薬を使った！全員のHPが50回復！`);
                }
            });
            this.inventory.push({ name: "ゴブリンの鉈", type: "weapon", atk: 30, req: { str: 20 }, desc: "業物だがひどく血生臭い鉈(ATK+30)" });
        }

        if (Math.random() < 0.3 || bt.isMidBoss || bt.isBoss) {
            console.log("Triggering treasure event");
            const rankBonus = (bt.isMidBoss || bt.isBoss) ? 2 : 0;
            Events.triggerTreasureEvent(this, this.generateLoot(rankBonus));
        } else {
            console.log("Exiting battle directly");
            this.exitBattle();
        }
    }

    exitBattle() {
        this.state = 'EXPLORE';
        const mo = document.getElementById('monster-overlay');
        if (mo) { mo.style.display = 'none'; mo.innerHTML = ''; mo.style.filter = ''; mo.style.transform = ''; }
        const bm = document.getElementById('battle-menu');
        const em = document.getElementById('explore-menu');
        if (bm) bm.style.display = 'none';
        if (em) em.style.display = 'flex';
        audio.playBGM('bgm_explore');
        this.currentBattle = null;
        this.updateUI();
        this.saveGame();
        this.render();
    }

    levelUp(p) {
        p.level++; p.exp = 0; p.str += 2; p.int += 2; p.vit += 2; p.agi += 2; p.luk += 2;
        p.maxHp += 10; p.maxMp += 5; p.hp = this.getEffectiveMaxHp(p); p.mp = this.getEffectiveMaxMp(p);
        UI.addLog(`${p.name}はレベル ${p.level} に上がった！`);
    }

    async handleGameOver() {
        const penaltySeconds = (this.currentFloor + 1) * 30;
        this.elapsedTimeAtSave += (penaltySeconds * 1000);
        this.state = 'GAMEOVER'; audio.playBGM('bgm_dead');

        const ghosts = this.party.filter(p => p.baseVit < 0);
        const isDeepFloor = this.currentFloor >= 10; // 11F or deeper

        await UI.showBlackout(this, isDeepFloor ? "深い闇の中で力尽きた..." : "全滅した...", 3000, () => {
            this.playerPos = { x: 1, y: 1, dir: 1 };
            const previousFloor = this.currentFloor;
            this.currentFloor = 0;

            if (isDeepFloor) {
                // F11+ Deep penalty: 50% level loss, 50% item loss (both inventory and equipped)
                this.party.forEach(p => {
                    p.level = Math.max(1, Math.floor(p.level / 2));
                    // Re-calculate base stats down approximation (crude but functional for level scaling)
                    p.str = Math.max(p.baseStr, p.str - p.level * 2);
                    p.int = Math.max(p.baseInt, p.int - p.level * 2);
                    p.vit = Math.max(p.baseVit, p.vit - p.level * 2);
                    p.agi = Math.max(p.baseAgi, p.agi - p.level * 2);
                    p.luk = Math.max(p.baseLuk, p.luk - p.level * 2);

                    p.maxHp = Math.max(p.baseVit * 2, p.maxHp - p.level * 10);
                    p.maxMp = Math.max(p.baseInt * 2, p.maxMp - p.level * 5);

                    // Unequip items losing check
                    ['weapon', 'armor', 'accessory'].forEach(slot => {
                        if (p.equipment[slot] && Math.random() < 0.5) {
                            UI.addLog(`${p.name}が装備していた${p.equipment[slot].name}は闇に呑まれた...`);
                            p.equipment[slot] = null;
                        }
                    });

                    p.hp = Math.floor(Math.random() * 9) + 1; // 1-9 hp
                    p.mp = this.getEffectiveMaxMp(p);
                    p.deadLogged = false;
                });

                let remainingInventory = [];
                this.inventory.forEach(item => {
                    if (Math.random() >= 0.5) remainingInventory.push(item);
                    else UI.addLog(`${item.name}は闇に呑まれた...`);
                });
                this.inventory = remainingInventory;
                UI.addLog("パーティは疲弊し、多くの持ち物を失って地上へ弾き出された……");

                // Reset dungeon progress for Abyss mode wipe
                this.npcFlags = {
                    helpedAdventurer: false, event5FDone: false, event9FDone: false,
                    metSwordsman: false, event3FDone: false, event7FDone: false,
                    savedGoblin: false, friendGoblin: false, event4FDone: false, event6FDone: false,
                    event8FDone: false, hasMirror: false, event1FDone: false
                };
                generateAllLevels();
                this.visited = LEVELS.map(() => Array(MAP_SIZE).fill().map(() => Array(MAP_SIZE).fill(false)));

                this.exitBattle();
                document.getElementById('floor-indicator').textContent = 'B1F';
                this.showDeepRanking(previousFloor);

            } else {
                if (ghosts.length > 0) {
                    this.party.forEach(p => {
                        if (p.baseVit < 0) {
                            p.hp = 0;
                            p.isGhost = true;
                        } else {
                            // Alive members HP becomes 1-9
                            p.hp = Math.floor(Math.random() * 9) + 1;
                            p.mp = this.getEffectiveMaxMp(p);
                        }
                        p.deadLogged = false;
                    });
                    ghosts.forEach(g => UI.addLog(`「${g.name}が呼ぶ声がした……」`));
                } else {
                    this.party.forEach(p => { p.hp = this.getEffectiveMaxHp(p); p.mp = this.getEffectiveMaxMp(p); p.deadLogged = false; });
                }

                document.getElementById('floor-indicator').textContent = 'B1F';
                this.exitBattle();
                UI.addLog("気が付いたら迷宮の入り口に戻っていた。アビスロードを倒すまで町には戻れないようだ");
            }
        });
    }

    showDeepRanking(finalFloor) {
        document.getElementById('explore-menu').style.display = 'none';
        document.getElementById('deep-ranking-screen').style.display = 'flex';
        document.getElementById('deep-floor-display').textContent = `B${finalFloor + 1}F`;
        audio.playBGM('bgm_dead');

        const btnSubmit = document.getElementById('btn-submit-deep-score');
        btnSubmit.disabled = false;
        btnSubmit.textContent = 'この記録を深淵に刻む';

        btnSubmit.onclick = () => {
            btnSubmit.disabled = true;
            btnSubmit.textContent = '送信中...';

            if (window.firebaseInitialized) {
                const dbRankRef = window.firebaseRef('deep_rankings');

                // Collect party member summaries
                const partyData = this.party.map(p => ({
                    name: p.name,
                    job: p.job,
                    gender: p.gender,
                    level: p.level,
                    portrait: p.portrait
                }));

                window.firebasePush(dbRankRef, {
                    floor: finalFloor + 1,
                    karma: this.karma,
                    party: partyData,
                    timestamp: JSON.parse(JSON.stringify(new Date()))
                }).then(() => {
                    btnSubmit.textContent = '記録完了！';
                }).catch(e => {
                    btnSubmit.textContent = 'エラー発生';
                    console.error(e);
                });
            } else {
                btnSubmit.textContent = 'オフライン';
            }
        };

        const btnRestart = document.getElementById('btn-deep-restart');
        btnRestart.onclick = () => {
            document.getElementById('deep-ranking-screen').style.display = 'none';
            document.getElementById('explore-menu').style.display = 'flex';
            audio.playBGM('bgm_explore');
            this.state = 'EXPLORE';
            this.saveGame();
            this.render();
        };

        this.loadDeepRankings();
    }

    loadDeepRankings() {
        if (!window.firebaseInitialized) return;
        const dbRankRef = window.firebaseRef('deep_rankings');
        // Sort by floor descending (Note: Firebase JS SDK orderByChild ascending by default)
        // Since we want highest floor first, we have to fetch and sort locally if doing limitToLast, 
        // or store negative floor to sort ascending. We'll fetch the top 20 by Floor and sort locally.
        const q = window.firebaseQuery(window.firebaseOrderByChild(window.firebaseRef('deep_rankings'), 'floor'));

        window.firebaseOnValue(q, (snapshot) => {
            const rankings = [];
            snapshot.forEach((childSnapshot) => {
                rankings.push(childSnapshot.val());
            });

            // Sort descending by floor
            rankings.sort((a, b) => b.floor - a.floor);
            // Take top 10
            const topRankings = rankings.slice(0, 10);

            let html = '';
            let rank = 1;

            topRankings.forEach((data) => {
                const safeFloor = parseInt(data.floor) || 0;
                let partyHtml = '';
                if (data.party && Array.isArray(data.party)) {
                    data.party.forEach(p => {
                        const safeName = typeof p.name === 'string' ? p.name.replace(/[&<>'"]/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[m])) : '不明';
                        partyHtml += `
                            <div style="display:flex; align-items:center; gap:5px; margin-right: 10px;">
                                <img src="${p.portrait}" style="width:24px; height:24px; border:1px solid #555; background:#222; object-fit:cover;" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 1 1%22><rect width=%221%22 height=%221%22 fill=%22%23333%22/></svg>'">
                                <span style="font-size: 11px;">Lv${p.level} ${safeName}</span>
                            </div>`;
                    });
                }

                html += `
                    <div style="padding: 10px; border-bottom: 1px solid #333; background: rgba(0,0,0,0.5);">
                        <div style="display:flex; justify-content:space-between; margin-bottom: 5px;">
                            <span style="color:#ffcc00; font-weight:bold;">${rank}位 : B${safeFloor}F 到達</span>
                            <span style="color:#aaf; font-size:12px;">カルマ: ${data.karma || 0}</span>
                        </div>
                        <div style="display:flex; flex-wrap:wrap; justify-content:flex-start;">
                            ${partyHtml}
                        </div>
                    </div>`;
                rank++;
            });
            document.getElementById('deep-ranking-container').innerHTML = html || 'まだ記録がありません。';
        });
    }

    handleEnding() {
        this.clearTime = this.elapsedTimeAtSave + (Date.now() - (this.startTime || Date.now()));
        this.state = 'ENDING';
        audio.playBGM('bgm_ending');
        UI.showBlackout(this, "『渦』の波動が消失した...", 4000, () => {
            this.startEpilogue();
        });
    }

    startEpilogue() {
        document.getElementById('explore-menu').style.display = 'none';
        document.getElementById('story-screen').style.display = 'flex';
        this.storyIndex = 0;
        this.state = 'EPILOGUE';

        const getVictory = (char) => {
            const patterns = {
                '戦士': { male: '「終わったか......。よし、まずは酒場で一杯やらせてくれ。」', female: '「私たちの勝ちね！さあ、酒場に帰りましょう！」' },
                '盗賊': { male: '「最高の冒険だったぜ。お宝もたっぷりだしな！」', female: '「ふふ、この感覚......癖になりそう。またどこかでね。」' },
                '魔術師': { male: '「『渦』の消失を確認した。貴重な資料が手に入ったよ。」', female: '「私の魔法、完璧だったでしょ？さて、研究に戻るわね。」' },
                '僧侶': { male: '「神の御加護により、悪しき波動は消え去りました。誇りに思います。」', female: '「皆さんが無事で本当に良かったです。祈りが通じましたね。」' },
                '侍': { male: '「見事な戦いであった。拙者の刀も、喜んでいるようだ。」', female: '「乱れの根源を断てたこと、光栄に存じます。さらばです。」' },
                '武闘家': { male: '「いい汗をかいたぜ！やっぱり実戦が一番の修行だな。」', female: '「やり遂げたわ！最高に清々しい気分よ！ありがとう！」' },
                '狩人': { male: '「ふぅ......緊張が解けた。酒場に着いたら喉を潤すとしようぜ。」', female: '「私の矢が届いたわね。また新しい旅が楽しみだわ。」' },
                'モンク': { male: '「心身が研ぎ澄まされる勝負であった。良き旅であったよ。」', female: '「皆さんの絆が、闇を打ち払いました......感謝します。」' },
                'ビショップ': { male: '「天の裁きは下された。この地にも再び安寧が訪れるだろう。」', female: '「光の勝利です。この平穏が末永く続くことを祈りましょう。」' }
            };
            const jobPattern = patterns[char.job] || { male: '「終わったな。お疲れさん。」', female: '「終わったわね。お疲れ様。」' };
            return jobPattern[char.gender] || jobPattern.male;
        };

        this.storyMessages = [
            "迷宮の最深部...<br>『渦』が音もなく崩れ落ち、陽炎のように消えていく。",
            "地上に戻ると、懐かしい酒場の灯りが見えた。",
            "酒場にて...<br>死線を潜り抜けたパーティを、バーテンダーが温かく迎える。",
            "バーテンダー<br>「あなたたちならやってくれると信じていました。これでしばらくはこの街も安泰です。」",
            `${this.party[1].name}<br>${getVictory(this.party[1])}`,
            `${this.party[2].name}<br>${getVictory(this.party[2])}`,
            `${this.party[3].name}<br>${getVictory(this.party[3])}`,
            `${this.party[0].name}<br>「......ああ。これで終わりなんだな。それぞれの道を行くというわけか。」`,
            "バーテンダー<br>「一期一会、それが冒険者というものです。さあ、最後の乾杯を。街の平和に！」",
            "こうして、一時の仲間たちはそれぞれの旅路へと戻っていった。<br>彼らの物語は、今も語り継がれている......"
        ];
        this.displayNextStory();
    }

    showFinalRanking() {
        const elapsed = Math.floor(this.clearTime / 1000);
        const h = String(Math.floor(elapsed / 3600)).padStart(2, '0');
        const m = String(Math.floor((elapsed % 3600) / 60)).padStart(2, '0');
        const s = String(elapsed % 60).padStart(2, '0');
        const timeStr = `${h}:${m}:${s}`;

        document.getElementById('clear-time-display').textContent = timeStr;
        document.getElementById('ending-screen').style.display = 'flex';

        const btn = document.getElementById('btn-submit-score');
        btn.onclick = () => {
            const nameInput = document.getElementById('player-name-input');
            const name = nameInput.value.trim() || '名無し';
            btn.disabled = true;
            btn.textContent = '送信中...';

            if (window.firebaseInitialized) {
                const dbRankRef = window.firebaseRef('rankings');
                window.firebasePush(dbRankRef, {
                    name: name,
                    time: this.clearTime,
                    timeStr: timeStr,
                    karma: this.karma,
                    timestamp: JSON.parse(JSON.stringify(new Date())) // Alternative to ServerValue if needed, but compat push usually works
                }).then(() => {
                    btn.textContent = '登録完了！';
                }).catch(e => {
                    btn.textContent = 'エラー発生';
                    console.error(e);
                });
            } else {
                btn.textContent = 'オフライン';
            }
        };

        this.loadRankings();
    }

    loadRankings() {
        if (!window.firebaseInitialized) return;
        const dbRankRef = window.firebaseRef('rankings');
        const q = window.firebaseQuery(window.firebaseLimitToFirst(window.firebaseOrderByChild(dbRankRef, 'time'), 10));

        window.firebaseOnValue(q, (snapshot) => {
            let html = '';
            let rank = 1;
            const rankings = [];
            snapshot.forEach((childSnapshot) => {
                rankings.push(childSnapshot.val());
            });

            // Firebase returns in ascending order by default if using orderByChild('time')
            rankings.forEach((data) => {
                const safeName = typeof data.name === 'string' ?
                    data.name.replace(/[&<>'"]/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[m])) : '名無し';
                const safeTime = typeof data.timeStr === 'string' ?
                    data.timeStr.replace(/[&<>'"]/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[m])) : '';
                const karmaStr = data.karma !== undefined ? `<span style="color:#aaf; font-size:12px; margin-left:10px;">[カルマ: ${parseInt(data.karma, 10)}]</span>` : '';

                html += `<div class="rank-item" style="display:flex; justify-content:space-between; padding:5px; border-bottom:1px solid #333;">
                            <span>${rank}. ${safeName}${karmaStr}</span>
                            <span style="color:#ffcc00;">${safeTime}</span>
                         </div>`;
                rank++;
            });
            document.getElementById('ranking-container').innerHTML = html || 'まだ記録がありません。';
        });
    }

    closeEvent() {
        document.getElementById('event-screen').style.display = 'none';
        document.getElementById('explore-menu').style.display = 'flex';
        this.state = 'EXPLORE'; this.render();
    }

    castCampMagic(idx) {
        const caster = this.party[idx];
        const job = caster.job;

        if (['僧侶', 'ビショップ', 'モンク'].indexOf(job) !== -1) {
            // Heal logic
            if (caster.mp < 4 || caster.hp <= 0) { UI.addLog("MPが足りない。"); return; }
            let target = null, low = 1.0;
            this.party.forEach(p => { const effMax = this.getEffectiveMaxHp(p); const pct = p.hp / effMax; if (p.hp > 0 && pct < low && p.hp < effMax) { low = pct; target = p; } });
            if (!target) { UI.addLog("回復が必要な仲間にいない。"); return; }
            caster.mp -= 4; const heal = Math.max(15, caster.int + 10);
            target.hp = Math.min(this.getEffectiveMaxHp(target), target.hp + heal);
            UI.addLog(`${caster.name}の回復魔法！${target.name}のHPが${heal}回復した。`);
        } else if (job === '戦士') {
            if (caster.mp < 5) { UI.addLog("MPが足りない。"); return; }
            caster.mp -= 5;
            caster.battleBuffs.atk150FirstTurn = true;
            UI.addLog(`${caster.name}は戦意を鼓舞した！ 次の戦闘開始時に攻撃力が上昇する。`);
        } else if (job === '盗賊') {
            if (caster.mp < 10) { UI.addLog("MPが足りない。"); return; }
            caster.mp -= 10;
            const floor = LEVELS[this.currentFloor];
            for (let y = 0; y < floor.length; y++) {
                for (let x = 0; x < floor[y].length; x++) {
                    if ([4, 5, 6, 7].includes(floor[y][x])) {
                        this.visited[this.currentFloor][y][x] = true;
                    }
                }
            }
            this.thiefSkillActive[this.currentFloor] = true;
            UI.addLog(`${caster.name}の「隠密の眼」！ 階層内の罠と秘密が暴かれた。`);
        } else if (job === '狩人') {
            if (caster.mp < 10) { UI.addLog("MPが足りない。"); return; }
            caster.mp -= 10;
            caster.battleBuffs.preemptiveStrike = true;
            UI.addLog(`${caster.name}は弓に矢をつがえた。次の戦闘で先制攻撃を行う。`);
        } else if (job === '侍') {
            if (caster.mp < 30) { UI.addLog("MPが足りない。"); return; }
            caster.mp -= 30;
            caster.battleBuffs.atk200Def200 = true;
            UI.addLog(`${caster.name}は精神を統一した。次の戦闘の間、圧倒的な力を発揮する。`);
        } else if (job === '武闘家') {
            if (caster.mp < 15) { UI.addLog("MPが足りない。"); return; }
            caster.mp -= 15;
            caster.battleBuffs.ignoreDef = true;
            UI.addLog(`${caster.name}は気の流れを見極めた。次の戦闘の間、敵の防御を無視する。`);
        }
        this.updateUI();
    }

    getEffectiveMaxHp(p) {
        let val = p.maxHp || 0;
        ['weapon', 'armor', 'accessory'].forEach(s => {
            if (p.equipment && p.equipment[s] && p.equipment[s].hp !== undefined) val += p.equipment[s].hp;
        });
        // Also factor in VIT bonuses from equipment (each VIT point = 2 HP)
        const vitBonus = this.getEffectiveStat(p, 'vit') - p.vit;
        val += vitBonus * 2;
        return val;
    }

    getEffectiveMaxMp(p) {
        let val = p.maxMp || 0;
        ['weapon', 'armor', 'accessory'].forEach(s => {
            if (p.equipment && p.equipment[s] && p.equipment[s].mp !== undefined) val += p.equipment[s].mp;
        });
        // Also factor in INT bonuses from equipment (each INT point = 2 MP)
        const intBonus = this.getEffectiveStat(p, 'int') - p.int;
        val += intBonus * 2;
        return val;
    }

    getEffectiveStat(p, stat) {
        let val = p[stat] || 0;
        ['weapon', 'armor', 'accessory'].forEach(s => {
            if (p.equipment && p.equipment[s] && p.equipment[s][stat] !== undefined) val += p.equipment[s][stat];
        });
        return val;
    }

    getAtk(p) {
        let val = this.getEffectiveStat(p, 'str');
        ['weapon', 'armor', 'accessory'].forEach(s => {
            if (p.equipment[s] && p.equipment[s].atk !== undefined) val += p.equipment[s].atk;
        });
        return val;
    }

    getDef(p) {
        let val = this.getEffectiveStat(p, 'vit');
        ['weapon', 'armor', 'accessory'].forEach(s => {
            if (p.equipment[s] && p.equipment[s].def !== undefined) val += p.equipment[s].def;
        });
        return val;
    }

    useItem(charIdx, itemIdx) {
        const item = this.inventory[itemIdx];
        if (charIdx === null || item.targetAll) {
            if (item.effect) {
                item.effect(this.party);
            } else {
                // Fallback for serialized special items
                if (item.name === '妖精の霊薬' || item.name === 'ゴブリンの霊薬') {
                    this.party.forEach(p => { if (p.hp > 0) p.hp = Math.min(this.getEffectiveMaxHp(p), p.hp + 50); });
                    UI.addLog(`${item.name}を使った！全員のHPが50回復！`);
                } else if (item.name === '闇の叡智の結晶') {
                    this.party.forEach(p => { if (p.hp > 0) p.mp = Math.min(this.getEffectiveMaxMp(p), p.mp + 20); });
                    UI.addLog(`闇の叡智の結晶から魔力が溢れ出す！全員のMPが20回復した！`);
                } else if (item.name === '不思議な手鏡') {
                    Events.showMirrorUI(this);
                    return; // Don't remove/reset yet, Mirror UI handles closing
                } else if (item.hpRestore) {
                    this.party.forEach(p => { if (p.hp > 0) p.hp = Math.min(this.getEffectiveMaxHp(p), p.hp + item.hpRestore); });
                    UI.addLog(`${item.name}を使った！全員のHPが回復！`);
                } else if (item.mpRestore) {
                    this.party.forEach(p => { if (p.hp > 0) p.mp = Math.min(this.getEffectiveMaxMp(p), p.mp + item.mpRestore); });
                    UI.addLog(`${item.name}を使った！全員のMPが回復！`);
                }
            }
        } else {
            const target = this.party[charIdx];
            if (item.hpRestore) { 
                target.hp = Math.min(this.getEffectiveMaxHp(target), target.hp + item.hpRestore); 
                UI.addLog(`${target.name}は${item.name}を使った。`); 
                if (item.id === 4) { // Elixir cures all statuses
                    target.statuses = { poison: false, paralysis: false, confusion: false };
                    UI.addLog(`${target.name}の健康状態が完全に回復した！`);
                }
            }
            if (item.mpRestore) { target.mp = Math.min(this.getEffectiveMaxMp(target), target.mp + item.mpRestore); UI.addLog(`${target.name}は${item.name}を使った。`); }
        }
        if (!item.infinite) this.inventory.splice(itemIdx, 1);
        this.campMode = null; this.updateUI();
    }

    equipItem(charIdx, itemIdx) {
        const item = this.inventory[itemIdx], target = this.party[charIdx], type = item.type;
        const oldMaxHp = this.getEffectiveMaxHp(target);
        const oldMaxMp = this.getEffectiveMaxMp(target);

        if (target.equipment[type]) this.inventory.push(target.equipment[type]);
        target.equipment[type] = item; this.inventory.splice(itemIdx, 1);

        const newMaxHp = this.getEffectiveMaxHp(target);
        const newMaxMp = this.getEffectiveMaxMp(target);

        // Adjust current HP/MP if max changed
        if (newMaxHp > oldMaxHp) target.hp += (newMaxHp - oldMaxHp);
        if (newMaxMp > oldMaxMp) target.mp += (newMaxMp - oldMaxMp);
        target.hp = Math.min(newMaxHp, target.hp);
        target.mp = Math.min(newMaxMp, target.mp);

        UI.addLog(`${target.name}は${item.name}を装備した。`);
        this.campMode = null; this.updateUI();
    }

    unequipItem(idx, slot) {
        const target = this.party[idx];
        if (target.equipment[slot]) {
            const oldMaxHp = this.getEffectiveMaxHp(target);
            const oldMaxMp = this.getEffectiveMaxMp(target);

            this.inventory.push(target.equipment[slot]);
            target.equipment[slot] = null;

            const newMaxHp = this.getEffectiveMaxHp(target);
            const newMaxMp = this.getEffectiveMaxMp(target);

            target.hp = Math.min(newMaxHp, target.hp);
            target.mp = Math.min(newMaxMp, target.mp);

            this.updateUI();
        }
    }

    showTargetSelection(idx, action) {
        // Handled via UI.showTargetSelection if we want to move it there, but original had it here.
        // For simplicity with the UI namespace, I'll let the buttons call back to main.
        this.pendingItemIdx = idx; this.campMode = action === 'use' ? 'SELECT_TARGET' : 'SELECT_CHARACTER';
        this.updateUI();
    }

    executeItemAction(cidx, iidx, action) {
        if (action === 'use') this.useItem(cidx, iidx);
        else if (action === 'equip') this.equipItem(cidx, iidx);
    }

    dropItem(idx, confirmed = false) {
        if (idx === -1) { this.discardingItemIdx = -1; this.updateUI(); return; }
        if (confirmed) { UI.addLog(`${this.inventory[idx].name}を捨てた。`); this.inventory.splice(idx, 1); this.discardingItemIdx = -1; }
        else this.discardingItemIdx = idx;
        this.updateUI();
    }

    toggleCamp() {
        if (this.state === 'EXPLORE') {
            this.state = 'CAMP';
            document.getElementById('explore-menu').style.display = 'none';
            document.getElementById('camp-menu').style.display = 'flex';
            this.updateUI();
        } else if (this.state === 'CAMP') {
            this.state = 'EXPLORE';
            document.getElementById('camp-menu').style.display = 'none';
            document.getElementById('explore-menu').style.display = 'flex';
            this.discardingItemIdx = -1;
            this.updateUI();
            this.saveGame();
        }
    }

    updateVisited() {
        const { x, y } = this.playerPos;
        for (let dy = -1; dy <= 1; dy++) { for (let dx = -1; dx <= 1; dx++) { const ny = y + dy, nx = x + dx; if (ny >= 0 && ny < MAP_SIZE && nx >= 0 && nx < MAP_SIZE) this.visited[this.currentFloor][ny][nx] = true; } }
    }

    teleport() {
        let rx, ry; do { rx = 1 + Math.floor(Math.random() * (MAP_SIZE - 2)); ry = 1 + Math.floor(Math.random() * (MAP_SIZE - 2)); } while (LEVELS[this.currentFloor][ry][rx] === 1);
        this.playerPos.x = rx; this.playerPos.y = ry; this.updateVisited(); this.render();
    }

    generateLoot(rankBonus = 0) {
        const pool = ITEMS.filter(i => i.level <= this.currentFloor + 1 + rankBonus);
        const item = { ...pool[Math.floor(Math.random() * pool.length)] };
        if (item.type !== 'consumable') {
            const p = ITEM_PREFIXES[Math.floor(Math.random() * ITEM_PREFIXES.length)];
            item.name = p.name + item.name;
            const stats = ['atk', 'def', 'int', 'agi', 'vit', 'str', 'luk'];
            stats.forEach(s => {
                if (item[s] !== undefined) item[s] = Math.round(item[s] * p.mult);
            });

            // Dynamically update description to match multi-stats
            if (p.mult !== 1.0) {
                item.desc = item.desc.replace(/([\+\-])([0-9]+)/g, (match, sign, val) => {
                    const newVal = Math.round(parseInt(val) * p.mult);
                    return (newVal >= 0 ? '+' : '') + newVal;
                });
            }

            // Add random status effects/resistances
            const possibleStatuses = ['poison', 'paralysis', 'confusion'];
            const labels = { poison: '毒', paralysis: '麻痺', confusion: '混乱' };
            const addedInflict = [];
            const addedResist = [];

            if (item.type === 'weapon' || item.type === 'accessory') {
                possibleStatuses.forEach(s => {
                    if (Math.random() < 0.15) addedInflict.push(s);
                });
            }
            if (item.type === 'armor' || item.type === 'accessory') {
                possibleStatuses.forEach(s => {
                    if (Math.random() < 0.2) addedResist.push(s);
                });
            }

            if (addedInflict.length > 0) item.inflictStatuses = addedInflict;
            if (addedResist.length > 0) item.resistStatuses = addedResist;

            const allEffects = [...addedInflict, ...addedResist];
            const uniqueEffects = [...new Set(allEffects)];
            if (uniqueEffects.length > 0) {
                const suffix = uniqueEffects.map(s => labels[s]).join('・');
                item.name += ` (${suffix})`;
            }
        }
        return item;
    }

    render() { UI.render(this, assets); }
    updateUI() { UI.updateUI(this); }
    saveGame() {
        const data = {
            party: this.party,
            inventory: this.inventory,
            pos: this.playerPos,
            floor: this.currentFloor,
            visited: this.visited,
            thiefSkillActive: this.thiefSkillActive,
            npcFlags: this.npcFlags,
            karma: this.karma,
            elapsed: this.elapsedTimeAtSave + (Date.now() - (this.startTime || Date.now())),
            levels: LEVELS
        };
        localStorage.setItem('wiztaste_save', JSON.stringify(data));
    }
}

window.game = new Game();
// Final re-render and UI update to ensure everything is visible after all scripts and assets load
setTimeout(() => {
    if (window.game) {
        window.game.render();
        window.game.updateUI();
    }
}, 100);
