/**
 * EVENT LOGIC
 */
const Events = {
    triggerEvent: function (game, floor) {
        if (floor !== 2) {
            const flagName = `event${floor}FDone`;
            if (game.npcFlags[flagName] && !(floor === 4 && game.npcFlags.friendGoblin && !game.npcFlags.rewardedGoblin)) {
                UI.addLog("静寂。ここにはもう誰もいないようだ……。");
                return;
            }
        }

        game.state = 'EVENT';
        const exploreMenu = document.getElementById('explore-menu');
        if (exploreMenu) exploreMenu.style.display = 'none';

        const screen = document.getElementById('event-screen');
        const title = document.getElementById('event-title');
        const desc = document.getElementById('event-desc');
        const img = document.getElementById('event-img');
        const options = document.getElementById('event-options');

        if (screen) screen.style.display = 'flex';
        if (title) title.textContent = '';
        if (desc) desc.innerHTML = '';
        if (options) options.innerHTML = '';

        let imgName = `event_${floor}`;
        if (floor === 9) imgName = game.npcFlags.helpedAdventurer ? 'event_9alive' : 'event_9dead';
        else if (floor === 7) imgName = game.npcFlags.metSwordsman ? 'event_7mad' : 'event_7dead';
        else if (floor === 4) imgName = (game.npcFlags.friendGoblin && !game.npcFlags.rewardedGoblin) ? 'event_4reunion' : 'event_4child';
        else if (floor === 6) imgName = game.npcFlags.savedGoblin ? 'event_6parent_friend' : 'event_6parent_enemy';

        if (img) {
            img.src = `assets/${imgName}.png`;
            img.style.display = 'block';
            img.onerror = () => { img.style.display = 'none'; };
        }

        if (floor === 1) this.handleEvent1F(game, title, desc, options);
        else if (floor === 2) this.handleEvent2F(game, title, desc, options);
        else if (floor === 3) this.handleEvent3F(game, title, desc, options);
        else if (floor === 4) this.handleEvent4F(game, title, desc, options);
        else if (floor === 5) this.handleEvent5F(game, title, desc, options);
        else if (floor === 6) this.handleEvent6F(game, title, desc, options);
        else if (floor === 7) this.handleEvent7F(game, title, desc, options);
        else if (floor === 8) this.handleEvent8F(game, title, desc, options);
        else if (floor === 9) this.handleEvent9F(game, title, desc, options);

        // Add keyboard hints to event options
        const hints = ['(A)', '(S)', '(D)', '(F)'];
        const buttons = options.querySelectorAll('button');
        buttons.forEach((btn, idx) => {
            if (hints[idx]) btn.textContent += ` ${hints[idx]}`;
        });
    },

    handleEvent2F: function (game, title, desc, options) {
        title.textContent = "老師";
        const allHighLevel = game.party.every(p => p.level >= 10);
        if (allHighLevel) {
            desc.innerHTML = "静かに目を閉じた老人が、おもむろに口を開いた。<br><br>「汝、さらなる高みへ導こう。心して励むが良い。」<br><br>※現在のステータスがベースステータスとして固定されます。<br>これにより、強力な武器や防具の装備条件をクリアしやすくなります。";
            const btn = document.createElement('button');
            btn.className = 'btn'; btn.textContent = '修行を受ける';
            btn.onclick = () => {
                game.party.forEach(p => { p.baseStr = p.str; p.baseInt = p.int; p.baseVit = p.vit; p.baseAgi = p.agi; p.baseLuk = p.luk; });
                UI.addLog("老師の導きにより、真の力が呼び覚まされた！装備の制限が大幅に緩和された。");
                game.closeEvent();
            };
            options.appendChild(btn);
        } else {
            desc.innerHTML = "静かに目を閉じた老人が、おもむろに口を開いた。<br><br>「汝、本当の絶望を知らぬようだ。」<br><br>※修行を受けるには全員がレベル10以上である必要があります。";
            const btn = document.createElement('button');
            btn.className = 'btn'; btn.textContent = '立ち去る';
            btn.onclick = () => game.closeEvent();
            options.appendChild(btn);
        }
    },

    handleEvent1F: function (game, title, desc, options) {
        title.textContent = "古びた手鏡";
        desc.innerHTML = "冷たい石畳の上に、装飾の施された手鏡が落ちている。<br>鏡面には、誰かのものであろう激しい情念が焼き付いているようだ。<br><br>この鏡は、持ち主の業（カルマ）を反射し、運命を歪めるという。";
        const btnTake = document.createElement('button');
        btnTake.className = 'btn'; btnTake.textContent = '鏡を拾い上げる';
        btnTake.onclick = () => {
            game.karma += 5; UI.addLog("不思議な手鏡を手に入れた。冷たい感触が手に残る。");
            game.npcFlags.hasMirror = true;
            game.npcFlags.event1FDone = true;
            game.inventory.push({
                name: '不思議な手鏡', type: 'consumable', infinite: true, targetAll: true,
                desc: 'カルマを映し出す鏡。所持しているだけで運命を変える。',
                effect: () => { Events.showMirrorUI(game); }
            });
            game.closeEvent();
        };
        const btnBreak = document.createElement('button');
        btnBreak.className = 'btn'; btnBreak.textContent = '鏡を叩き割る';
        btnBreak.onclick = () => {
            game.karma -= 20; UI.addLog("あなたは不吉な鏡を粉々に砕いた。耳障りな甲高い音が響き渡る。");
            game.npcFlags.event1FDone = true;
            game.closeEvent();
        };
        options.appendChild(btnTake); options.appendChild(btnBreak);
    },

    showMirrorUI: function (game) {
        game.state = 'EVENT';
        const screen = document.getElementById('event-screen');
        const title = document.getElementById('event-title');
        const desc = document.getElementById('event-desc');
        const img = document.getElementById('event-img');
        const options = document.getElementById('event-options');

        if (screen) screen.style.display = 'flex';
        const campMenu = document.getElementById('camp-menu');
        if (campMenu) campMenu.style.display = 'none';

        title.textContent = "不思議な手鏡";
        if (img) { img.src = "assets/event_1.png"; img.style.display = "block"; }

        const k = game.karma;
        const regenProb = Math.abs(k) / 100;
        const drainProb = regenProb / 10;

        let msg = "";
        if (k > 100) msg = "鏡面は清らかな光を放っている。徳を積んだあなたの魂が癒やしを求めている。";
        else if (k >= 0) msg = "鏡面は曇っている。まだあなたの魂は定まっていないようだ。";
        else if (k > -100) msg = "鏡の奥から不穏な霧が湧き出している。悪徳があなたを蝕み始めている。";
        else msg = "鏡面はどす黒く染まり、悦びに震えている。邪悪な力があなたの魔を研ぎ澄ましている。";

        const type = k >= 0 ? "HP" : "MP";
        const dType = k >= 0 ? "MP" : "HP";

        desc.innerHTML = `${msg}<br><br><strong>カルマ：${k}</strong><br><br>` +
            `<span style="color:#5f5;">${type}回復：${(regenProb * 100).toFixed(1)}% (毎歩)</span><br>` +
            `<span style="color:#f55;">${dType}減少：${(drainProb * 100).toFixed(1)}% (毎歩)</span>`;

        options.innerHTML = '';
        const btnBack = document.createElement('button');
        btnBack.className = 'btn'; btnBack.textContent = '鏡をしまう (A)';
        btnBack.onclick = () => game.closeEvent();
        options.appendChild(btnBack);
    },

    handleEvent3F: function (game, title, desc, options) {
        title.textContent = "気前のよい剣士『アルトリウス』";
        desc.innerHTML = "陽気な笑みを浮かべた見栄えのいい剣士が、馴れ馴れしく話しかけてきた。<br><br>「やあ君たち、そんな装備でここに来たのかい？ははは、無茶をする！」<br><br>彼は気のいい男のようだ。自分のおさがりの武器を差し出してきた。<br>「ここでの掟は持ちつ持たれつさ。俺のおさがりだけど、持っていくといい。いつか恩返ししてくれよ？」";
        const btn = document.createElement('button');
        btn.className = 'btn'; btn.textContent = '受け取る';
        btn.onclick = () => {
            game.karma += 10; UI.addLog("気前のよい剣士アルトリウスから ロングソード をもらった！");
            game.npcFlags.event3FDone = true;
            game.npcFlags.metSwordsman = true; // Also set metSwordsman for later events
            const weapon = ITEMS.find(i => i.name === 'ロングソード');
            game.inventory.push(weapon ? { ...weapon } : { name: 'ロングソード', type: 'weapon', level: 5, atk: 8, req: { str: 10 }, desc: '標準的な剣(ATK+8)' });
            game.closeEvent();
        };
        options.appendChild(btn);
        const btnFight = document.createElement('button');
        btnFight.className = 'btn'; btnFight.textContent = '戦う';
        btnFight.onclick = () => {
            game.karma -= 70; UI.addLog("「やれやれ、恩を仇で返すとはこのことか。遊んでやるよ！」");
            game.npcFlags.event3FDone = true;
            game.closeEvent();
            game.startCustomBattle([{
                id: 'monster-0', name: "剣士アルトリウス", hp: 300, maxHp: 300, currentHp: 300, atk: 30, agi: 10, exp: 400, level: 3,
                svg: `<img src="assets/event_3.png" style="width:100%; height:100%; object-fit:contain;" />`
            }], { isArtoriusLoot: true });
        };
        options.appendChild(btnFight);
    },

    handleEvent4F: function (game, title, desc, options) {
        if (game.npcFlags.friendGoblin && !game.npcFlags.rewardedGoblin) {
            title.textContent = "ゴブリン親子の再会";
            desc.innerHTML = "以前見逃した小ゴブリンと、親ゴブリンが抱き合って喜んでいる。<br><br>親ゴブリンがこちらに気づき、深く頭を下げて<br>光り輝く小瓶を差し出してきた。";
            const btnAccept = document.createElement('button');
            btnAccept.className = 'btn'; btnAccept.textContent = '受け取る';
            btnAccept.onclick = () => {
                game.karma += 30; UI.addLog("ゴブリンの親子から 妖精の霊薬 をもらった！");
                game.npcFlags.rewardedGoblin = true;
                game.npcFlags.event4FDone = true; // Mark as done again so reunion doesn't repeat
                const elixir = {
                    name: '妖精の霊薬', type: 'consumable', infinite: true, targetAll: true, hpRestore: 50, desc: '何度でも使える全体回復薬',
                    effect: () => {
                        game.party.forEach(mbr => { if (mbr.hp > 0) mbr.hp = Math.min(mbr.maxHp, mbr.hp + 50); });
                        UI.addLog(`妖精の霊薬を使った！全員のHPが50回復！`);
                    }
                };
                game.inventory.push(elixir);
                game.closeEvent();
            };
            options.appendChild(btnAccept);
            const btnPlunder = document.createElement('button');
            btnPlunder.className = 'btn'; btnPlunder.textContent = '略奪';
            btnPlunder.onclick = () => {
                game.karma -= 50; UI.addLog("人間の平和と安心のため、あなたは再会を喜ぶゴブリン親子に武器を向けた。");
                game.npcFlags.rewardedGoblin = true;
                game.npcFlags.event4FDone = true;
                game.closeEvent();
                game.startCustomBattle([
                    {
                        id: 'monster-0', name: "キングゴブリン", hp: 1300, maxHp: 1300, currentHp: 1300, atk: 130, agi: 25, exp: 600, level: 4,
                        svg: `<img src="assets/event_6parent_friend.png" style="width:100%; height:100%; object-fit:contain; transform:scale(1.5);" />`
                    },
                    {
                        id: 'monster-1', name: "スモールゴブリン", hp: 40, maxHp: 40, currentHp: 40, atk: 10, agi: 5, exp: 20, level: 4,
                        svg: `<img src="assets/event_4child.png" style="width:100%; height:100%; object-fit:contain; transform:scale(0.8);" />`
                    }
                ], { isGoblinPlunder: true });
            };
            options.appendChild(btnPlunder);
        } else {
            title.textContent = "はぐれゴブリン";
            desc.innerHTML = "親とはぐれた子供のゴブリンが壁の隅で震えている。<br><br>ひどく怯えており、こちらに襲いかかってくる様子はない。";
            const btnFight = document.createElement('button');
            btnFight.className = 'btn'; btnFight.textContent = '戦う';
            btnFight.onclick = () => {
                game.karma -= 50; UI.addLog("魔物の幼生とはいえ、生かしておけばいずれ脅威となる。あなたは静かに武器を構えた。");
                game.npcFlags.event4FDone = true;
                game.closeEvent();
                game.startCustomBattle([{
                    id: 'monster-0', name: "スモールゴブリン", hp: 40, maxHp: 40, currentHp: 40, atk: 10, agi: 5, exp: 20, level: 4,
                    svg: `<img src="assets/event_4child.png" style="width:100%; height:100%; object-fit:contain; transform:scale(0.8);" />`
                }], { isSmallGoblinLoot: true });
            };
            const btnMercy = document.createElement('button');
            btnMercy.className = 'btn'; btnMercy.textContent = '見逃す';
            btnMercy.onclick = () => {
                game.karma += 20; UI.addLog("不要な戦闘は避けるべきだ。あなたは震えるゴブリンを横目に、足早に退避した。");
                game.npcFlags.savedGoblin = true; game.npcFlags.event4FDone = true;
                game.closeEvent();
            };
            options.appendChild(btnFight); options.appendChild(btnMercy);
        }
    },

    handleEvent5F: function (game, title, desc, options) {
        title.textContent = "負傷した騎士";
        desc.innerHTML = "薄暗い通路の隅に、血を流して倒れている騎士がいる。<br><br>息も絶え絶えにこちらを見上げ、助けを求めているようだ...。<br><br>※助ける場合、パーティ全員のMPが0になり、所持している消耗アイテム（ポーション等）をすべて失います。";
        const btnHelp = document.createElement('button');
        btnHelp.className = 'btn'; btnHelp.textContent = '助ける';
        btnHelp.onclick = () => {
            game.karma += 50; UI.addLog("あなたは手持ちの道具と魔力を駆使して騎士を治療した！");
            game.npcFlags.helpedAdventurer = true; game.npcFlags.event5FDone = true;
            game.party.forEach(p => p.mp = 0);
            game.inventory = game.inventory.filter(item => item.type !== 'consumable');
            UI.addLog("パーティ全員のMPが0になり、全消費アイテムを失った...");
            game.closeEvent();
        };
        const btnAbandon = document.createElement('button');
        btnAbandon.className = 'btn'; btnAbandon.textContent = '見捨てる';
        btnAbandon.onclick = () => {
            game.karma -= 20; UI.addLog("自分たちの生存すら保証されていない迷宮で、彼を背負う余裕はない。あなたは無言で立ち去った。");
            game.npcFlags.event5FDone = true; game.closeEvent();
        };
        options.appendChild(btnHelp); options.appendChild(btnAbandon);
        const btnPlunder = document.createElement('button');
        btnPlunder.className = 'btn'; btnPlunder.textContent = '略奪';
        btnPlunder.onclick = () => {
            game.karma -= 30; UI.addLog("あなたは弱り切った騎士から荷物を奪い取るべく襲いかかった。");
            game.npcFlags.event5FDone = true;
            game.closeEvent();
            game.startCustomBattle([{
                id: 'monster-0', name: "負傷した騎士", hp: 100, maxHp: 100, currentHp: 100, atk: 50, agi: 10, exp: 300, level: 5,
                svg: `<img src="assets/event_5.png" style="width:100%; height:100%; object-fit:contain;" />`
            }], { isAdventurerLoot: true });
        };
        options.appendChild(btnPlunder);
    },

    handleEvent7F: function (game, title, desc, options) {
        if (game.npcFlags.metSwordsman) {
            title.textContent = "狂乱の剣士『アルトリウス』";
            desc.innerHTML = "…っ！！　彼は、３階でロングソードをくれた気前のよい冒険者だ。あの活発な笑顔の面影を潜め、今はただ血走った眼差しで虚空を睨みつけている。<br><br>迷宮の瘴気にあてられ、彼の精神は完全に崩壊していた。口元から止めるどなく液を垂らし、かつて君たちに軽口を叩いたその口で、今は意味をなさない罵声を吐き続けている。<br><br>「アァ…モウ…モウ何もかもおしまいだ…！オマエタチも、俺の邪魔をするのか…！？」<br><br>突如、男が奇声を上げ、得物を振りかざして襲いかかってきた！！";
            const btnFight = document.createElement('button');
            btnFight.className = 'btn'; btnFight.textContent = '戦う';
            btnFight.onclick = () => {
                game.karma += 10; UI.addLog("狂気に飲まれた剣士が襲いかかってきた！");
                game.npcFlags.event7FDone = true;
                game.closeEvent();
                game.startCustomBattle([{
                    id: 'monster-0', name: "狂乱の剣士", hp: 2500, maxHp: 2500, currentHp: 2500, atk: 190, agi: 85, exp: 900, level: 7,
                    svg: `<img src="assets/event_7mad.png" style="width:100%; height:100%; object-fit:contain; transform:scale(1.2);" />`
                }], { isSwordsmanEvent: true });
            };
            options.appendChild(btnFight);
            const btnRun = document.createElement('button');
            btnRun.className = 'btn'; btnRun.textContent = '逃げる';
            btnRun.onclick = () => {
                game.karma -= 10; UI.addLog("狂気に侵された彼から目を背け、あなたは命からがらその場を離れた。");
                // Don't set event7FDone = true so it can re-trigger
                // Move player back one tile to avoid infinite loop
                const dir = game.playerPos.dir;
                const dx = [0, 1, 0, -1][dir], dy = [-1, 0, 1, 0][dir];
                game.playerPos.x -= dx;
                game.playerPos.y -= dy;

                game.party.forEach(p => { if (p.hp > 0) p.hp = Math.max(1, Math.floor(p.hp * 0.2)); });
                UI.addLog("逃走の代償として、パーティ全員が深手を負った！（HP残り20%）");
                UI.addLog("「あはは......『渦』には逆らえない......誰もね......」");
                game.closeEvent();
            };
            options.appendChild(btnRun);
        } else {
            title.textContent = "冒険者の遺体";
            desc.innerHTML = "通路の先で、冒険者の無惨な死体を発見した。<br><br>彼の傍らには、禍々しい血の気を放つ<br>装備品が転がっている。";
            const btnLoot = document.createElement('button');
            btnLoot.className = 'btn'; btnLoot.textContent = '奪い取る';
            btnLoot.onclick = () => {
                game.karma -= 20; UI.addLog("これは彼にはもう必要のない物だ。あなたは遺体から装備品を回収した。");
                game.npcFlags.event7FDone = true;
                game.inventory.push({ name: "呪われた 狂戦士の剣", type: "weapon", atk: 45, desc: "強力だが所有者の精神を蝕む" });
                game.closeEvent();
            };
            options.appendChild(btnLoot);
        }
    },

    handleEvent6F: function (game, title, desc, options) {
        if (game.npcFlags.savedGoblin) {
            title.textContent = "親ゴブリン";
            desc.innerHTML = "巨大なキングゴブリンが立ちはだかった！<br>...しかし、殺意はないようだ。<br><br>どうやら、あなたが４階で自分の子供を見逃したことに気づいているらしい。友好的に頭を下げている。";
            const btnNod = document.createElement('button');
            btnNod.className = 'btn'; btnNod.textContent = '頷く';
            btnNod.onclick = () => {
                game.karma += 20; UI.addLog("キングゴブリンは感謝を示すように低く唸った。");
                game.npcFlags.friendGoblin = true; game.npcFlags.event6FDone = true;
                game.closeEvent();
            };
            options.appendChild(btnNod);
            const btnFight = document.createElement('button');
            btnFight.className = 'btn'; btnFight.textContent = '戦う';
            btnFight.onclick = () => {
                game.npcFlags.event6FDone = true;
                game.closeEvent();
                game.startCustomBattle([{
                    id: 'monster-0', name: "キングゴブリン", hp: 1300, maxHp: 1300, currentHp: 1300, atk: 130, agi: 25, exp: 600, level: 6,
                    svg: `<img src="assets/event_6parent_friend.png" style="width:100%; height:100%; object-fit:contain; transform:scale(1.5);" />`
                }], { isKingGoblinLoot: true });
            };
            options.appendChild(btnFight);
        } else {
            title.textContent = "怒れる親ゴブリン";
            desc.innerHTML = "巨大なキングゴブリンが立ちはだかった！<br><br>子供を殺された怒り狂っているのか、こちらを睨みつけ、巨大な棍棒を振り上げている！！";
            const btnFight = document.createElement('button');
            btnFight.className = 'btn'; btnFight.textContent = '戦う';
            btnFight.onclick = () => {
                UI.addLog("怒れるキングゴブリンが襲いかかる！！");
                game.npcFlags.event6FDone = true;
                game.closeEvent();
                game.startCustomBattle([{
                    id: 'monster-0', name: "怒りのキングゴブリン", hp: 1300, maxHp: 1300, currentHp: 1300, atk: 130, agi: 25, exp: 600, level: 6,
                    svg: `<img src="assets/event_6parent_enemy.png" style="width:100%; height:100%; object-fit:contain; transform:scale(1.5);" />`
                }], { isKingGoblinLoot: true });
            };
            options.appendChild(btnFight);
        }
    },

    handleEvent8F: function (game, title, desc, options) {
        title.textContent = "闇の賢者";
        desc.innerHTML = "黒衣に身を包んだ、底知れぬ魔力を放つ老人が佇んでいる。<br><br>「ここまで辿り着くとはな。だが、お前たちの力では最深部の主、『渦』には勝てまい。」<br>「どうだ。使えぬ者一人の『命の灯火』を私に差し出さぬか？<br>それは、組織としての合理的な判断ではないかね……？」<br><br>※同意した場合、選択したメンバーは<strong>永久にロスト</strong>しますが、引き換えに最強クラスの装備セットを入手します。";
        const alive = game.party.filter(p => p.hp > 0);
        if (alive.length <= 1) {
            const btn = document.createElement('button');
            btn.className = 'btn'; btn.textContent = '立ち去る';
            btn.onclick = () => {
                UI.addLog("「……ほう。まさか自分の身を捧げるつもりか？……狂っているな。帰るが良い。」");
                game.npcFlags.event8FDone = true;
                game.closeEvent();
            };
            options.appendChild(btn);
        } else {
            alive.forEach(p => {
                const btn = document.createElement('button');
                btn.className = 'btn'; btn.textContent = `${p.name}を犠牲にする`;
                btn.onclick = () => {
                    if (!confirm(`本当に ${p.name} を生贄に捧げますか？\n(二度と復帰できなくなります)`)) return;
                    const sacrificeMsg = p.gender === 'male'
                        ? `${p.name}「待てよ、俺を置いていくのか？……嘘だろ、頼む、考え直してくれ……！」`
                        : `${p.name}「待って、私を捧げるなんて……信じられない。ねえ、冗談でしょ……？」`;
                    UI.addLog(sacrificeMsg);
                    p.hp = 0; p.baseVit = -999; game.karma -= 100;

                    UI.addLog(`闇の賢者の魔術により、${p.name}の命が吸い尽くされた……！`);
                    game.npcFlags.event8FDone = true;
                    game.inventory.push({ name: "深淵の杖", type: "weapon", atk: 15, req: { int: 25 }, desc: "INT+80 とてつもない魔力を秘めた杖", intBonus: 80 });
                    game.closeEvent();
                };
                options.appendChild(btn);
            });
            const btnFight = document.createElement('button');
            btnFight.className = 'btn'; btnFight.textContent = '戦う';
            btnFight.onclick = () => {
                game.karma -= 20; UI.addLog("「ほう、私に刃を向けるか。その愚かさ、嫌いではないぞ。」");
                game.npcFlags.event8FDone = true;
                game.closeEvent();
                game.startCustomBattle([{
                    id: 'monster-0', name: "闇の賢者", hp: 6000, maxHp: 6000, currentHp: 6000, atk: 220, agi: 70, exp: 5000, level: 8,
                    svg: `<img src="assets/event_8.png" style="width:100%; height:100%; object-fit:contain; transform:scale(1.3);" />`
                }], { isDarkSageLoot: true });
            };
            options.appendChild(btnFight);
            const btnReject = document.createElement('button');
            btnReject.className = 'btn'; btnReject.textContent = '拒絶する';
            btnReject.onclick = () => {
                game.karma += 50; UI.addLog("「……そうか。ならば己の無力を呪いながら死ぬが良い。」");
                UI.addLog("老人は薄れ、闇に溶け込むように消滅した。");
                game.npcFlags.event8FDone = true;
                game.closeEvent();
            };
            options.appendChild(btnReject);
        }
    },

    handleEvent9F: function (game, title, desc, options) {
        if (game.npcFlags.helpedAdventurer) {
            title.textContent = "騎士の亡霊";
            desc.innerHTML = "５階で助けたはずの男が、透き通った姿で微笑んでいる。<br>彼はこの先で息絶えたのだろう。<br><br>「......君たちなら、奴に届くはずだ......。」";
            const btn = document.createElement('button');
            btn.className = 'btn'; btn.textContent = '受け取る';
            btn.onclick = () => {
                game.karma += 20; UI.addLog("伝説の装備セットを受け取った！");
                game.npcFlags.event9FDone = true;
                game.inventory.push(
                    { name: "英雄の聖剣", type: "weapon", atk: 50, desc: "伝説の剣" },
                    { name: "英雄の鎧", type: "armor", def: 40, desc: "強固な守護をもたらす鎧" },
                    { name: "光の護符", type: "accessory", atk: 10, def: 10, desc: "全ステータスを底上げする護符" }
                );
                game.closeEvent();
            };
            options.appendChild(btn);
        } else {
            title.textContent = "冒険者の遺体";
            desc.innerHTML = "通路の先で、冒険者の無惨な死体を発見した。<br>５階で見捨てたあの男のようだ...。<br><br>遺体からは瘴気が溢れ出している。<br><br>そして、傍らには、禍々しいオーラを放つ装備品が転がっている。";
            const btn = document.createElement('button');
            btn.className = 'btn'; btn.textContent = '遺体をあさる';
            btn.onclick = () => {
                game.karma -= 20; UI.addLog("これは彼にはもう必要のない物だ。あなたは遺体から装備品を回収した。");
                game.npcFlags.event9FDone = true;
                game.inventory.push({ name: "呪われた 血塗られた魔剣", type: "weapon", atk: 60, desc: "強力だが精神を引き換えにする" });
                game.closeEvent();
            };
            options.appendChild(btn);
        }
    },

    triggerTreasureEvent: function (game, drop) {
        game.state = 'TREASURE';
        const screen = document.getElementById('event-screen');
        const title = document.getElementById('event-title');
        const img = document.getElementById('event-img');
        const desc = document.getElementById('event-desc');
        const opts = document.getElementById('event-options');
        if (title) title.textContent = "宝箱を発見！";
        if (img) { img.src = "assets/chest.png"; img.style.display = "block"; }
        if (desc) desc.textContent = "魔物が宝箱を残していったようだ。どうする？";
        if (opts) {
            opts.innerHTML = '';
            const btnOpen = document.createElement('button');
            btnOpen.className = 'btn'; btnOpen.textContent = "開ける (A)";
            btnOpen.onclick = () => this.openChest(game, drop);
            const btnLeave = document.createElement('button');
            btnLeave.className = 'btn'; btnLeave.textContent = "立ち去る (S)";
            btnLeave.onclick = () => { UI.addLog("宝箱を放置して立ち去った。"); game.closeEvent(); game.exitBattle(); game.saveGame(); };
            opts.appendChild(btnOpen); opts.appendChild(btnLeave);
        }
        if (screen) screen.style.display = 'flex';
    },

    openChest: function (game, drop) {
        const getEffective = (p, stat) => {
            let val = p[stat] || 0;
            ['weapon', 'armor', 'accessory'].forEach(s => {
                if (p.equipment && p.equipment[s] && p.equipment[s][stat] !== undefined) val += p.equipment[s][stat];
            });
            return val;
        };

        let expert = game.party[0];
        let maxVal = getEffective(expert, 'luk') + getEffective(expert, 'agi');
        game.party.forEach(p => {
            if (p.hp > 0) {
                const val = getEffective(p, 'luk') + getEffective(p, 'agi');
                if (val > maxVal) { expert = p; maxVal = val; }
            }
        });

        UI.addLog(`${expert.name}が解錠を試みる...`);
        const roll = Math.random() * 100;
        const currentLuk = getEffective(expert, 'luk');
        const currentAgi = getEffective(expert, 'agi');
        const successRate = 40 + (currentLuk + currentAgi) / 4;
        const trapRate = Math.max(10, 30 - (currentLuk + currentAgi) / 8);

        if (roll < successRate) {
            UI.addLog("解錠成功！"); UI.addLog(`「${drop.name}」を手に入れた！`);
            game.inventory.push(drop); game.closeEvent(); game.exitBattle(); game.saveGame();
        } else if (roll < successRate + trapRate) {
            UI.addLog("罠にかかった！！"); UI.addLog(`「${drop.name}」を手に入れた！`);
            game.inventory.push(drop);
            this.triggerTrap(game, ['alarm', 'teleport', 'drain', 'bomb', 'curse'][Math.floor(Math.random() * 5)]);
        } else {
            UI.addLog("解錠に失敗したが、罠は作動しなかった。");
            game.closeEvent(); game.exitBattle(); game.saveGame();
        }
    },

    triggerTrap: function (game, type) {
        game.closeEvent();
        switch (type) {
            case 'alarm': UI.addLog("警報だ！周囲の魔物が集まってきた！"); game.startBattle(true); return; // Don't exit battle
            case 'teleport': UI.addLog("テレポーターが作動した！"); game.teleport(); break;
            case 'drain': UI.addLog("ドレインの罠だ！"); game.party.forEach(p => { if (p.level > 1) p.level--; }); break;
            case 'bomb': UI.addLog("爆弾が爆発した！"); game.party.forEach(p => p.hp = Math.max(1, p.hp - Math.floor(p.maxHp * 0.3))); break;
            case 'curse': UI.addLog("呪いの霧だ！"); game.party.forEach(p => p.mp = Math.max(0, p.mp - Math.floor(p.maxMp * 0.5))); break;
        }
        game.exitBattle(); // Ensure BGM and UI reset
        game.saveGame();
    }
};
