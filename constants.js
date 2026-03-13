/**
 * CONSTANTS & DATA
 */
const VIEW_DIST = 6;
const MAP_SIZE = 16;

const CLASSES = {
    WARRIOR: { name: '戦士', hp: 30, mp: 0, str: 15, int: 5, vit: 15, agi: 8, luk: 5, desc: '高いHPと防御力を誇る前衛の要。', skillDesc: '全力振り：大ダメージを与える強力な一撃。' },
    THIEF: { name: '盗賊', hp: 20, mp: 10, str: 10, int: 8, vit: 8, agi: 15, luk: 15, desc: '素早さと運が高く、宝箱の扱いに長けている。', skillDesc: '不意打ち: 素早さを活かした奇襲攻撃。' },
    CLERIC: { name: '僧侶', hp: 22, mp: 12, str: 8, int: 12, vit: 10, agi: 10, luk: 10, desc: '神聖な魔法でパーティの傷を癒やす。', skillDesc: 'ヒール: 味方一人のHPを大きく回復する。' },
    MAGE: { name: '魔術師', hp: 15, mp: 25, str: 5, int: 18, vit: 5, agi: 12, luk: 8, desc: '強力な魔術を操り、敵軍を一掃する。', skillDesc: 'ファイヤーボール: 敵全体に魔法ダメージを与える。' },
    SAMURAI: { name: '侍', hp: 25, mp: 12, str: 16, int: 8, vit: 12, agi: 14, luk: 8, desc: '刀を極め、強力な連撃を放つ。', skillDesc: '燕返し: 二回連続でダメージを与える。' },
    MARTIAL_ARTIST: { name: '武闘家', hp: 28, mp: 0, str: 14, int: 6, vit: 14, agi: 16, luk: 6, desc: '強靭な肉体を持ち、防御無視の熱波を放つ。', skillDesc: '気功波: 敵の防御を無視してダメージを与える。' },
    ARCHER: { name: '狩人', hp: 20, mp: 10, str: 12, int: 8, vit: 10, agi: 18, luk: 12, desc: '弓矢の達人。狙いすました一撃で敵を射抜く。', skillDesc: '狙い撃ち: 急所を突く高威力の射撃。' },
    MONK: { name: 'モンク', hp: 26, mp: 12, str: 13, int: 12, vit: 12, agi: 12, luk: 10, desc: '回復と攻撃を両立し、粘り強く戦う。', skillDesc: '精神統一: 味方を回復しつつ、敵へ追撃を行う。' },
    BISHOP: { name: 'ビショップ', hp: 22, mp: 22, str: 8, int: 18, vit: 10, agi: 10, luk: 12, desc: '究極の聖職者。癒やしと浄化を同時に行う。', skillDesc: 'ホーリーライト: 味方を回復し、敵全員に神聖ダメージ。' }
};

