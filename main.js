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

['wall', 'floor', 'ceiling', 'stair_up', 'stair_down'].forEach(k => {
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
            inventory: []
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
        if (data.levels) {
            LEVELS.length = 0;
            data.levels.forEach(l => LEVELS.push(l));
        }
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
                        <button class="btn" style="padding:0 5px; height:18px; font-size:10px;" ${char[stat] <= char[baseKey] ? 'disabled' : ''} onclick="game.adjustStat(${idx}, '${stat}', -1)">-</button>
                        <span style="display:inline-block; width:20px; text-align:center; font-size:12px;">${char[stat]}</span>
                        <button class="btn" style="padding:0 5px; height:18px; font-size:10px;" ${char.bonusLeft <= 0 ? 'disabled' : ''} onclick="game.adjustStat(${idx}, '${stat}', 1)">+</button>
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
        btnStart.textContent = '冒険開始 (タイマー始動)';
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
        if (this.storyIndex >= this.storyMessages.length) { this.startGame(); return; }
        const msg = this.storyMessages[this.storyIndex++];
        storyContent.innerHTML = `<div class="story-anim">${msg}</div>`;
        nextBtn.style.display = 'none';
        setTimeout(() => {
            nextBtn.style.display = 'inline-block';
            if (this.storyIndex >= this.storyMessages.length) { nextBtn.textContent = '迷宮へ向かう'; nextBtn.style.color = '#f55'; nextBtn.style.borderColor = '#f55'; }
            else { nextBtn.textContent = '次へ ▼'; nextBtn.style.color = '#ffcc00'; nextBtn.style.borderColor = '#ffcc00'; }
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
                    if (isGain) p.hp = Math.min(p.maxHp, p.hp + amount);
                    else p.hp = Math.max(1, p.hp - amount);
                } else {
                    if (isGain) p.mp = Math.min(p.maxMp, p.mp + amount);
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
        if (tile === 3) this.changeFloor(1);
        else if (tile === 2) this.changeFloor(-1);
        else if (tile === 5) { UI.addLog("テレポーターだ！"); this.teleport(); }
        else if (tile === 7) { UI.addLog("床が回転した！"); this.playerPos.dir = Math.floor(Math.random() * 4); }
        else if (tile === 6) { UI.addLog("暗闇だ..."); }
        else if (tile === 8) this.startBossBattle();
        else if (tile === 9) Events.triggerEvent(this, this.currentFloor + 1);
        else if (tile === 4) { UI.addLog("隠し扉から奥へ進んだ..."); floor[this.playerPos.y][this.playerPos.x] = 0; if (Math.random() < 0.7) { this.addLog("誰も足を踏み入れていない部屋だ！宝箱を見つけた！"); this.inventory.push(this.generateLoot()); } else { this.addLog("部屋の奥から強力な魔物が現れた！"); this.startBattle(true); } }
        else this.checkEncounter();
    }

    changeFloor(delta) {
        if (this.currentFloor === 0 && delta === -1) { UI.addLog("地上への階段だ。しかし今は戻れない。"); return; }
        this.currentFloor += delta;
        UI.addLog(`地下 ${this.currentFloor + 1} 階へ。`);
        document.getElementById('floor-indicator').textContent = `B${this.currentFloor + 1}F`;
        let found = false, next = LEVELS[this.currentFloor], target = delta === 1 ? 2 : 3;
        for (let r = 0; r < next.length; r++) { for (let c = 0; c < next[r].length; c++) { if (next[r][c] === target) { this.playerPos.x = c; this.playerPos.y = r; found = true; break; } } if (found) break; }
        if (!found) { this.playerPos.x = 1; this.playerPos.y = 1; }
        this.updateVisited();
    }

    checkEncounter() { if (Math.random() < 0.12) this.startBattle(); }

    startBattle(isHard = false) {
        this.state = 'BATTLE';
        audio.playBGM('bgm_battle');
        let floorMonsters = isHard ? MONSTERS.filter(m => m.level === Math.min(10, this.currentFloor + 3)) : MONSTERS.filter(m => m.level === this.currentFloor + 1);
        let num = 1, r = Math.random(); if (r > 0.6) num = 2; if (r > 0.9) num = 3;
        this.currentBattle = { monsters: [], turnOrder: [], phase: 'INPUT', isBoss: false };
        let moHtml = '';
        for (let i = 0; i < num; i++) {
            const data = floorMonsters[Math.floor(Math.random() * floorMonsters.length)] || MONSTERS[0];
            const m = { ...data, currentHp: data.hp, id: `monster-${i}`, originalName: data.name };
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
        mo.style.display = 'flex'; audio.playBGM('bgm_battle');
        this.turnIndex = 0;
        while (this.turnIndex < this.party.length && this.party[this.turnIndex].hp <= 0) this.turnIndex++;
        this.updateUI();
    }

    startBossBattle() {
        const boss = { id: 'monster-0', name: "アビスロード", hp: 8500, maxHp: 8500, currentHp: 8500, atk: 280, agi: 60, exp: 30000, level: 10, svg: `<img src="assets/boss.png" style="width:100%; height:100%; object-fit:contain; transform:scale(1.8);" />` };
        this.startCustomBattle([boss], { isBoss: true });
        audio.playBGM('bgm_boss');
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
        if (bt.isBoss) { this.handleEnding(); return; }
        let totalExp = 0; bt.monsters.forEach(m => totalExp += m.exp);
        const alive = this.party.filter(p => p.hp > 0);
        if (alive.length > 0) {
            totalExp = Math.floor(totalExp / alive.length);
            this.party.forEach(p => {
                if (p.hp > 0) {
                    p.exp += totalExp;
                    let nextExp = Math.floor(50 * Math.pow(p.level, 1.7));
                    while (p.exp >= nextExp) {
                        p.exp -= nextExp;
                        this.levelUp(p);
                        nextExp = Math.floor(50 * Math.pow(p.level, 1.7));
                    }
                }
            });
        }
        UI.addLog(`経験値を ${totalExp} 獲得した！`);

        if (bt.isSwordsmanEvent) this.inventory.push({ name: "深淵のロングソード", type: "weapon", atk: 55, req: { str: 40 }, desc: "瘴気を帯びた伝説の剣(ATK+55)" });
        if (bt.isGoblinEvent) this.inventory.push({ name: "キングの冠", type: "accessory", luk: 30, desc: "王の威厳(LUK+30)" });
        if (bt.isDarkSageLoot) {
            UI.addLog("闇の賢者の残した「闇の叡智の結晶」を手に入れた！");
            this.inventory.push({
                name: '闇の叡智の結晶', type: 'consumable', infinite: true, targetAll: true, mpRestore: 20, desc: '何度でも使える魔力の結晶',
                effect: () => {
                    game.party.forEach(p => { if (p.hp > 0) p.mp = Math.min(p.maxMp, p.mp + 20); });
                    UI.addLog(`闇の叡智の結晶から魔力が溢れ出す！全員のMPが20回復した！`);
                }
            });
        }
        if (bt.isGoblinPlunder) {
            UI.addLog("ゴブリンの親子から「妖精の霊薬」と「ゴブリンの鉈」を奪い取った！");
            this.inventory.push({
                name: '妖精の霊薬', type: 'consumable', infinite: true, targetAll: true, hpRestore: 50, desc: '何度でも使える全体回復薬',
                effect: () => {
                    game.party.forEach(mbr => { if (mbr.hp > 0) mbr.hp = Math.min(mbr.maxHp, mbr.hp + 50); });
                    UI.addLog(`妖精の霊薬を使った！全員のHPが50回復！`);
                }
            });
            this.inventory.push({ name: "ゴブリンの鉈", type: "weapon", atk: 30, req: { str: 20 }, desc: "業物だがひどく血生臭い鉈(ATK+30)" });
        }

        if (Math.random() < 0.3) {
            console.log("Triggering treasure event");
            Events.triggerTreasureEvent(this, this.generateLoot());
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
        p.maxHp += 10; p.maxMp += 5; p.hp = p.maxHp; p.mp = p.maxMp;
        UI.addLog(`${p.name}はレベル ${p.level} に上がった！`);
    }

    async handleGameOver() {
        const penaltySeconds = (this.currentFloor + 1) * 30;
        this.elapsedTimeAtSave += (penaltySeconds * 1000);
        this.state = 'GAMEOVER'; audio.playBGM('bgm_dead');
        await UI.showBlackout(this, "全滅した...", 3000, () => {
            this.playerPos = { x: 1, y: 1, dir: 1 }; this.currentFloor = 0;
            this.party.forEach(p => { p.hp = p.maxHp; p.mp = p.maxMp; p.deadLogged = false; });
            document.getElementById('floor-indicator').textContent = 'B1F';
            this.exitBattle();
            UI.addLog("気が付いたら迷宮の入り口に戻っていた。アビスロードを倒すまで町には戻れないようだ");
        });
    }

    handleEnding() {
        this.state = 'ENDING'; audio.playBGM('bgm_ending');
        UI.showBlackout(this, "『渦』の波動が消失した...", 4000, () => {
            document.getElementById('ending-screen').style.display = 'flex';
            this.renderRanking();
        });
    }

    renderRanking() {
        // Simple ranking placeholder
        const list = document.getElementById('ranking-list');
        if (list) list.innerHTML = `<li>1st: ${this.party[0].name} (Karma: ${this.karma})</li>`;
    }

    closeEvent() {
        document.getElementById('event-screen').style.display = 'none';
        document.getElementById('explore-menu').style.display = 'flex';
        this.state = 'EXPLORE'; this.render();
    }

    castCampMagic(idx) {
        const caster = this.party[idx]; if (caster.mp < 3 || caster.hp <= 0) return;
        let target = null, low = 1.0;
        this.party.forEach(p => { const pct = p.hp / p.maxHp; if (p.hp > 0 && pct < low && p.hp < p.maxHp) { low = pct; target = p; } });
        if (!target) { UI.addLog("回復が必要な仲間にいない。"); return; }
        caster.mp -= 3; const heal = Math.max(15, caster.int + 10);
        target.hp = Math.min(target.maxHp, target.hp + heal);
        UI.addLog(`${caster.name}の回復魔法！${target.name}のHPが${heal}回復した。`);
        this.updateUI();
    }

    useItem(charIdx, itemIdx) {
        const item = this.inventory[itemIdx];
        if (charIdx === null || item.targetAll) {
            if (item.effect) {
                item.effect(this.party);
            } else {
                // Fallback for serialized special items
                if (item.name === '妖精の霊薬') {
                    this.party.forEach(p => { if (p.hp > 0) p.hp = Math.min(p.maxHp, p.hp + 50); });
                    UI.addLog(`妖精の霊薬を使った！全員のHPが50回復！`);
                } else if (item.hpRestore) {
                    this.party.forEach(p => { if (p.hp > 0) p.hp = Math.min(p.maxHp, p.hp + item.hpRestore); });
                    UI.addLog(`${item.name}を使った！全員のHPが回復！`);
                } else if (item.mpRestore) {
                    this.party.forEach(p => { if (p.hp > 0) p.mp = Math.min(p.maxMp, p.mp + item.mpRestore); });
                    UI.addLog(`${item.name}を使った！全員のMPが回復！`);
                }
            }
        } else {
            const target = this.party[charIdx];
            if (item.hpRestore) { target.hp = Math.min(target.maxHp, target.hp + item.hpRestore); UI.addLog(`${target.name}は${item.name}を使った。`); }
            if (item.mpRestore) { target.mp = Math.min(target.maxMp, target.mp + item.mpRestore); UI.addLog(`${target.name}は${item.name}を使った。`); }
        }
        if (!item.infinite) this.inventory.splice(itemIdx, 1);
        this.campMode = null; this.updateUI();
    }

    equipItem(charIdx, itemIdx) {
        const item = this.inventory[itemIdx], target = this.party[charIdx], type = item.type;
        if (target.equipment[type]) this.inventory.push(target.equipment[type]);
        target.equipment[type] = item; this.inventory.splice(itemIdx, 1);
        UI.addLog(`${target.name}は${item.name}を装備した。`);
        this.campMode = null; this.updateUI();
    }

    unequipItem(idx, slot) {
        const target = this.party[idx];
        if (target.equipment[slot]) { this.inventory.push(target.equipment[slot]); target.equipment[slot] = null; this.updateUI(); }
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

    generateLoot() {
        const pool = ITEMS.filter(i => i.level <= this.currentFloor + 1);
        const item = { ...pool[Math.floor(Math.random() * pool.length)] };
        if (item.type !== 'consumable') { const p = ITEM_PREFIXES[Math.floor(Math.random() * ITEM_PREFIXES.length)]; item.name = p.name + item.name; if (item.atk) item.atk = Math.round(item.atk * p.mult); }
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
            npcFlags: this.npcFlags,
            karma: this.karma,
            elapsed: this.elapsedTimeAtSave + (Date.now() - (this.startTime || Date.now())),
            levels: LEVELS
        };
        localStorage.setItem('wiztaste_save', JSON.stringify(data));
    }
}

window.game = new Game();
