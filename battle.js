/**
 * BATTLE LOGIC
 */
const Battle = {
    executeBattleTurn: async function (game) {
        if (!game.currentBattle) return;
        game.currentBattle.phase = 'EXECUTE';
        const monsters = game.currentBattle.monsters;

        // Add monster actions
        monsters.forEach(m => {
            if (m.currentHp > 0) {
                game.currentBattle.turnOrder.push({ actor: m, type: 'attack', isPlayer: false });
            }
        });

        // Hunter's Pre-emptive strike (Extra action at start)
        for (let p of game.party) {
            if (p.hp > 0 && p.battleBuffs?.preemptiveStrike) {
                const aliveMonsters = monsters.filter(m => m.currentHp > 0);
                if (aliveMonsters.length > 0) {
                    let targetIdx = Math.floor(Math.random() * aliveMonsters.length);
                    let monster = aliveMonsters[targetIdx];
                    audio.playSE('se_arrow');
                    const dmg = Math.max(1, game.getEffectiveStat(p, 'str') + Math.floor(game.getEffectiveStat(p, 'agi') / 2));
                    monster.currentHp -= dmg;
                    UI.addLog(`【先制】${p.name}が不意を突いて射撃！ ${monster.name}に${dmg}のダメージ！`);
                    UI.showHitEffect(monster.id, dmg);
                    p.battleBuffs.preemptiveStrike = false; // Consume it
                }
            }
        }

        // Sort by agility
        game.currentBattle.turnOrder.sort((a, b) => (b.actor.agi || 10) - (a.actor.agi || 10));

        for (let action of game.currentBattle.turnOrder) {
            const aliveMonsters = monsters.filter(m => m.currentHp > 0);
            if (aliveMonsters.length === 0) break;

            // Skip if dead
            if (action.isPlayer && action.actor.hp <= 0) continue;
            if (!action.isPlayer && action.actor.currentHp <= 0) continue;

            // Status: Paralysis recovery check (approx 20% chance)
            if (action.actor.statuses?.paralysis) {
                if (Math.random() < 0.20) {
                    action.actor.statuses.paralysis = false;
                    UI.addLog(`${action.actor.name}の身体のしびれが取れた！`);
                }
            }

            // Status: Paralysis skip turn check (75% chance to fail action)
            if (action.actor.statuses?.paralysis) {
                if (Math.random() < 0.75) {
                    UI.addLog(`${action.actor.name}は身体がしびれて動けない！`);
                    await new Promise(r => setTimeout(r, 600));
                    continue;
                }
            }


            if (action.isPlayer) {
                let targetIdx = Math.floor(Math.random() * aliveMonsters.length);
                let monster = aliveMonsters[targetIdx];
                if (action.type === 'attack') {
                    audio.playSE('se_attack');
                    let str = game.getEffectiveStat(action.actor, 'str');
                    let mult = 1.0;
                    
                    // Warrior's first turn buff
                    if (action.actor.battleBuffs?.atk150FirstTurn) {
                        mult *= 1.5;
                        action.actor.battleBuffs.atk150FirstTurn = false; // Only once per battle
                    }
                    // Samurai buff
                    if (action.actor.battleBuffs?.atk200Def200) {
                        mult *= 2.0;
                    }

                    let targetDef = game.getEffectiveStat(monster, 'vit') / 2;
                    // Martial Artist's ignore defense
                    if (action.actor.battleBuffs?.ignoreDef) {
                        targetDef = 0;
                    }

                    const dmg = Math.max(1, Math.floor((str * mult + Math.random() * 5) - targetDef));
                    monster.currentHp -= dmg;
                    UI.addLog(`${action.actor.name}の攻撃！ ${monster.name}に${dmg}のダメージ！`);
                    UI.showHitEffect(monster.id, dmg);
                } else if (action.type === 'skill') {
                    this.handlePlayerSkill(game, action.actor, monster, aliveMonsters);
                } else if (action.type === 'run') {
                    if (Math.random() > 0.4) {
                        UI.addLog("逃げ出した！");
                        audio.playBGM('bgm_explore');
                        game.endBattle(false);
                        return;
                    } else UI.addLog("逃げられなかった！");
                }

                monsters.forEach(m => {
                    if (m.currentHp <= 0 && !m.deadLogged) {
                        m.deadLogged = true;
                        UI.addLog(`${m.name}を倒した！`);
                    }
                });
            } else {
                if (action.actor.currentHp <= 0) continue;
                const aliveParty = game.party.filter(p => p.hp > 0);
                if (aliveParty.length === 0) break;
                this.handleEnemyAction(game, action.actor, aliveParty);
            }

            UI.updateUI(game);
            if (monsters.filter(m => m.currentHp > 0).length === 0) break;
            await new Promise(r => setTimeout(r, 600));
        }

        const remainMonsters = monsters.filter(m => m.currentHp > 0);
        if (remainMonsters.length === 0) {
            audio.playSE('se_dead');
            UI.addLog(`魔物たちを討伐した！`);
            game.endBattle(true);
        } else if (game.party.every(p => p.hp <= 0)) {
            game.handleGameOver();
        } else {
            game.currentBattle.turnOrder = [];
            game.currentBattle.phase = 'INPUT';
            game.turnIndex = 0;
            while (game.turnIndex < game.party.length && game.party[game.turnIndex].hp <= 0) game.turnIndex++;
            UI.updateUI(game);
        }
    },

    handlePlayerSkill: function (game, actor, monster, aliveMonsters) {
        audio.playSE('se_magic');
        const job = actor.job;
        if (job === '戦士') {
            if (actor.hp > 5) {
                actor.hp -= 5;
                audio.playSE('se_heavy_attack');
                UI.flashScreen('rgba(255,0,0,0.5)');
                const mult = (actor.skillMultiplier || 1.0);
                const dmg = Math.floor(game.getEffectiveStat(actor, 'str') * 1.5 * mult + Math.random() * 5);
                monster.currentHp -= dmg;
                UI.addLog(`${actor.name}の全力斬り！(HP-5) ${monster.name}に${dmg}の大ダメージ！`);
                UI.showHitEffect(monster.id, dmg);
            } else UI.addLog(`${actor.name}は体力が足りない！`);
        } else if (job === '武闘家') {
            if (actor.hp > 4) {
                actor.hp -= 4;
                audio.playSE('se_attack');
                UI.flashScreen('rgba(255,255,255,0.4)');
                const mult = (actor.skillMultiplier || 1.0);
                const dmg = Math.floor((game.getEffectiveStat(actor, 'str') * 1.5 + game.getEffectiveStat(actor, 'agi') * 0.5) * mult);
                monster.currentHp -= dmg;
                UI.addLog(`${actor.name}の気功波！(HP-4) ${monster.name}に防御無視の${dmg}ダメージ！`);
                UI.showHitEffect(monster.id, dmg);
            } else UI.addLog(`${actor.name}は体力が足りない！`);
        } else if (job === '盗賊') {
            if (actor.mp >= 3) {
                actor.mp -= 3;
                audio.playSE('se_attack');
                UI.flashScreen('rgba(150,0,255,0.4)');
                const mult = (actor.skillMultiplier || 1.0);
                const dmg = Math.floor((game.getEffectiveStat(actor, 'agi') * 1.8 + Math.random() * 5) * mult);
                monster.currentHp -= dmg;
                UI.addLog(`${actor.name}の不意打ち！(MP-3) ${monster.name}に${dmg}のダメージ！`);
                UI.showHitEffect(monster.id, dmg);
            } else UI.addLog(`${actor.name}はMPが足りない！`);
        } else if (job === '僧侶') {
            if (actor.mp >= 4) {
                actor.mp -= 4;
                audio.playSE('se_heal');
                UI.flashScreen('rgba(200,255,200,0.5)');
                let target = actor;
                let minHpPct = target.hp / game.getEffectiveMaxHp(target);
                game.party.forEach(p => { if (p.hp > 0 && (p.hp / game.getEffectiveMaxHp(p)) < minHpPct) { target = p; minHpPct = p.hp / game.getEffectiveMaxHp(p); } });
                const mult = (actor.skillMultiplier || 1.0);
                const heal = Math.max(15, Math.floor((game.getEffectiveStat(actor, 'int') + 10) * mult));
                target.hp = Math.min(game.getEffectiveMaxHp(target), target.hp + heal);
                UI.addLog(`${actor.name}のヒール！(MP-4) ${target.name}のHPが${heal}回復！`);
                UI.showHealEffect(game.party.indexOf(target), heal);
            } else UI.addLog(`${actor.name}はMPが足りない！`);
        } else if (job === '魔術師') {
            if (actor.mp >= 5) {
                actor.mp -= 5;
                audio.playSE('se_fire');
                UI.flashScreen('rgba(255,100,0,0.5)');
                UI.addLog(`${actor.name}のファイヤーボール！(MP-5) 全体に炎が襲う！`);
                const mult = (actor.skillMultiplier || 1.0);
                aliveMonsters.forEach(m => {
                    const dmg = Math.max(10, Math.floor((game.getEffectiveStat(actor, 'int') * 1.5 + 5) * mult));
                    m.currentHp -= dmg;
                    UI.addLog(`${m.name}に${dmg}のダメージ！`);
                    UI.showHitEffect(m.id, dmg);
                });
            } else UI.addLog(`${actor.name}はMPが足りない！`);
        } else if (job === '侍') {
            if (actor.mp >= 4) {
                actor.mp -= 4;
                audio.playSE('se_heavy_attack');
                UI.flashScreen('rgba(255,255,255,0.5)');
                const mult = (actor.skillMultiplier || 1.0);
                const effStr = game.getEffectiveStat(actor, 'str');
                const dmg1 = Math.floor((effStr * 0.8 + Math.random() * 3) * mult);
                const dmg2 = Math.floor((effStr * 0.8 + Math.random() * 3) * mult);
                monster.currentHp -= (dmg1 + dmg2);
                UI.addLog(`${actor.name}の燕返し！(MP-4) ${monster.name}に${dmg1}と${dmg2}の連続ダメージ！`);
                UI.showHitEffect(monster.id, dmg1 + dmg2);
            } else UI.addLog(`${actor.name}はMPが足りない！`);
        } else if (job === '狩人') {
            if (actor.mp >= 3) {
                actor.mp -= 3;
                audio.playSE('se_arrow');
                UI.flashScreen('rgba(255,255,255,0.4)');
                const mult = (actor.skillMultiplier || 1.0);
                const dmg = Math.floor((game.getEffectiveStat(actor, 'str') + game.getEffectiveStat(actor, 'agi') * 1.2) * mult);
                monster.currentHp -= dmg;
                UI.addLog(`${actor.name}の狙い撃ち！(MP-3) 急所を突いて${monster.name}に${dmg}のダメージ！`);
                UI.showHitEffect(monster.id, dmg);
            } else UI.addLog(`${actor.name}はMPが足りない！`);
        } else if (job === 'モンク') {
            if (actor.mp >= 4) {
                actor.mp -= 4;
                audio.playSE('se_heal');
                UI.flashScreen('rgba(200,255,200,0.4)');
                let target = actor;
                let minHpPct = target.hp / game.getEffectiveMaxHp(target);
                game.party.forEach(p => { if (p.hp > 0 && (p.hp / game.getEffectiveMaxHp(p)) < minHpPct) { target = p; minHpPct = p.hp / game.getEffectiveMaxHp(p); } });
                const mult = (actor.skillMultiplier || 1.0);
                const heal = Math.max(8, Math.floor((game.getEffectiveStat(actor, 'int') * 0.5 + 5) * mult));
                target.hp = Math.min(game.getEffectiveMaxHp(target), target.hp + heal);
                UI.addLog(`${actor.name}の精神統一！(MP-4) ${target.name}のHPが${heal}回復！`);
                UI.showHealEffect(game.party.indexOf(target), heal);
                const dmg = Math.max(1, game.getEffectiveStat(actor, 'str') + Math.floor(Math.random() * 3));
                monster.currentHp -= dmg;
                UI.addLog(`${actor.name}の追撃！ ${monster.name}に${dmg}のダメージ！`);
                UI.showHitEffect(monster.id, dmg);
            } else UI.addLog(`${actor.name}はMPが足りない！`);
        } else if (job === 'ビショップ') {
            if (actor.mp >= 8) {
                actor.mp -= 8;
                audio.playSE('se_magic');
                UI.flashScreen('rgba(255,255,255,0.7)');
                let target = actor;
                let minHpPct = target.hp / game.getEffectiveMaxHp(target);
                game.party.forEach(p => { if (p.hp > 0 && (p.hp / game.getEffectiveMaxHp(p)) < minHpPct) { target = p; minHpPct = p.hp / game.getEffectiveMaxHp(p); } });
                const mult = (actor.skillMultiplier || 1.0);
                const effInt = game.getEffectiveStat(actor, 'int');
                const heal = Math.max(15, Math.floor((effInt + 10) * mult));
                target.hp = Math.min(game.getEffectiveMaxHp(target), target.hp + heal);
                UI.addLog(`${actor.name}のホーリーライト！(MP-8) ${target.name}のHPが${heal}回復！`);
                UI.showHealEffect(game.party.indexOf(target), heal);
                aliveMonsters.forEach(m => {
                    const dmg = Math.max(12, Math.floor((effInt * 1.8 + 10) * mult));
                    m.currentHp -= dmg;
                    UI.addLog(`${m.name}に${dmg}のダメージ！`);
                    UI.showHitEffect(m.id, dmg);
                });
            } else UI.addLog(`${actor.name}はMPが足りない！`);
        }
    },

    handleEnemyAction: function (game, actor, aliveParty) {
        const skill = game.currentBattle.isBoss ? ENEMY_SKILLS['boss'] : ENEMY_SKILLS[actor.imgIndex];
        if (skill && Math.random() < skill.chance) {
            if (skill.se) audio.playSE(skill.se);
            if (skill.flashColor) UI.flashScreen(skill.flashColor);
            UI.addLog(`${actor.name}の${skill.name}！`);
            if (skill.desc) UI.addLog(skill.desc);
            const target = aliveParty[Math.floor(Math.random() * aliveParty.length)];
            const pIdx = game.party.indexOf(target);
            if (skill.type === 'attack') {
                let targetDef = game.getEffectiveStat(target, 'vit') / 2;
                if (target.battleBuffs?.atk200Def200) targetDef *= 2.0; // Samurai defense buff
                const dmg = Math.max(1, Math.floor((actor.atk * skill.mult) - targetDef) + Math.floor(Math.random() * 3));
                target.hp = Math.max(0, target.hp - dmg);
                UI.addLog(`${target.name}は${dmg}のダメージ！`);
                UI.showPartyHitEffect(pIdx, dmg);
                audio.playSE('se_damage');
            } else if (skill.type === 'pierce') {
                const dmg = Math.max(1, Math.floor(actor.atk * skill.mult) + Math.floor(Math.random() * 3));
                target.hp = Math.max(0, target.hp - dmg);
                UI.addLog(`${target.name}は防御不能の${dmg}ダメージ！`);
                UI.showPartyHitEffect(pIdx, dmg);
                audio.playSE('se_damage');
            } else if (skill.type === 'aoe') {
                audio.playSE('se_magic');
                game.party.forEach((p, idx) => {
                    if (p.hp > 0) {
                        const dmg = Math.max(1, Math.floor((actor.atk * skill.mult) - game.getEffectiveStat(p, 'vit') / 2) + Math.floor(Math.random() * 3));
                        p.hp = Math.max(0, p.hp - dmg);
                        UI.addLog(`${p.name}に${dmg}のダメージ！`);
                        UI.showPartyHitEffect(idx, dmg);
                        // Status chance for AOE
                        if (p.hp > 0 && skill.status && Math.random() < skill.statusChance) {
                            const resists = this.getPartyMemberResists(p);
                            if (resists.has(skill.status)) {
                                UI.addLog(`${p.name}は装備の効果で${skill.status === 'poison' ? '毒' : (skill.status === 'paralysis' ? '麻痺' : '混乱')}を防いだ！`);
                            } else {
                                if (!p.statuses) p.statuses = { poison: false, paralysis: false, confusion: false };
                                p.statuses[skill.status] = true;
                                UI.addLog(`${p.name}は${skill.status === 'poison' ? '毒' : (skill.status === 'paralysis' ? '麻痺' : '混乱')}に陥った！`);
                            }
                        }
                    }
                });
            } else if (skill.type === 'drain') {
                const dmg = Math.max(1, Math.floor((actor.atk * skill.mult) - game.getEffectiveStat(target, 'vit') / 2) + Math.floor(Math.random() * 3));
                target.hp = Math.max(0, target.hp - dmg);
                const heal = Math.floor(dmg * 0.5);
                actor.currentHp = Math.min(actor.hp, actor.currentHp + heal);
                UI.addLog(`${target.name}に${dmg}のダメージ！ ${actor.name}は${heal}回復した！`);
                UI.showPartyHitEffect(pIdx, dmg);
                audio.playSE('se_damage');
            } else if (skill.type === 'breath') {
                audio.playSE('se_fire');
                game.party.forEach((p, idx) => {
                    if (p.hp > 0) {
                        const dmg = Math.max(1, Math.floor((p.hp * skill.mult) - game.getEffectiveStat(p, 'vit') / 4) + Math.floor(Math.random() * 5));
                        p.hp = Math.max(0, p.hp - dmg);
                        UI.addLog(`${p.name}のブレス攻撃！${dmg}のダメージ！`);
                        UI.showPartyHitEffect(idx, dmg);
                        if (p.hp > 0 && skill.status && Math.random() < skill.statusChance) {
                            const resists = this.getPartyMemberResists(p);
                            if (resists.has(skill.status)) {
                                UI.addLog(`${p.name}は装備の効果で${skill.status === 'poison' ? '毒' : (skill.status === 'paralysis' ? '麻痺' : '混乱')}を防いだ！`);
                            } else {
                                if (!p.statuses) p.statuses = { poison: false, paralysis: false, confusion: false };
                                p.statuses[skill.status] = true;
                                UI.addLog(`${p.name}は${skill.status === 'poison' ? '毒' : (skill.status === 'paralysis' ? '麻痺' : '混乱')}に侵された！`);
                            }
                        }
                    }
                });
            } else if (skill.type === 'death') {
                audio.playSE('se_heavy_attack');
                if (Math.random() < 0.3) {
                    target.hp = 0;
                    UI.addLog(`致命的な一撃！ ${target.name}は息絶えた！`);
                } else {
                    const dmg = Math.floor(actor.atk * 1.5);
                    target.hp = Math.max(0, target.hp - dmg);
                    UI.addLog(`痛恨の一撃！ ${target.name}に${dmg}のダメージ！`);
                }
                UI.showPartyHitEffect(pIdx, 999);
            } else if (skill.type === 'drain_level') {
                audio.playSE('se_drain');
                const dmg = Math.floor(actor.atk);
                target.hp = Math.max(0, target.hp - dmg);
                UI.addLog(`${target.name}に${dmg}のダメージ！`);
                UI.showPartyHitEffect(pIdx, dmg);
                if (target.hp > 0 && Math.random() < 0.4) {
                    target.level = Math.max(1, target.level - 1);
                    target.hp = Math.floor(target.hp / 2);
                    UI.addLog(`恐るべきエナジードレイン！ ${target.name}のレベルが吸い取られた！`);
                }
            } else if (skill.type === 'summon') {
                this.handleEnemySummon(game, actor);
            }

            // Apply status to single target skills (attack, pierce, drain, death, drain_level)
            if (target && target.hp > 0 && skill.status && skill.type !== 'aoe' && skill.type !== 'breath') {
                if (Math.random() < skill.statusChance) {
                    const resists = this.getPartyMemberResists(target);
                    if (resists.has(skill.status)) {
                        UI.addLog(`${target.name}は装備の効果で${skill.status === 'poison' ? '毒' : (skill.status === 'paralysis' ? '麻痺' : '混乱')}を防いだ！`);
                    } else {
                        if (!target.statuses) target.statuses = { poison: false, paralysis: false, confusion: false };
                        target.statuses[skill.status] = true;
                        UI.addLog(`${target.name}は${skill.status === 'poison' ? '毒' : (skill.status === 'paralysis' ? '麻痺' : '混乱')}に陥った！`);
                    }
                }
            }
        } else {
            const target = aliveParty[Math.floor(Math.random() * aliveParty.length)];
            const pIdx = game.party.indexOf(target);
            const dmg = Math.max(1, actor.atk - Math.floor(game.getEffectiveStat(target, 'vit') / 2) + Math.floor(Math.random() * 3));
            target.hp = Math.max(0, target.hp - dmg);
            UI.addLog(`${actor.name}の攻撃！ ${target.name}は${dmg}のダメージ！`);
            UI.showPartyHitEffect(pIdx, dmg);
            audio.playSE('se_damage');
        }
        game.party.forEach(p => { if (p.hp <= 0 && !p.deadLogged) { p.deadLogged = true; UI.addLog(`${p.name}は倒れた...`); } });
    },

    getPartyMemberResists: function (p) {
        const resists = new Set();
        ['armor', 'accessory'].forEach(slot => {
            const item = p.equipment[slot];
            if (item && item.resistStatuses) {
                item.resistStatuses.forEach(s => resists.add(s));
            }
        });
        return resists;
    },

    handleEnemySummon: function (game, actor) {
        if (game.currentBattle.monsters.length < 5) {
            const newIdx = game.currentBattle.monsters.length;
            const mData = { ...actor, id: `monster-${newIdx}`, currentHp: actor.hp, deadLogged: false };
            const baseName = mData.originalName || mData.name.split(' ')[0];
            const sameType = game.currentBattle.monsters.filter(m => (m.originalName || m.name).startsWith(baseName));
            mData.name = baseName + " " + String.fromCharCode(65 + sameType.length);
            game.currentBattle.monsters.push(mData);
            const mo = document.getElementById('monster-overlay');
            const container = document.createElement('div');
            container.className = 'monster-img-container';
            container.id = `monster-img-${newIdx}`;
            container.innerHTML = mData.svg;
            mo.appendChild(container);
            UI.addLog(`新たな${baseName}が現れた！`);
        } else UI.addLog("しかし仲間を呼ぶスペースがない！");
    },

    executePlayerAttack: function (game, actor, monster) {
        audio.playSE('se_attack');
        const dmg = Math.max(1, game.getEffectiveStat(actor, 'str') + Math.floor(Math.random() * 5) - 2);
        monster.currentHp -= dmg;
        UI.addLog(`${actor.name}の攻撃！ ${monster.name}に${dmg}のダメージ！`);
        UI.showHitEffect(monster.id, dmg);

        // Equipment-based status infliction
        if (monster.currentHp > 0) {
            const inflictSet = new Set();
            ['weapon', 'accessory'].forEach(slot => {
                const item = actor.equipment[slot];
                if (item && item.inflictStatuses) {
                    item.inflictStatuses.forEach(s => inflictSet.add(s));
                }
            });

            inflictSet.forEach(status => {
                if (Math.random() < 0.3) {
                    monster.statuses[status] = true;
                    const labels = { poison: '毒', paralysis: '麻痺', confusion: '混乱' };
                    UI.addLog(`${monster.name}を${labels[status]}状態にした！`);
                }
            });
        }
    }
};