const ITEMS = [
    { id: 1, name: '傷薬', type: 'consumable', level: 1, hpRestore: 30, desc: 'HPを30回復' },
    { id: 2, name: '上傷薬', type: 'consumable', level: 4, hpRestore: 100, desc: 'HPを100回復' },
    { id: 3, name: '特大傷薬', type: 'consumable', level: 7, hpRestore: 300, desc: 'HPを300回復' },
    { id: 5, name: '精神薬', type: 'consumable', level: 1, mpRestore: 10, desc: 'MPを10回復' },
    { id: 6, name: '上級精神薬', type: 'consumable', level: 4, mpRestore: 30, desc: 'MPを30回復' },
    { id: 7, name: '特級精神薬', type: 'consumable', level: 7, mpRestore: 100, desc: 'MPを100回復' },
    { id: 4, name: 'エリクサー', type: 'consumable', level: 10, hpRestore: 999, desc: 'HPを全回復' },
    { id: 10, name: 'ダガー', type: 'weapon', level: 1, atk: 3, desc: '軽い短剣(ATK+3)' },
    { id: 11, name: 'ショートソード', type: 'weapon', level: 2, atk: 5, req: { str: 5 }, desc: '小回りの剣(ATK+5)' },
    { id: 12, name: '木の杖', type: 'weapon', level: 2, atk: 2, int: 5, req: { int: 8 }, desc: '詠唱を助ける(ATK+2, INT+5)' },
    { id: 13, name: 'メイス', type: 'weapon', level: 3, atk: 5, req: { str: 8 }, desc: '僧侶も使える(ATK+5)' },
    { id: 14, name: 'レイピア', type: 'weapon', level: 4, atk: 7, req: { agi: 10 }, desc: '細身の剣(ATK+7)' },
    { id: 15, name: 'ロングソード', type: 'weapon', level: 5, atk: 8, req: { str: 10 }, desc: '標準的な剣(ATK+8)' },
    { id: 16, name: '魔導士の杖', type: 'weapon', level: 5, atk: 4, int: 12, req: { int: 15 }, desc: '魔力を帯びた杖(ATK+4, INT+12)' },
    { id: 17, name: 'モーニングスター', type: 'weapon', level: 6, atk: 12, req: { str: 12 }, desc: '棘付き鉄球(ATK+12)' },
    { id: 18, name: 'グラディウス', type: 'weapon', level: 7, atk: 13, req: { agi: 12 }, desc: '暗殺者の短剣(ATK+13)' },
    { id: 19, name: 'バトルアックス', type: 'weapon', level: 8, atk: 15, req: { str: 15 }, desc: '重い斧(ATK+15)' },
    { id: 20, name: 'グレートソード', type: 'weapon', level: 9, atk: 18, req: { str: 18 }, desc: '巨大な両手剣(ATK+18)' },
    { id: 21, name: 'フランベルジュ', type: 'weapon', level: 10, atk: 22, req: { str: 35 }, desc: '波打つ剣身(ATK+22)' },
    { id: 22, name: '大賢者の杖', type: 'weapon', level: 10, atk: 8, int: 25, req: { int: 40 }, desc: '世界樹の枝(ATK+8, INT+25)' },
    { id: 23, name: '妖刀ムラマサ', type: 'weapon', level: 10, atk: 35, agi: 15, req: { agi: 45 }, desc: '呪われた名刀(ATK+35, AGI+15)' },
    { id: 24, name: 'エクスカリバー', type: 'weapon', level: 10, atk: 40, req: { str: 50 }, desc: '伝説の聖剣(ATK+40)' },
    { id: 30, name: 'ローブ', type: 'armor', level: 1, def: 2, desc: '布の服(DEF+2)' },
    { id: 31, name: '旅人の服', type: 'armor', level: 2, def: 3, desc: '丈夫な服(DEF+3)' },
    { id: 32, name: 'レザーアーマー', type: 'armor', level: 3, def: 4, req: { str: 6 }, desc: '革の鎧(DEF+4)' },
    { id: 33, name: 'シルクのローブ', type: 'armor', level: 4, def: 5, int: 5, req: { int: 10 }, desc: '魔法の衣(DEF+5, INT+5)' },
    { id: 34, name: '盗賊の軽鎧', type: 'armor', level: 5, def: 6, agi: 5, req: { agi: 12 }, desc: '動きやすい(DEF+6, AGI+5)' },
    { id: 35, name: 'チェインメイル', type: 'armor', level: 6, def: 8, req: { str: 15 }, desc: '鎧帷子(DEF+8)' },
    { id: 36, name: 'スケイルメイル', type: 'armor', level: 7, def: 11, req: { str: 18 }, desc: '鱗の鎧(DEF+11)' },
    { id: 37, name: 'プレートメイル', type: 'armor', level: 8, def: 15, req: { str: 20 }, desc: '重装甲(DEF+15)' },
    { id: 38, name: 'ミスリルメイル', type: 'armor', level: 9, def: 20, req: { str: 15 }, desc: '軽く硬い(DEF+20)' },
    { id: 39, name: 'ドラゴンメイル', type: 'armor', level: 10, def: 28, req: { str: 40 }, desc: '龍の鱗で作られた(DEF+28)' },
    { id: 40, name: 'イージスの盾', type: 'armor', level: 10, def: 35, req: { str: 55 }, desc: '神話の盾(DEF+35)' },
    { id: 50, name: '力の腕輪', type: 'accessory', level: 3, atk: 3, desc: '攻撃力アップ(ATK+3)' },
    { id: 51, name: '守りの指輪', type: 'accessory', level: 3, def: 3, desc: '防御力アップ(DEF+3)' },
    { id: 52, name: '疾風の指輪', type: 'accessory', level: 5, agi: 5, desc: '素早さアップ(AGI+5)' },
    { id: 53, name: '賢者の石', type: 'accessory', level: 7, int: 10, desc: '魔力アップ(INT+10)' },
    { id: 54, name: '勇者の証', type: 'accessory', level: 9, atk: 5, def: 5, desc: '攻防アップ(ATK+5, DEF+5)' },
    { id: 55, name: '幸運の兎の足', type: 'accessory', level: 6, luk: 15, desc: '運気アップ(LUK+15)' },
    { id: 56, name: '女神の指輪', type: 'accessory', level: 10, def: 10, int: 5, desc: '加護(DEF+10, INT+5)' },
    { id: 60, name: '方天画戟', type: 'weapon', level: 10, atk: 55, req: { str: 70 }, desc: '武神の長柄武器(ATK+55)' },
    { id: 61, name: 'ゲイボルグ', type: 'weapon', level: 10, atk: 50, agi: 20, req: { agi: 65, str: 40 }, desc: '必中の魔槍(ATK+50, AGI+20)' },
    { id: 62, name: '神魔の息吹', type: 'weapon', level: 10, atk: 15, int: 60, req: { int: 80 }, desc: '究極の魔導書(ATK+15, INT+60)' },
    { id: 63, name: '天叢雲剣', type: 'weapon', level: 10, atk: 65, luk: 30, req: { str: 60, luk: 50 }, desc: '三種の神器の一つ(ATK+65, LUK+30)' },
    { id: 64, name: 'レーヴァテイン', type: 'weapon', level: 10, atk: 75, req: { str: 90 }, desc: '世界を穿つ魔剣(ATK+75)' },
    { id: 65, name: 'ミョルニル', type: 'weapon', level: 10, atk: 85, req: { str: 110 }, desc: '雷神の槌(ATK+85)' },
    { id: 66, name: 'アポロンの弓', type: 'weapon', level: 10, atk: 45, agi: 40, req: { agi: 80 }, desc: '太陽神の弓(ATK+45, AGI+40)' },
    { id: 70, name: '源氏の鎧', type: 'armor', level: 10, def: 45, req: { str: 65 }, desc: '東方の名将の鎧(DEF+45)' },
    { id: 71, name: '天女の羽衣', type: 'armor', level: 10, def: 20, agi: 30, luk: 20, req: { agi: 50, int: 50 }, desc: '浮世離れした美しさ(DEF+20, AGI+30, LUK+20)' },
    { id: 72, name: 'アダマンアーマー', type: 'armor', level: 10, def: 60, req: { str: 100 }, desc: '超硬度の鎧(DEF+60)' },
    { id: 73, name: '一星のローブ', type: 'armor', level: 10, def: 35, int: 45, req: { int: 90 }, desc: '星の力を宿す法衣(DEF+35, INT+45)' },
    { id: 74, name: '機神の装甲', type: 'armor', level: 10, def: 55, agi: -10, req: { str: 85, vit: 70 }, desc: '機械仕掛けの重装甲(DEF+55, AGI-10)' },
    { id: 75, name: 'ドレッドノート', type: 'armor', level: 10, def: 80, agi: -20, req: { str: 120 }, desc: '絶対的な防御力(DEF+80, AGI-20)' },
    { id: 76, name: '聖騎士の盾', type: 'armor', level: 10, def: 50, vit: 20, req: { str: 75, vit: 60 }, desc: '全てを弾く壁(DEF+50, VIT+20)' },
    { id: 80, name: 'オリハルコンの環', type: 'accessory', level: 10, atk: 15, def: 15, desc: '極限の硬度(ATK+15, DEF+15)' },
    { id: 81, name: 'クロノスギア', type: 'accessory', level: 10, agi: 25, desc: '時を加速させる(AGI+25)' },
    { id: 82, name: 'ソロモンの指輪', type: 'accessory', level: 10, int: 35, desc: '万物の叡智(INT+35)' },
    { id: 83, name: 'ヘラクレスの帯', type: 'accessory', level: 10, str: 20, vit: 20, desc: '剛力と強靭(STR+20, VIT+20)' },
    { id: 84, name: '幸運の四葉草', type: 'accessory', level: 10, luk: 50, desc: '神がかり的な幸運(LUK+50)' },
    { id: 85, name: 'カレイドスコープ', type: 'accessory', level: 10, int: 20, luk: 20, desc: '多種多様な魔力(INT+20, LUK+20)' },
    { id: 86, name: '世界樹の種', type: 'accessory', level: 10, hp: 100, def: 10, desc: '生命の根源(HP+100, DEF+10)' },
    // Cursed Items (High risk, high reward)
    { id: 101, name: 'カースロッド', type: 'weapon', level: 5, atk: 25, int: -80, desc: '魔力を吸い取る呪いの杖(ATK+25, INT-80)' },
    { id: 102, name: 'カースプレート', type: 'armor', level: 5, def: 40, agi: -30, desc: '重すぎる呪いの鉄鎧(DEF+40, AGI-30)' },
    { id: 103, name: 'ブラッドソード', type: 'weapon', level: 7, atk: 50, vit: -20, desc: '生命を糧とする魔剣(ATK+50, VIT-20)' },
    { id: 104, name: '狂人の短剣', type: 'weapon', level: 6, atk: 30, agi: 20, luk: -50, desc: '狂気の短剣(ATK+30, AGI+20, LUK-50)' },
    { id: 105, name: '愚者の法衣', type: 'armor', level: 4, def: 15, int: 30, str: -20, desc: '知恵と引き換えに力を失う法衣(DEF+15, INT+30, STR-20)' },
    { id: 106, name: '死の籠手', type: 'accessory', level: 5, atk: 20, vit: -15, luk: -20, desc: '死を招く籠手(ATK+20, VIT-15, LUK-20)' },
    { id: 107, name: '封印の古弓', type: 'weapon', level: 8, atk: 45, agi: -15, desc: '封印された古弓(ATK+45, AGI-15)' },
    { id: 108, name: '獄炎の杖', type: 'weapon', level: 9, atk: 5, int: 60, vit: -30, desc: '持ち主を焼く獄炎の杖(ATK+5, INT+60, VIT-30)' },
    { id: 109, name: '呪いの指輪', type: 'accessory', level: 3, str: 15, int: 15, vit: -10, agi: -10, desc: '能力を歪める指輪(STR+15, INT+15, VIT-10, AGI-10)' },
    { id: 110, name: '強欲の魔石', type: 'accessory', level: 5, luk: 100, str: -30, vit: -30, desc: '強欲の魔石(LUK+100, STR-30, VIT-30)' },
    { id: 111, name: '亡霊の盾', type: 'armor', level: 8, def: 50, vit: -20, desc: '実体のない盾(DEF+50, VIT-20)' },
    { id: 112, name: '狂戦士の仮面', type: 'accessory', level: 7, atk: 40, def: -20, desc: '理性を失う仮面(ATK+40, DEF-20)' }
];

