/**
 * UI & RENDERING LOGIC
 */
const UI = {
    logs: [],

    render: function (game, assets) {
        this.drawDungeon(game, assets);
        this.drawMinimap(game);
        if (game.state !== 'GAMEOVER') this.updateUI(game);
    },

    drawDungeon: function (game, assets) {
        const ctx = game.ctx;
        const w = game.canvas.width;
        const h = game.canvas.height;
        const map = LEVELS[game.currentFloor];
        const curTile = map[game.playerPos.y][game.playerPos.x];

        if (curTile === 6) { // Dark Zone
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, w, h);
            return;
        }

        // Ceiling
        if (assets.ceiling.loaded) {
            ctx.drawImage(assets.ceiling.img, 0, 0, w, h / 2);
        } else {
            ctx.fillStyle = '#111';
            ctx.fillRect(0, 0, w, h / 2);
        }

        // Floor with gradient
        if (assets.floor.loaded) {
            ctx.drawImage(assets.floor.img, 0, h / 2, w, h / 2);
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
            grad.addColorStop(1, '#151520');
            ctx.fillStyle = grad;
            ctx.fillRect(0, h / 2, w, h / 2);
        }

        for (let d = VIEW_DIST; d >= 0; d--) {
            this.drawWallsAtDistance(game, assets, d);
        }
    },

    drawWallsAtDistance: function (game, assets, dist) {
        const { x, y, dir } = game.playerPos;
        const dx = [0, 1, 0, -1][dir], dy = [-1, 0, 1, 0][dir];
        const px = [1, 0, -1, 0][dir], py = [0, 1, 0, -1][dir];
        const map = LEVELS[game.currentFloor];
        const tx = x + dx * dist, ty = y + dy * dist;

        if (ty < 0 || ty >= map.length || tx < 0 || tx >= map[ty].length) return;

        const ctx = game.ctx, w = game.canvas.width, h = game.canvas.height;

        const getProj = (d, offsetX) => {
            const scale = 1 / (d + 0.5);
            const hz = h * 0.5 * scale, wz = w * 0.7 * scale;
            return { x: w / 2 + (offsetX * wz), y: h / 2 - (h * 0.05), w: wz, h: hz };
        };

        const fillWall = (d, offset, side) => {
            const p1 = getProj(d, offset), p2 = getProj(d + 1, offset);
            let drawX, drawY, drawW, drawH;

            if (side === 'front') {
                drawX = p1.x - p1.w / 2; drawY = p1.y - p1.h; drawW = p1.w; drawH = p1.h * 2;
                if (assets.wall.loaded) ctx.drawImage(assets.wall.img, drawX, drawY, drawW, drawH);
                else { ctx.beginPath(); ctx.rect(drawX, drawY, drawW, drawH); ctx.closePath(); }
            } else {
                const img = assets.wall.loaded ? assets.wall.img : null;
                const srcW = img ? img.width : 1, srcH = img ? img.height : 1;
                let startX, endX, y1top, y1bot, y2top, y2bot;
                if (side === 'left') { startX = p1.x - p1.w / 2; endX = p2.x - p2.w / 2; }
                else { startX = p1.x + p1.w / 2; endX = p2.x + p2.w / 2; }
                y1top = p1.y - p1.h; y1bot = p1.y + p1.h; y2top = p2.y - p2.h; y2bot = p2.y + p2.h;

                if (img) {
                    const steps = Math.ceil(Math.abs(endX - startX));
                    if (steps > 0) {
                        const stepCol = srcW / steps, wStep = (endX - startX) / steps;
                        const drawWidth = wStep > 0 ? wStep + 1 : wStep - 1;
                        for (let i = 0; i < steps; i++) {
                            const t = i / steps;
                            const cx = startX + wStep * i;
                            const cyTop = y1top + (y2top - y1top) * t, cyBot = y1bot + (y2bot - y1bot) * t;
                            ctx.drawImage(img, Math.floor(i * stepCol), 0, Math.max(1, Math.ceil(stepCol)), srcH, cx, cyTop, drawWidth, cyBot - cyTop);
                        }
                    }
                } else {
                    ctx.beginPath(); ctx.moveTo(startX, y1top); ctx.lineTo(endX, y2top); ctx.lineTo(endX, y2bot); ctx.lineTo(startX, y1bot); ctx.closePath();
                }
            }

            if (!assets.wall.loaded) {
                const br = Math.max(0, 100 - (d * 20));
                ctx.fillStyle = `rgb(0, ${br}, 0, 0.9)`; ctx.fill();
                ctx.strokeStyle = `rgb(0, ${br * 1.5}, 65)`; ctx.lineWidth = 2; ctx.stroke();
            } else {
                const darkness = Math.max(0, Math.min(0.8, d * 0.15));
                if (darkness > 0) {
                    ctx.fillStyle = `rgba(0, 0, 0, ${darkness})`;
                    if (side === 'front') ctx.fillRect(drawX, drawY, drawW, drawH);
                    else {
                        ctx.beginPath();
                        let sx = side === 'left' ? p1.x - p1.w / 2 : p1.x + p1.w / 2;
                        let ex = side === 'left' ? p2.x - p2.w / 2 : p2.x + p2.w / 2;
                        ctx.moveTo(sx, p1.y - p1.h); ctx.lineTo(ex, p2.y - p2.h); ctx.lineTo(ex, p2.y + p2.h); ctx.lineTo(sx, p1.y + p1.h);
                        ctx.closePath(); ctx.fill();
                    }
                }
            }
        };

        for (let offsetX = -3; offsetX <= 3; offsetX++) {
            const ox = tx + offsetX * px, oy = ty + offsetX * py;
            const isSolid = oy >= 0 && oy < map.length && ox >= 0 && ox < map[oy].length && (map[oy][ox] === 1 || map[oy][ox] === 4);
            if (isSolid) {
                if (offsetX < 0) {
                    const rx = tx + (offsetX + 1) * px, ry = ty + (offsetX + 1) * py;
                    if (!(ry >= 0 && ry < map.length && rx >= 0 && rx < map[ry].length && (map[ry][rx] === 1 || map[ry][rx] === 4))) fillWall(dist, offsetX, 'right');
                }
                if (offsetX > 0) {
                    const lx = tx + (offsetX - 1) * px, ly = ty + (offsetX - 1) * py;
                    if (!(ly >= 0 && ly < map.length && lx >= 0 && lx < map[ly].length && (map[ly][lx] === 1 || map[ly][lx] === 4))) fillWall(dist, offsetX, 'left');
                }
            }
        }

        for (let offsetX = -3; offsetX <= 3; offsetX++) {
            const ox = tx + offsetX * px, oy = ty + offsetX * py;
            const isSolid = oy >= 0 && oy < map.length && ox >= 0 && ox < map[oy].length && (map[oy][ox] === 1 || map[oy][ox] === 4);
            if (isSolid) {
                const isHidden = (map[oy][ox] === 4);
                if (isHidden) { ctx.globalAlpha = 0.6; ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'; }
                fillWall(dist, offsetX, 'front');
                if (isHidden) ctx.globalAlpha = 1.0;
            } else {
                const tile = (oy >= 0 && oy < map.length && ox >= 0 && ox < map[oy].length) ? map[oy][ox] : 0;
                const darkness = Math.max(0, Math.min(0.8, dist * 0.15));
                if (tile === 8) {
                    const p = getProj(dist + 0.5, offsetX);
                    const bossFloor = game.currentFloor + 1;
                    const bossKey = `boss${bossFloor}`;
                    if (assets[bossKey] && assets[bossKey].loaded) {
                        ctx.save();
                        // Apply dark filter for silhouette
                        ctx.filter = 'brightness(0) contrast(1)';
                        ctx.globalAlpha = 0.8;
                        ctx.drawImage(assets[bossKey].img, p.x - p.w / 2, p.y - p.h, p.w, p.h * 2);
                        ctx.restore();
                        if (darkness > 0) { ctx.fillStyle = `rgba(0, 0, 0, ${darkness})`; ctx.fillRect(p.x - p.w / 2, p.y - p.h, p.w, p.h * 2); }
                    } else {
                        // Fallback if boss image not loaded
                        if (assets.stair_down.loaded) {
                            ctx.drawImage(assets.stair_down.img, p.x - p.w / 2, p.y - p.h, p.w, p.h * 2);
                            if (darkness > 0) { ctx.fillStyle = `rgba(0, 0, 0, ${darkness})`; ctx.fillRect(p.x - p.w / 2, p.y - p.h, p.w, p.h * 2); }
                        }
                    }
                } else if (tile === 3) {
                    const p = getProj(dist + 0.5, offsetX);
                    if (assets.stair_down.loaded) {
                        ctx.drawImage(assets.stair_down.img, p.x - p.w / 2, p.y - p.h, p.w, p.h * 2);
                        if (darkness > 0) { ctx.fillStyle = `rgba(0, 0, 0, ${darkness})`; ctx.fillRect(p.x - p.w / 2, p.y - p.h, p.w, p.h * 2); }
                    }
                } else if (tile === 2) {
                    const p = getProj(dist + 0.5, offsetX);
                    if (assets.stair_up.loaded) {
                        ctx.drawImage(assets.stair_up.img, p.x - p.w / 2, p.y - p.h, p.w, p.h * 2);
                        if (darkness > 0) { ctx.fillStyle = `rgba(0, 0, 0, ${darkness})`; ctx.fillRect(p.x - p.w / 2, p.y - p.h, p.w, p.h * 2); }
                    }
                }
            }
        }
    },

    drawMinimap: function (game) {
        const ctx = game.mCtx, size = 160 / MAP_SIZE;
        ctx.fillStyle = '#000'; ctx.fillRect(0, 0, 160, 160);
        const map = LEVELS[game.currentFloor], visited = game.visited[game.currentFloor];
        
        // Thief skill check for legend/enhanced view
        const isThiefSkillActive = game.thiefSkillActive[game.currentFloor];

        for (let y = 0; y < map.length; y++) {
            for (let x = 0; x < map[y].length; x++) {
                if (!visited[y] || !visited[y][x]) continue;
                const mc = map[y][x];
                if (mc === 1) ctx.fillStyle = '#666'; // Wall
                else if (mc === 4) ctx.fillStyle = isThiefSkillActive ? '#ffaa00' : '#666'; // Hidden Door
                else if (mc === 5) ctx.fillStyle = isThiefSkillActive ? '#aa00ff' : '#113311'; // Teleporter
                else if (mc === 7) ctx.fillStyle = isThiefSkillActive ? '#00ff00' : '#113311'; // Rotating Floor
                else if (mc === 6) ctx.fillStyle = isThiefSkillActive ? '#222' : '#113311';    // Dark Zone
                else if (mc === 3) ctx.fillStyle = '#ff00ff'; // Downstairs
                else if (mc === 2) ctx.fillStyle = '#00ffff'; // Upstairs
                else if (mc === 8) ctx.fillStyle = '#ff0000'; // Boss
                else if (mc === 9) ctx.fillStyle = '#ffff00'; // Event
                else ctx.fillStyle = '#113311'; // Path
                ctx.fillRect(x * size, y * size, size - 1, size - 1);
            }
        }
        ctx.fillStyle = '#fff';
        const px = game.playerPos.x * size + size / 2, py = game.playerPos.y * size + size / 2;
        ctx.beginPath(); ctx.arc(px, py, size / 3, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#fff'; ctx.beginPath(); ctx.moveTo(px, py);
        const dx = [0, 1, 0, -1][game.playerPos.dir] * size, dy = [-1, 0, 1, 0][game.playerPos.dir] * size;
        ctx.lineTo(px + dx, py + dy); ctx.stroke();

        // Draw Legend Overlay
        if (isThiefSkillActive) {
            this.drawMapLegend(ctx);
        }
    },

    drawMapLegend: function (ctx) {
        const legendItems = [
            { color: '#ffaa00', label: '隠し扉' },
            { color: '#aa00ff', label: 'ワープ' },
            { color: '#00ff00', label: '回転床' },
            { color: '#222', label: '暗闇', border: '#444' }
        ];
        
        ctx.save();
        ctx.font = '9px Arial';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        
        const padding = 4;
        const boxH = 12;
        const boxW = 45;
        const startX = 2;
        let startY = 160 - (legendItems.length * (boxH + 1)) - 2;

        legendItems.forEach((item, i) => {
            const y = startY + i * (boxH + 1);
            // Semi-transparent background for legend
            ctx.fillStyle = 'rgba(0,0,0,0.7)';
            ctx.fillRect(startX, y, boxW, boxH);
            
            // Color box
            ctx.fillStyle = item.color;
            ctx.fillRect(startX + 1, y + 1, boxH - 2, boxH - 2);
            if (item.border) {
                ctx.strokeStyle = item.border;
                ctx.strokeRect(startX + 1, y + 1, boxH - 2, boxH - 2);
            }
            
            // Text
            ctx.fillStyle = '#fff';
            ctx.fillText(item.label, startX + boxH, y + boxH / 2);
        });
        ctx.restore();
    },

    updateUI: function (game) {
        const list = document.getElementById('party-list');
        if (!list) return;
        list.innerHTML = '';
        game.party.forEach((p, i) => {
            const div = document.createElement('div');
            div.id = `party-member-${i}`;
            const isGhost = p.isGhost === true;
            div.className = `party-member ${game.state === 'BATTLE' && game.turnIndex === i ? 'active' : ''} ${isGhost ? 'ghost-member' : ''}`;
            div.style.position = 'relative';
            div.style.overflow = 'hidden';

            const portraitUrl = isGhost ? 'assets/face_亡霊.jpeg' : p.portrait;
            const hpW = (p.hp / p.maxHp) * 100, mpW = p.maxMp > 0 ? (p.mp / p.maxMp) * 100 : 0;
            div.innerHTML = `
                <div class="card-portrait-bg ${isGhost ? 'ghost-portrait' : ''}" style="background-image: url('${portraitUrl}')"></div>
                <div class="card-content">
                    <div style="display:flex; justify-content:space-between; margin-bottom: 2px;">
                        <strong>${p.name}</strong> 
                        <span style="font-size:10px; color:#aaa;">Lv${p.level} ${p.job}</span>
                    </div>
                    <div class="status-indicators" style="font-size:10px; margin-bottom: 2px;">
                        ${p.statuses?.poison ? '<span style="color:#0f0; margin-right:4px;">[毒]</span>' : ''}
                        ${p.statuses?.paralysis ? '<span style="color:#ff0; margin-right:4px;">[麻]</span>' : ''}
                        ${p.statuses?.confusion ? '<span style="color:#f0f; margin-right:4px;">[混]</span>' : ''}
                        ${p.battleBuffs?.atk150FirstTurn ? '<span style="color:#f55; margin-right:4px;">[攻]</span>' : ''}
                        ${p.battleBuffs?.preemptiveStrike ? '<span style="color:#55f; margin-right:4px;">[先]</span>' : ''}
                        ${p.battleBuffs?.atk200Def200 ? '<span style="color:#ffcc00; margin-right:4px;">[不]</span>' : ''}
                        ${p.battleBuffs?.ignoreDef ? '<span style="color:#00ffff; margin-right:4px;">[点]</span>' : ''}
                    </div>
                    ${isGhost ? `
                    <div class="ghost-status" style="text-align:center; padding: 5px 0;">[ 亡霊 ]</div>
                    ` : `
                    <div style="display:flex; gap:5px;">
                        <div style="flex:1;">
                            <div class="stat-bar">
                                <div class="stat-fill" style="width:${(p.hp / game.getEffectiveMaxHp(p)) * 100}%; background:${p.hp <= 0 ? '#444' : '#ff4444'};"></div>
                                <div style="position:absolute; top:0; left:0; width:100%; text-align:center; font-size:9px; line-height:12px; text-shadow:1px 1px 0 #000; z-index:2;">HP ${p.hp}</div>
                            </div>
                        </div>
                        <div style="flex:1;">
                            <div class="stat-bar">
                                <div class="stat-fill" style="width:${game.getEffectiveMaxMp(p) > 0 ? (p.mp / game.getEffectiveMaxMp(p)) * 100 : 0}%; background:#4444ff;"></div>
                                <div style="position:absolute; top:0; left:0; width:100%; text-align:center; font-size:9px; line-height:12px; text-shadow:1px 1px 0 #000; z-index:2;">MP ${p.mp}</div>
                            </div>
                        </div>
                    </div>
                    `}
                </div>`;
            list.appendChild(div);
        });

        const bm = document.getElementById('battle-menu');
        const em = document.getElementById('explore-menu');
        const mo = document.getElementById('monster-overlay');

        if (game.state === 'BATTLE') {
            if (game.currentBattle && game.currentBattle.phase === 'INPUT') {
                if (bm) bm.style.display = 'flex';
            } else {
                if (bm) bm.style.display = 'none';
            }
            if (em) em.style.display = 'none';
            if (mo) {
                mo.style.display = 'flex';
                game.currentBattle.monsters.forEach((m, i) => {
                    const el = document.getElementById(`monster-img-${i}`);
                    if (el) {
                        if (m.currentHp <= 0) {
                            if (!el.classList.contains('monster-dead')) {
                                el.classList.add('monster-dead');
                            }
                        } else {
                            el.classList.remove('monster-dead');
                            el.style.display = 'block';
                            // Status display
                            let statusEl = document.getElementById(`monster-status-${i}`);
                            if (!statusEl) {
                                statusEl = document.createElement('div');
                                statusEl.id = `monster-status-${i}`;
                                statusEl.className = 'monster-status-display';
                                statusEl.style.position = 'absolute';
                                statusEl.style.bottom = '-20px';
                                statusEl.style.width = '100%';
                                statusEl.style.textAlign = 'center';
                                statusEl.style.fontSize = '12px';
                                statusEl.style.textShadow = '1px 1px 2px #000';
                                statusEl.style.zIndex = '100';
                                el.appendChild(statusEl);
                            }
                            statusEl.innerHTML = `
                                ${m.statuses?.poison ? '<span style="color:#0f0; margin-right:4px;">[毒]</span>' : ''}
                                ${m.statuses?.paralysis ? '<span style="color:#ff0; margin-right:4px;">[麻]</span>' : ''}
                                ${m.statuses?.confusion ? '<span style="color:#f0f; margin-right:4px;">[混]</span>' : ''}
                            `;
                        }
                    }
                });
            }
        } else if (game.state === 'EXPLORE') {
            if (bm) bm.style.display = 'none';
            if (em) em.style.display = 'flex';
            if (mo) mo.style.display = 'none';
        } else if (game.state === 'EVENT' || game.state === 'TREASURE') {
            if (bm) bm.style.display = 'none';
            if (em) em.style.display = 'none';
        }

        if (game.state === 'CAMP') this.updateCampUI(game);
    },

    updateTimer: function (game) {
        const timer = document.getElementById('timer-display');
        if (!timer) return;
        const now = Date.now();
        const elapsed = Math.floor((game.elapsedTimeAtSave + (now - (game.startTime || now))) / 1000);
        const h = String(Math.floor(elapsed / 3600)).padStart(2, '0');
        const m = String(Math.floor((elapsed % 3600) / 60)).padStart(2, '0');
        const s = String(elapsed % 60).padStart(2, '0');
        timer.textContent = `${h}:${m}:${s}`;
    },

    showHitEffect: function (id, dmg) {
        const domId = id.startsWith('monster-') && !id.startsWith('monster-img-') ? id.replace('monster-', 'monster-img-') : id;
        const el = document.getElementById(domId); if (!el) return;
        el.classList.remove('target-hit'); void el.offsetWidth; el.classList.add('target-hit');
        const rect = el.getBoundingClientRect();
        const hit = document.createElement('div'); hit.className = 'damage-popup'; hit.textContent = dmg;
        hit.style.left = `${rect.left + rect.width / 2}px`; hit.style.top = `${rect.top + rect.height / 2}px`;
        document.body.appendChild(hit); setTimeout(() => hit.remove(), 1000);
    },

    showHealEffect: function (idx, val) {
        const el = document.getElementById(`party-member-${idx}`); if (!el) return;
        const rect = el.getBoundingClientRect();
        const heal = document.createElement('div'); heal.className = 'heal-popup'; heal.textContent = `+${val}`;
        heal.style.left = `${rect.left + rect.width / 2}px`; heal.style.top = `${rect.top + rect.height / 2}px`;
        document.body.appendChild(heal); setTimeout(() => heal.remove(), 1000);
    },

    showPartyHitEffect: function (idx, dmg) {
        const el = document.getElementById(`party-member-${idx}`); if (!el) return;
        el.classList.remove('target-hit'); void el.offsetWidth; el.classList.add('target-hit');
        const rect = el.getBoundingClientRect();
        const hit = document.createElement('div'); hit.className = 'damage-popup'; hit.textContent = `-${dmg}`;
        hit.style.left = `${rect.left + rect.width / 2}px`; hit.style.top = `${rect.top + rect.height / 2}px`;
        document.body.appendChild(hit); setTimeout(() => hit.remove(), 1000);
    },

    updateCampUI: function (game) {
        const campMenu = document.getElementById('camp-menu');
        if (!campMenu || game.state !== 'CAMP') return;

        // Navigation Bar
        let html = '<div class="camp-nav">';
        game.party.forEach((p, idx) => {
            html += `<button class="btn" onclick="document.getElementById('camp-char-${idx}').scrollIntoView()">${p.name}</button>`;
        });
        html += `<button class="btn" style="border-color:#ffcc00;" onclick="document.getElementById('camp-inventory').scrollIntoView()">持ち物</button>`;
        html += `<button class="btn" style="border-color:#f55;" onclick="window.game.toggleCamp()">戻る</button>`;
        html += '</div>';

        html += '<div class="camp-content">';
        html += '<div class="camp-header" style="margin-top:0;">CAMP - パーティ状況</div>';

        game.party.forEach((p, idx) => {
            const nextExp = Math.floor(50 * Math.pow(p.level, 1.7));
            const isLowHp = p.hp < p.maxHp * 0.3;
            const isGhost = p.isGhost === true;

            const getBonus = (stat) => {
                const effective = game.getEffectiveStat(p, stat);
                const base = p[stat] || 0;
                const bonus = effective - base;
                return bonus !== 0 ? ` <span style="color:${bonus > 0 ? '#5f5' : '#f55'}">(${bonus > 0 ? '+' : ''}${bonus})</span>` : '';
            };

            const portraitUrl = isGhost ? 'assets/face_亡霊.jpeg' : p.portrait;
            const getAtkBonus = () => {
                const effective = game.getAtk(p);
                const str = p.str || 0;
                const bonus = effective - str;
                return bonus !== 0 ? ` <span style="color:${bonus > 0 ? '#5f5' : '#f55'}">(${bonus > 0 ? '+' : ''}${bonus})</span>` : '';
            };
            const getDefBonus = () => {
                const effective = game.getDef(p);
                const vit = p.vit || 0;
                const bonus = effective - vit;
                return bonus !== 0 ? ` <span style="color:${bonus > 0 ? '#5f5' : '#f55'}">(${bonus > 0 ? '+' : ''}${bonus})</span>` : '';
            };
            html += `
                <div id="camp-char-${idx}" class="camp-character ${isLowHp ? 'low-hp' : ''} ${isGhost ? 'ghost-member' : ''}" style="position:relative; overflow:hidden;">
                    <div style="display:flex; gap:15px; position:relative; z-index:2; width:100%;">
                        <div style="width:100px; height:120px; border:2px solid #555; background:#222; flex-shrink:0;">
                            <img src="${portraitUrl}" class="${isGhost ? 'ghost-portrait' : ''}" style="width:100%; height:100%; object-fit:cover;" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 1 1%22><rect width=%221%22 height=%221%22 fill=%22%23333%22/></svg>'">
                        </div>

                        <div style="flex:1;">
                            <div class="camp-char-stats">
                                <strong style="color:${isGhost ? '#00ffff' : '#ffcc00'}; font-size:14px;">${p.name}${isGhost ? ' (亡霊)' : ''}</strong> 
                                ${isGhost ? '' : `<span style="font-size:12px; color:#aaa;">(${p.job}) Lv: ${p.level} | HP: ${p.hp}/${game.getEffectiveMaxHp(p)} | MP: ${p.mp}/${game.getEffectiveMaxMp(p)}</span>`}<br>
                                
                                <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:2px; margin-top:5px; font-size:11px; color:#ddd;">
                                    <div>STR: ${p.str}${getBonus('str')}</div>
                                    <div>INT: ${p.int}${getBonus('int')}</div>
                                    <div>VIT: ${p.vit}${getBonus('vit')}</div>
                                    <div>AGI: ${p.agi}${getBonus('agi')}</div>
                                    <div>LUK: ${p.luk}${getBonus('luk')}</div>
                                    <div style="color:#ffcc00; font-weight:bold;">ATK: ${game.getAtk(p)}${getAtkBonus()}</div>
                                    <div style="color:#ffcc00; font-weight:bold;">DEF: ${game.getDef(p)}${getDefBonus()}</div>
                                    <div style="font-size:10px; color:#888;">EXP: ${p.exp}/${nextExp}</div>
                                </div>
                                <div style="color:#888; font-size:10px; margin-top:4px;">${p.desc}</div>
                                <div style="color:#aaf; font-size:10px; margin-top:1px;">[スキル] ${p.skillDesc}</div>
                                <div class="camp-buffs" style="margin-top:2px; display:flex; gap:4px; flex-wrap:wrap;">
                                    ${p.battleBuffs.atk150FirstTurn ? '<span style="background:#f55; color:#fff; padding:1px 3px; font-size:9px; border-radius:2px;">攻UP(初撃)</span>' : ''}
                                    ${p.battleBuffs.preemptiveStrike ? '<span style="background:#55f; color:#fff; padding:1px 3px; font-size:9px; border-radius:2px;">先制待機</span>' : ''}
                                    ${p.battleBuffs.atk200Def200 ? '<span style="background:#ffcc00; color:#000; padding:1px 3px; font-size:9px; border-radius:2px; font-weight:bold;">不動の構え</span>' : ''}
                                    ${p.battleBuffs.ignoreDef ? '<span style="background:#00ffff; color:#000; padding:1px 3px; font-size:9px; border-radius:2px; font-weight:bold;">点穴</span>' : ''}
                                </div>
                            </div>
                            <div class="camp-char-actions" style="margin-top:10px; border-top: 1px solid #333; padding-top: 5px;">
                                ${isGhost ? '<div class="ghost-status" style="color:#00ffff; font-weight:bold; text-shadow:0 0 5px #00ffff;">亡霊は動けない</div>' : (game.campMode === 'SELECT_CHARACTER' || game.campMode === 'SELECT_TARGET' ?
                    `<button class="btn" style="padding:6px 12px; border-color:#ffcc00;" onclick="window.game.executeItemAction(${idx}, ${game.pendingItemIdx}, '${game.campMode === 'SELECT_TARGET' ? 'use' : 'equip'}')">選択</button>` :
                    ` ${(() => {
                        const skills = {
                            '戦士': { name: '勇猛の叫び', mp: 5 },
                            '盗賊': { name: '隠密の眼', mp: 10 },
                            '狩人': { name: '狙撃準備', mp: 10 },
                            '侍': { name: '明鏡止水', mp: 30 },
                            '武闘家': { name: '点穴', mp: 15 },
                            '僧侶': { name: '回復魔法', mp: 4 },
                            'ビショップ': { name: '聖別の儀', mp: 4 },
                            'モンク': { name: '精神統一', mp: 4 }
                        };
                        const skill = skills[p.job];
                        return skill ? `<button class="btn" style="padding:4px 8px; font-size:10px; border-color:#aaf;" onclick="window.game.castCampMagic(${idx})">${skill.name}(${skill.mp}MP)</button>` : '';
                    })()}
                                ${p.equipment.weapon ? `<button class="btn" style="padding:4px 8px; font-size:10px; border-color:#833;" onclick="window.game.unequipItem(${idx}, 'weapon')">[${p.equipment.weapon.name}]を外す</button>` : ''}
                                ${p.equipment.armor ? `<button class="btn" style="padding:4px 8px; font-size:10px; border-color:#833;" onclick="window.game.unequipItem(${idx}, 'armor')">[${p.equipment.armor.name}]を外す</button>` : ''}
                                ${p.equipment.accessory ? `<button class="btn" style="padding:4px 8px; font-size:10px; border-color:#833;" onclick="window.game.unequipItem(${idx}, 'accessory')">[${p.equipment.accessory.name}]を外す</button>` : ''}
                                `)}
                            </div>
                        </div>
                    </div>
                </div>`;
        });

        html += '<div id="camp-inventory" class="camp-header" style="margin-top:10px; font-size:14px;">パーティの持ち物</div>';
        html += '<div style="display:flex; flex-wrap:wrap; gap:5px; margin-bottom:10px;">';
        if (game.inventory.length === 0) html += '<span style="color:#888; font-size:12px;">何も持っていない。</span>';
        else {
            // Group consumables
            const groupedInventory = [];
            game.inventory.forEach((item, originalIdx) => {
                if (item.type === 'consumable') {
                    const existing = groupedInventory.find(g => g.item.name === item.name && g.item.desc === item.desc);
                    if (existing) {
                        existing.indices.push(originalIdx);
                    } else {
                        groupedInventory.push({ item: item, indices: [originalIdx], type: 'consumable' });
                    }
                } else {
                    groupedInventory.push({ item: item, indices: [originalIdx], type: 'equip' });
                }
            });

            groupedInventory.forEach((group) => {
                const item = group.item;
                const itemIdx = group.indices[0];
                const count = group.indices.length;
                html += `
                    <div style="border:1px solid #444; background:rgba(30,30,30,0.5); padding:5px; font-size:12px; min-width:100px; flex:1;">
                        <span style="color:#eee;">${item.name}${count > 1 ? ` <span style="color:#ffcc00;">(x${count})</span>` : ''}</span> <br><span style="color:#888; font-size:10px;">${item.desc}</span>
                        ${item.req ? `<br><span style="color:#ffcc00; font-size:10px;">[条件: ${Object.entries(item.req).map(([k, v]) => `${k.toUpperCase()} ${v}`).join(', ')}]</span>` : ''}<br>
                        <div style="margin-top:5px; display:flex; gap:5px;">
                            ${item.type === 'consumable' ? ((item.targetAll || item.name === '妖精の霊薬') ? `<button class="btn" style="padding:2px 5px; font-size:10px;" onclick="window.game.useItem(null, ${itemIdx})">使う</button>` : `<button class="btn" style="padding:2px 5px; font-size:10px;" onclick="window.game.showTargetSelection(${itemIdx}, 'use')">使う</button>`) : `<button class="btn" style="padding:2px 5px; font-size:10px;" onclick="UI.showTargetSelection(window.game, ${itemIdx}, 'equip')">装備</button>`}
                            ${game.discardingItemIdx === itemIdx ? `<span style="color:#f55; font-size:10px;">捨てる？</span><button class="btn" style="padding:2px 5px; font-size:10px; border-color:#f55; color:#f55;" onclick="window.game.dropItem(${itemIdx}, true)">はい</button><button class="btn" style="padding:2px 5px; font-size:10px;" onclick="window.game.dropItem(-1)">いいえ</button>` : `<button class="btn" style="padding:2px 5px; font-size:10px; border-color:#833;" onclick="window.game.dropItem(${itemIdx})">捨てる</button>`}
                        </div>
                    </div>`;
            });
        }
        html += '</div>';
        html += '</div>';
        campMenu.innerHTML = html;
        campMenu.style.display = 'flex';
    },

    showTargetSelection: function (game, itemIdx, action) {
        const item = game.inventory[itemIdx];
        const campMenu = document.getElementById('camp-menu');
        if (!campMenu) return;

        let html = `<div class="camp-header">${action === 'use' ? '誰が使う？' : '誰が装備する？'} - ${item.name}</div>`;
        html += `<div style="text-align:center; margin-bottom:15px; color:#aaa; font-size:12px;">${item.desc}</div>`;

        html += '<div style="display:flex; flex-direction:column; gap:8px; align-items:center; width:100%;">';
        game.party.forEach((p, cidx) => {
            let disabled = '';
            let color = '';
            let errorMsg = '';
            let statChanges = '';

            if (p.hp <= 0 || p.isGhost) {
                disabled = 'disabled';
                color = '#444';
            } else if (action === 'equip') {
                if (item.req) {
                    for (const [stat, reqVal] of Object.entries(item.req)) {
                        let pStat = p['base' + stat.charAt(0).toUpperCase() + stat.slice(1)] || p[stat];
                        if (pStat < reqVal) {
                            disabled = 'disabled';
                            color = '#844';
                            errorMsg = `(不足: ${stat.toUpperCase()} ${reqVal})`;
                            break;
                        }
                    }
                }

                // Stat Preview
                const currentItem = p.equipment[item.type];
                const statsToPreview = ['atk', 'def', 'str', 'int', 'vit', 'agi', 'luk'];
                const changes = [];

                statsToPreview.forEach(s => {
                    let oldVal, newVal;
                    if (s === 'atk') {
                        oldVal = game.getAtk(p);
                        // Simulate equip
                        const originalEquip = p.equipment[item.type];
                        p.equipment[item.type] = item;
                        newVal = game.getAtk(p);
                        p.equipment[item.type] = originalEquip;
                    } else if (s === 'def') {
                        oldVal = game.getDef(p);
                        const originalEquip = p.equipment[item.type];
                        p.equipment[item.type] = item;
                        newVal = game.getDef(p);
                        p.equipment[item.type] = originalEquip;
                    } else {
                        oldVal = game.getEffectiveStat(p, s);
                        const originalEquip = p.equipment[item.type];
                        p.equipment[item.type] = item;
                        newVal = game.getEffectiveStat(p, s);
                        p.equipment[item.type] = originalEquip;
                    }

                    if (oldVal !== newVal) {
                        const diff = newVal - oldVal;
                        changes.push(`<span style="margin-right:8px;">${s.toUpperCase()}: ${oldVal} → <span style="color:${diff > 0 ? '#5f5' : '#f55'}">${newVal} (${diff > 0 ? '+' : ''}${diff})</span></span>`);
                    }
                });

                if (changes.length > 0) {
                    statChanges = `<div style="font-size:10px; margin-top:5px; background:rgba(0,0,0,0.3); padding:4px; border-radius:4px; width:100%;">${changes.join('')}</div>`;
                } else {
                    statChanges = `<div style="font-size:10px; color:#888; margin-top:5px;">変化なし</div>`;
                }
            }

            if (!color) color = '#d3d3d3';
            html += `<button class="btn" style="width:90%; max-width:400px; padding:10px; color:${color}; border-color:${color}; text-align:left; display:block;" ${disabled} onclick="window.game.executeItemAction(${cidx}, ${itemIdx}, '${action}')">
                            <div style="display:flex; justify-content:space-between;">
                                <strong>${p.name}</strong> <span style="font-size:11px;">${p.job}</span>
                                <span style="color:#f55; font-size:11px;">${errorMsg}</span>
                            </div>
                            ${statChanges}
                        </button>`;
        });
        html += `</div>`;
        html += `<button class="btn" style="margin-top:20px; border-color:#888;" onclick="UI.updateCampUI(window.game)">キャンセル</button>`;
        campMenu.innerHTML = html;
    },

    addLog: function (msg) {
        const logWin = document.getElementById('log-window');
        if (!logWin) return;
        const entry = document.createElement('div');
        entry.textContent = `> ${msg}`;
        logWin.prepend(entry);
    },

    showBlackout: async function (game, text, duration, callback) {
        const overlay = document.getElementById('fade-overlay');
        const fadeText = document.getElementById('fade-text');
        overlay.style.display = 'flex';
        overlay.classList.remove('fade-out');
        overlay.classList.add('fade-in');
        if (text) {
            fadeText.textContent = text;
            fadeText.style.opacity = 1;
        }
        await new Promise(r => setTimeout(r, 1000));
        if (callback) await callback();
        const waitTime = Math.max(0, duration - 1000);
        await new Promise(r => setTimeout(r, waitTime));
        if (text) fadeText.style.opacity = 0;
        overlay.classList.remove('fade-in');
        overlay.classList.add('fade-out');
        await new Promise(r => setTimeout(r, 1000));
        overlay.style.display = 'none';
    },
    // Flash the screen with a color overlay
    flashScreen: function (color) {
        const overlay = document.createElement('div');
        overlay.className = 'screen-flash';
        overlay.style.backgroundColor = color || 'rgba(255,255,255,0.5)';
        document.body.appendChild(overlay);
        // Remove after animation duration (0.4s)
        setTimeout(() => {
            overlay.remove();
        }, 400);
    },

    openManual: function () {
        const overlay = document.getElementById('manual-overlay');
        if (overlay) {
            overlay.style.display = 'flex';
            this.addLog("マニュアルを開きました。");
        }
    },

    closeManual: function () {
        const overlay = document.getElementById('manual-overlay');
        if (overlay) {
            overlay.style.display = 'none';
        }
    }
};