const ITEM_PREFIXES = [
    { name: '呪われた', mult: -1.0, weight: 5 },
    { name: 'ボロボロの', mult: 0.5, weight: 20 },
    { name: '', mult: 1.0, weight: 45 },
    { name: '上質の', mult: 1.5, weight: 20 },
    { name: '名工の', mult: 2.0, weight: 8 },
    { name: '聖なる', mult: 3.0, weight: 2 }
];

// ==========================================
// 通常のモンスターの設定（ここに行を追加することで自動実装されます）
// ==========================================
// 深層用モンスター（18〜29）の画像IDと被らないように、新しい敵を追加する場合は
// id: 30 以降の数字を指定して「assets/monster_X.png」を用意してください。
const REGULAR_ENEMIES_CONFIG = [
    { id: 0, name: 'スライム', stats: { hp: 1.2, atk: 0.8, agi: 0.5 } },
    { id: 1, name: 'バット', stats: { hp: 0.6, atk: 0.8, agi: 1.5 } },
    { id: 2, name: 'スパイダー', stats: { hp: 0.8, atk: 1.0, agi: 1.2 } },
    { id: 3, name: 'スネーク', stats: { hp: 0.7, atk: 1.2, agi: 1.3 } },
    { id: 4, name: 'ゴブリン', stats: { hp: 1.0, atk: 1.0, agi: 1.0 } },
    { id: 5, name: 'スケルトン', stats: { hp: 0.8, atk: 1.2, agi: 0.8 } },
    { id: 6, name: 'ファントム', stats: { hp: 0.5, atk: 1.5, agi: 1.8 } },
    { id: 7, name: 'オーガ', stats: { hp: 2.8, atk: 1.5, agi: 0.6 } },
    { id: 8, name: 'デーモン', stats: { hp: 2.0, atk: 1.8, agi: 1.2 } },
    { id: 9, name: 'ドラゴン', stats: { hp: 2.5, atk: 2.5, agi: 1.0 } },
    { id: 10, name: 'ゾンビ', stats: { hp: 3.5, atk: 1.1, agi: 0.4 } },
    { id: 11, name: 'メイジ', stats: { hp: 0.7, atk: 3.5, agi: 0.9 } },
    { id: 12, name: 'ヴァンパイア', stats: { hp: 1.3, atk: 1.4, agi: 1.5 } },
    { id: 13, name: 'デビル', stats: { hp: 1.2, atk: 5.0, agi: 1.1 } },
    { id: 14, name: 'ダイナソー', stats: { hp: 2.7, atk: 2.5, agi: 0.5 } },
    { id: 15, name: 'イーター', stats: { hp: 0.3, atk: 1.4, agi: 0.5 } },
    { id: 16, name: 'ディアブロ', stats: { hp: 3.2, atk: 2.0, agi: 1.6 } },
    { id: 17, name: 'リッチ', stats: { hp: 4.2, atk: 1.0, agi: 2.6 } }
];

const ENEMY_VARIANTS = [
    { prefix: 'スモール', filter: 'hue-rotate(90deg) saturate(1.2)', scale: 'transform: scale(0.8);' },
    { prefix: '', filter: 'none', scale: 'transform: scale(1.2);' },
    { prefix: 'レッド', filter: 'hue-rotate(180deg) saturate(2)', scale: 'transform: scale(1.2);' },
    { prefix: 'ダーク', filter: 'hue-rotate(270deg) brightness(0.6)', scale: 'transform: scale(1.2);' },
    { prefix: 'キング', filter: 'hue-rotate(45deg) brightness(1.5)', scale: 'transform: scale(1.6);' },
    { prefix: 'アビス', filter: 'hue-rotate(220deg) brightness(0.4)', scale: 'transform: scale(1.6);' }
];

const MONSTERS = [];
let _generatedMonsters = [];
REGULAR_ENEMIES_CONFIG.forEach((config, i) => {
    ENEMY_VARIANTS.forEach((v, j) => {
        const htmlStr = `<img src="assets/monster_${config.id}.png" 
                    style="width:100%; height:100%; object-fit:contain; object-position:bottom; transform-origin:bottom; filter: ${v.filter}; ${v.scale}; image-rendering: pixelated;" />`;
        _generatedMonsters.push({
            name: v.prefix + config.name,
            svgStr: htmlStr,
            baseVal: i * 2 + j * 5,
            imgIndex: config.id,
            statsMult: config.stats
        });
    });
});
_generatedMonsters.sort((a, b) => a.baseVal - b.baseVal);

_generatedMonsters.forEach((m, idx) => {
    const floorRaw = idx / 7;
    const scale = 1 + floorRaw * 0.2 + Math.pow(1.3, floorRaw) * 0.15;
    const statsMult = m.statsMult || { hp: 1, atk: 1, agi: 1 };

    MONSTERS.push({
        name: m.name,
        level: Math.floor(floorRaw) + 1,
        hp: Math.floor(25 * scale * statsMult.hp),
        atk: Math.floor(8 * scale * statsMult.atk),
        agi: Math.floor((5 + floorRaw * 2.5) * statsMult.agi),
        exp: Math.floor(40 * scale * statsMult.hp * (1 + floorRaw * 0.5)),
        imgIndex: m.imgIndex,
        svg: m.svgStr
    });
});

const ENEMY_SKILLS = {
    0: { name: '分裂', chance: 0.5, type: 'summon', desc: '体が二つに分かれた！', se: 'se_summoned', flashColor: 'rgba(255,255,255,0.5)' },
    1: { name: '吸血', chance: 0.4, type: 'drain', desc: '鋭い牙で噛みついた！', mult: 1.2, se: 'se_drain', flashColor: 'rgba(255,0,0,0.4)' },
    2: { name: '粘着糸', chance: 0.3, type: 'attack', desc: '粘着質な糸を吐き出した！', mult: 1.5, se: 'se_attack', flashColor: 'rgba(255,255,255,0.3)', status: 'paralysis', statusChance: 0.4 },
    3: { name: '毒牙', chance: 0.4, type: 'pierce', desc: '毒の牙が深く突き刺さる！', mult: 1.5, se: 'se_attack', flashColor: 'rgba(200,255,100,0.4)', status: 'poison', statusChance: 0.6 },
    4: { name: '仲間を呼ぶ', chance: 0.3, type: 'summon', desc: '仲間を呼び寄せた！', se: 'se_summoned', flashColor: 'rgba(255,255,255,0.5)' },
    5: { name: '骨投げ', chance: 0.4, type: 'attack', desc: '自身の骨を投げつけてきた！', mult: 1.8, se: 'se_heavy_attack', flashColor: 'rgba(255,255,255,0.4)' },
    6: { name: 'エナジードレイン', chance: 0.4, type: 'drain', desc: '生命力を吸い取られた！', mult: 1.5, se: 'se_drain', flashColor: 'rgba(150,0,255,0.4)' },
    7: { name: '痛恨の一撃', chance: 0.3, type: 'attack', desc: '渾身の一撃が叩き込まれた！', mult: 2.5, se: 'se_heavy_attack', flashColor: 'rgba(255,0,0,0.6)' },
    8: { name: '暗黒の炎', chance: 0.3, type: 'aoe', desc: '禍々しい炎が周囲を焼き尽くす！', mult: 0.7, se: 'se_fire', flashColor: 'rgba(100,0,100,0.5)', status: 'confusion', statusChance: 0.2 },
    9: { name: '炎', chance: 0.4, type: 'aoe', desc: '灼熱の炎を吐き出した！', mult: 0.6, se: 'se_fire', flashColor: 'rgba(255,100,0,0.5)' },
    10: { name: '腐食液', chance: 0.4, type: 'pierce', desc: '腐食性の液体を浴びせかけてきた！', mult: 1.5, se: 'se_magic', flashColor: 'rgba(100,255,100,0.4)', status: 'poison', statusChance: 0.5 },
    11: { name: 'ファイヤーボール', chance: 0.5, type: 'attack', desc: '巨大な火球を放った！', mult: 2.0, se: 'se_fire', flashColor: 'rgba(255,50,0,0.6)' },
    12: { name: '吸血', chance: 0.4, type: 'drain', desc: '闇の中から牙を突き立てた！', mult: 1.4, se: 'se_drain', flashColor: 'rgba(200,0,0,0.5)' },
    13: { name: 'メテオ', chance: 0.2, type: 'aoe', desc: '宇宙から隕石が降り注ぐ！', mult: 2.0, se: 'se_heavy_attack', flashColor: 'rgba(255,150,0,0.7)' },
    14: { name: '暴走', chance: 0.5, type: 'attack', desc: '激しく暴れ狂った！', mult: 2.5, se: 'se_heavy_attack', flashColor: 'rgba(255,255,255,0.6)', status: 'confusion', statusChance: 0.3 },
    15: { name: '呪い', chance: 0.2, type: 'drain', desc: '呪いを放った！', mult: 1.4, se: 'se_magic', flashColor: 'rgba(150,0,255,0.5)', status: 'paralysis', statusChance: 0.3 },
    16: { name: '痛恨の一撃', chance: 0.2, type: 'attack', desc: '渾身の一撃が叩き込まれた！', mult: 2.5, se: 'se_heavy_attack', flashColor: 'rgba(255,0,0,0.6)' },
    17: { name: '宣告', chance: 0.1, type: 'attack', desc: '死を宣告した！', mult: 3.4, se: 'se_magic', flashColor: 'rgba(0,0,0,0.8)' },
    'd0': { name: '業火', chance: 0.4, type: 'aoe', desc: '地獄の業火がすべてを焼き尽くす！', mult: 1.2, se: 'se_fire', flashColor: 'rgba(255,0,0,0.6)' },
    'd1': { name: '絶望の吸血', chance: 0.5, type: 'drain', desc: '凄まじい勢いで血を啜る！', mult: 1.5, se: 'se_drain', flashColor: 'rgba(255,0,0,0.8)' },
    'd2': { name: '狂気の視線', chance: 0.3, type: 'pierce', desc: '狂気の視線に貫かれた！', mult: 1.5, se: 'se_magic', flashColor: 'rgba(150,0,150,0.5)', status: 'confusion', statusChance: 0.5 },
    'd3': { name: '溶解液', chance: 0.4, type: 'pierce', desc: 'すべてを溶かす溶解液をまき散らす！', mult: 1.8, se: 'se_magic', flashColor: 'rgba(100,255,50,0.6)', status: 'poison', statusChance: 0.5 },
    'd4': { name: '竜の息吹', chance: 0.5, type: 'breath', desc: '想像を絶する熱線のブレス！', mult: 0.8, se: 'se_fire', flashColor: 'rgba(255,200,0,0.8)', status: 'poison', statusChance: 0.4 },
    'd5': { name: '大地震', chance: 0.3, type: 'aoe', desc: '大地を激しく揺るがした！', mult: 1.5, se: 'se_heavy_attack', flashColor: 'rgba(150,100,50,0.7)', status: 'paralysis', statusChance: 0.3 },
    'd6': { name: '甘い誘惑', chance: 0.4, type: 'drain_level', desc: '魅惑的な口づけで精気を奪う！', mult: 0.8, se: 'se_drain', flashColor: 'rgba(255,100,200,0.6)', status: 'confusion', statusChance: 0.6 },
    'd7': { name: '毒の息', chance: 0.4, type: 'breath', desc: '猛烈な毒の息を吐き出した！', mult: 0.6, se: 'se_fire', flashColor: 'rgba(50,255,50,0.6)', status: 'poison', statusChance: 0.8 },
    'd8': { name: 'エナジードレイン', chance: 0.4, type: 'drain_level', desc: '生命の源を吸い取ってきた！', mult: 1.0, se: 'se_drain', flashColor: 'rgba(200,50,200,0.6)', status: 'paralysis', statusChance: 0.4 },
    'd9': { name: 'まばゆい光', chance: 0.3, type: 'aoe', desc: '強烈な光が視界を奪う！', mult: 0.5, se: 'se_magic', flashColor: 'rgba(255,255,200,0.8)', status: 'confusion', statusChance: 0.5 },
    'd10': { name: '命を刈り取る手', chance: 0.3, type: 'drain', desc: '冷たい手で命を刈り取った！', mult: 1.5, se: 'se_drain', flashColor: 'rgba(0,0,100,0.5)', status: 'paralysis', statusChance: 0.5 },
    'd11': { name: '死の絶叫', chance: 0.3, type: 'death', desc: '呪われた絶叫が響き渡る！', mult: 1.0, se: 'se_heavy_attack', flashColor: 'rgba(200,0,0,0.7)', status: 'paralysis', statusChance: 0.4 },
    'd12': { name: '崩落', chance: 0.15, type: 'aoe', desc: '天井が崩れ落ちてきた！', mult: 1.0, se: 'se_heavy_attack', flashColor: 'rgba(150,100,50,0.7)' },
    'd13': { name: '腐食液', chance: 0.3, type: 'drain', desc: '腐食性の液体を浴びせかけてきた！', mult: 1.0, se: 'se_magic', flashColor: 'rgba(100,255,50,0.7)', status: 'poison', statusChance: 0.5 },
    'boss': { name: '絶望の波動', chance: 0.1, type: 'aoe', desc: '周囲の空気が重く震える...', mult: 2.0, se: 'se_heavy_attack', flashColor: 'rgba(255,255,255,0.8)', status: 'confusion', statusChance: 0.1 }
};

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
        const r1 = rooms[i - 1], r2 = rooms[i];
        let x1 = Math.floor(r1.x + r1.w / 2), y1 = Math.floor(r1.y + r1.h / 2);
        let x2 = Math.floor(r2.x + r2.w / 2), y2 = Math.floor(r2.y + r2.h / 2);
        while (x1 !== x2) { map[y1][x1] = 0; x1 += (x2 > x1) ? 1 : -1; }
        while (y1 !== y2) { map[y1][x1] = 0; y1 += (y2 > y1) ? 1 : -1; }
    }
    let sx = 1, sy = 1, cx = Math.floor(rooms[0].x + rooms[0].w / 2), cy = Math.floor(rooms[0].y + rooms[0].h / 2);
    while (sx !== cx) { map[sy][sx] = 0; sx += (cx > sx) ? 1 : -1; }
    while (sy !== cy) { map[sy][sx] = 0; sy += (cy > sy) ? 1 : -1; }

    // No up stairs from 11F onwards (depth >= 10)
    if (depth < 10) {
        map[1][1] = 2;
    }

    const lastRoom = rooms[rooms.length - 1];
    let stairX = lastRoom.x + Math.floor(Math.random() * lastRoom.w), stairY = lastRoom.y + Math.floor(Math.random() * lastRoom.h);
    if (stairX === 1 && stairY === 1) stairX++;
    map[stairY][stairX] = 3;
    if (depth >= 1) {
        const diff = Math.min(depth * 0.02, 0.15);
        for (let y = 1; y < size - 1; y++) {
            for (let x = 1; x < size - 1; x++) {
                if (map[y][x] === 1 && Math.random() < diff * 0.2) {
                    if (map[y - 1][x] === 0 || map[y + 1][x] === 0 || map[y][x - 1] === 0 || map[y][x + 1] === 0) map[y][x] = 4;
                } else if (map[y][x] === 0 && (x !== stairX && y !== stairY) && (x !== 1 && y !== 1)) {
                    if (Math.random() < diff * 0.3) map[y][x] = 5;
                    else if (Math.random() < diff * 0.4) map[y][x] = 6;
                    else if (Math.random() < diff * 0.3) map[y][x] = 7;
                }
            }
        }
    }
    return map;
}

let LEVELS = [];
function generateAllLevels() {
    LEVELS.length = 0;
    for (let i = 0; i < 10; i++) {
        const map = generateMaze(MAP_SIZE, i);

        // Place boss tile (8) on every floor instead of just floor 9
        let emptySpots = [];
        for (let r = 1; r < map.length - 1; r++) {
            for (let c = 1; c < map[r].length - 1; c++) {
                if (map[r][c] === 0 && !(r === 1 && c === 1) && map[r][c] !== 2 && map[r][c] !== 3) {
                    emptySpots.push({ r, c });
                }
            }
        }
        if (emptySpots.length > 0) {
            let spot = emptySpots[Math.floor(Math.random() * emptySpots.length)];
            map[spot.r][spot.c] = 8;
        }

        if (i >= 0 && i <= 8) {
            let emptySpotsEnv = [];
            for (let r = 1; r < map.length - 1; r++) {
                for (let c = 1; c < map[r].length - 1; c++) {
                    if (map[r][c] === 0 && !(r === 1 && c === 1) && map[r][c] !== 2 && map[r][c] !== 3 && map[r][c] !== 8) {
                        emptySpotsEnv.push({ r, c });
                    }
                }
            }
            if (emptySpotsEnv.length > 0) {
                let spot = emptySpotsEnv[Math.floor(Math.random() * emptySpotsEnv.length)];
                map[spot.r][spot.c] = 9;
            }
        }
        LEVELS.push(map);
    }
}
generateAllLevels();

// ==========================================
// 11F以降（深層・アビス）専用モンスターの追加エリア
// ==========================================
// ここに手動で追加したモンスターは、深層（11F以降）でのみ出現します。
// （deepOnly: true を設定しているため通常の1〜10Fには出現しません）

MONSTERS.push({
    name: "アークデーモン",
    level: 12,
    hp: 1800,
    atk: 180,
    agi: 70,
    exp: 4500,
    imgIndex: 'd0',
    svg: `<img src="assets/monster_d0.png" style="width:100%; height:100%; object-fit:contain; object-position:bottom; transform: scale(1.2); image-rendering: pixelated;" />`,
    deepOnly: true
});

MONSTERS.push({
    name: "ブラッディ",
    level: 11,
    hp: 1200,
    atk: 150,
    agi: 90,
    exp: 3500,
    imgIndex: 'd1',
    svg: `<img src="assets/monster_d1.png" style="width:100%; height:100%; object-fit:contain; object-position:bottom; filter: hue-rotate(340deg) saturate(1.5); image-rendering: pixelated;" />`,
    deepOnly: true
});

MONSTERS.push({
    name: "フィアー",
    level: 12,
    hp: 1500,
    atk: 140,
    agi: 100,
    exp: 4000,
    imgIndex: 'd2',
    svg: `<img src="assets/monster_d2.png" style="width:100%; height:100%; object-fit:contain; object-position:bottom; filter: brightness(0.8) contrast(1.2); transform: scale(1.1); image-rendering: pixelated;" />`,
    deepOnly: true
});

MONSTERS.push({
    name: "ヴェノム",
    level: 11,
    hp: 2200,
    atk: 130,
    agi: 40,
    exp: 3800,
    imgIndex: 'd3',
    svg: `<img src="assets/monster_d3.png" style="width:100%; height:100%; object-fit:contain; object-position:bottom; filter: hue-rotate(90deg) saturate(1.5); transform: scale(1.3); image-rendering: pixelated;" />`,
    deepOnly: true
});

MONSTERS.push({
    name: "アークドラゴン",
    level: 14,
    hp: 3000,
    atk: 250,
    agi: 80,
    exp: 7000,
    imgIndex: 'd4',
    svg: `<img src="assets/monster_d4.png" style="width:100%; height:100%; object-fit:contain; object-position:bottom; transform: scale(1.5); image-rendering: pixelated;" />`,
    deepOnly: true
});

MONSTERS.push({
    name: "ギガント",
    level: 13,
    hp: 4000,
    atk: 220,
    agi: 30,
    exp: 6000,
    imgIndex: 'd5',
    svg: `<img src="assets/monster_d5.png" style="width:100%; height:100%; object-fit:contain; object-position:bottom; transform: scale(1.6); filter: brightness(0.9); image-rendering: pixelated;" />`,
    deepOnly: true
});

MONSTERS.push({
    name: "サキュバス",
    level: 12,
    hp: 1600,
    atk: 110,
    agi: 120,
    exp: 4500,
    imgIndex: 'd6',
    svg: `<img src="assets/monster_d6.png" style="width:100%; height:100%; object-fit:contain; object-position:bottom; filter: hue-rotate(300deg) saturate(1.2); transform: scale(1.1); image-rendering: pixelated;" />`,
    deepOnly: true
});

MONSTERS.push({
    name: "ポイズンジャイアント",
    level: 14,
    hp: 2500,
    atk: 150,
    agi: 50,
    exp: 12000,
    imgIndex: 'd7',
    svg: `<img src="assets/monster_d7.png" style="width:100%; height:100%; object-fit:contain; object-position:bottom; transform: scale(1.6); image-rendering: pixelated;" />`,
    deepOnly: true
});

MONSTERS.push({
    name: "マイルフィック",
    level: 15,
    hp: 1800,
    atk: 300,
    agi: 100,
    exp: 18000,
    imgIndex: 'd8',
    svg: `<img src="assets/monster_d8.png" style="width:100%; height:100%; object-fit:contain; object-position:bottom; filter: hue-rotate(270deg) contrast(1.5) brightness(0.8); transform: scale(1.4); image-rendering: pixelated;" />`,
    deepOnly: true
});

MONSTERS.push({
    name: "ウィル・オ・ウィスプ",
    level: 13,
    hp: 300,
    atk: 80,
    agi: 999, // Extremely hard to hit
    exp: 50000, // Massive EXP
    imgIndex: 'd9',
    svg: `<img src="assets/monster_d9.png" style="width:100%; height:100%; object-fit:contain; object-position:bottom; filter: hue-rotate(45deg) brightness(2.0); transform: scale(0.9); image-rendering: pixelated;" />`,
    deepOnly: true
});

MONSTERS.push({
    name: "レイス",
    level: 12,
    hp: 1200,
    atk: 140,
    agi: 80,
    exp: 8000,
    imgIndex: 'd10',
    svg: `<img src="assets/monster_d10.png" style="width:100%; height:100%; object-fit:contain; object-position:bottom; filter: brightness(0.7) opacity(0.8); transform: scale(1.1); image-rendering: pixelated;" />`,
    deepOnly: true
});

MONSTERS.push({
    name: "バンシー",
    level: 13,
    hp: 1500,
    atk: 120,
    agi: 90,
    exp: 10000,
    imgIndex: 'd11',
    svg: `<img src="assets/monster_d11.png" style="width:100%; height:100%; object-fit:contain; object-position:bottom; filter: hue-rotate(180deg) saturate(1.2); transform: scale(1.2); image-rendering: pixelated;" />`,
    deepOnly: true
});

MONSTERS.push({
    name: "ジャイアントスケルトン",
    level: 12,
    hp: 1800,
    atk: 180,
    agi: 30,
    exp: 12000,
    imgIndex: 'd12',
    svg: `<img src="assets/monster_d12.png" style="width:100%; height:100%; object-fit:contain; object-position:bottom; filter: hue-rotate(180deg) saturate(1.2); transform: scale(1.2); image-rendering: pixelated;" />`,
    deepOnly: true
});

MONSTERS.push({
    name: "ジャイアントゾンビ",
    level: 11,
    hp: 1100,
    atk: 100,
    agi: 10,
    exp: 9000,
    imgIndex: 'd13',
    svg: `<img src="assets/monster_d13.png" style="width:100%; height:100%; object-fit:contain; object-position:bottom; filter: hue-rotate(180deg) saturate(1.2); transform: scale(1.2); image-rendering: pixelated;" />`,
    deepOnly: true
});