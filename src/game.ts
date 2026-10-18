/* eslint-disable prefer-const, @typescript-eslint/no-explicit-any */
import type { Game, InitApi, UpdateApi } from "@clockwyrks/simple-2d";
import type { DeepReadonly } from "ts-essentials";
import * as C from "./constants";
export type {
  EnemyId,
  GemTier,
  OfferId,
  PassiveId,
  PickupKind,
  WeaponId,
} from "./constants";
import type {
  EnemyId,
  GemTier,
  OfferId,
  PassiveId,
  PickupKind,
  WeaponId,
} from "./constants";

export type Screen =
  | "title"
  | "howto"
  | "almanac"
  | "playing"
  | "levelup"
  | "chest"
  | "paused"
  | "fallen"
  | "dawn";
export type Facing = "left" | "right";
export type ZoneKind =
  "puddle" | "lantern" | "aura" | "slash" | "strike" | "burst";
export type NextDrop = "bread" | "draft" | "none";
export type ChestResult =
  | { readonly kind: "evolve"; readonly weapon: WeaponId }
  | {
      readonly kind: "level";
      readonly item: WeaponId | PassiveId;
      readonly level: number;
    }
  | { readonly kind: "heal" };
export interface PlayerState {
  readonly x: number;
  readonly y: number;
  readonly facing: Facing;
  readonly hp: number;
}
export interface WeaponSlot {
  readonly id: WeaponId;
  readonly level: number;
  readonly cooldown: number;
}
export interface PassiveSlot {
  readonly id: PassiveId;
  readonly level: number;
}
export interface EnemyState {
  readonly id: number;
  readonly type: EnemyId;
  readonly x: number;
  readonly y: number;
  readonly hp: number;
  readonly maxHp: number;
  readonly heading: { readonly x: number; readonly y: number };
  readonly age: number;
  readonly contactCooldown: number;
}
export interface EnemyHit {
  readonly enemy: number;
  readonly cooldown: number;
}
export interface ProjectileState {
  readonly id: number;
  readonly weapon: WeaponId;
  readonly x: number;
  readonly y: number;
  readonly vx: number;
  readonly vy: number;
  readonly ax: number;
  readonly ay: number;
  readonly radius: number;
  readonly damage: number;
  readonly ttl: number;
  readonly pierce: number;
  readonly hits: readonly EnemyHit[];
}
export interface ZoneState {
  readonly id: number;
  readonly weapon: WeaponId;
  readonly kind: ZoneKind;
  readonly x: number;
  readonly y: number;
  readonly radius: number;
  readonly width?: number;
  readonly height?: number;
  readonly damage: number;
  readonly ttl: number | null;
  readonly hits: readonly EnemyHit[];
}
export interface GemState {
  readonly id: number;
  readonly tier: GemTier;
  readonly x: number;
  readonly y: number;
  readonly attracted: boolean;
}
export interface PickupState {
  readonly id: number;
  readonly kind: PickupKind;
  readonly x: number;
  readonly y: number;
}
export interface RunState {
  readonly tick: number;
  readonly level: number;
  readonly xp: number;
  readonly kills: number;
  readonly player: PlayerState;
  readonly hurtFlash: number;
  readonly weapons: readonly WeaponSlot[];
  readonly passives: readonly PassiveSlot[];
  readonly enemies: readonly EnemyState[];
  readonly projectiles: readonly ProjectileState[];
  readonly zones: readonly ZoneState[];
  readonly gems: readonly GemState[];
  readonly pickups: readonly PickupState[];
  readonly offers: readonly OfferId[];
  readonly nextOffers: readonly OfferId[] | null;
  readonly pendingLevelUps: number;
  readonly chestResult: ChestResult | null;
  readonly spawnTimer: number;
  readonly firedEvents: readonly number[];
  readonly nextId: number;
  readonly nextSpawnAngle: number | null;
  readonly nextSwarmAngle: number | null;
  readonly nextSpawnType: EnemyId | null;
  readonly nextPuddleOffset: { readonly x: number; readonly y: number } | null;
  readonly nextStrikeTarget: number | null;
  readonly nextChestItem: WeaponId | PassiveId | null;
  readonly nextDrop: NextDrop | null;
}
export interface WickState {
  readonly screen: Screen;
  readonly menuIndex: number;
  readonly almanacTab: number;
  readonly almanacScroll: number;
  readonly run: RunState;
  readonly accumulator: number;
  readonly simTime: number;
  readonly muted: boolean;
  readonly spawning: boolean;
  readonly events: boolean;
  readonly despawning: boolean;
  readonly enemyMotion: boolean;
  readonly enemyContact: boolean;
  readonly weaponFire: boolean;
  readonly effectMotion: boolean;
  readonly drops: boolean;
  readonly progression: boolean;
}
export interface WickRect {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}
export interface WickSnapshot {
  readonly [key: string]: unknown;
}
type S = DeepReadonly<WickState>;
const cp = (s: S) => structuredClone(s) as WickState;
const idle = (): RunState => ({
  tick: 0,
  level: 1,
  xp: 0,
  kills: 0,
  player: { x: 0, y: 0, facing: "right", hp: C.BASE_MAX_HP },
  hurtFlash: 0,
  weapons: [],
  passives: [],
  enemies: [],
  projectiles: [],
  zones: [],
  gems: [],
  pickups: [],
  offers: [],
  nextOffers: null,
  pendingLevelUps: 0,
  chestResult: null,
  spawnTimer: 0,
  firedEvents: [],
  nextId: 0,
  nextSpawnAngle: null,
  nextSwarmAngle: null,
  nextSpawnType: null,
  nextPuddleOffset: null,
  nextStrikeTarget: null,
  nextChestItem: null,
  nextDrop: null,
});
const start = (muted = false): WickState => ({
  screen: "title",
  menuIndex: 0,
  almanacTab: 0,
  almanacScroll: 0,
  run: idle(),
  accumulator: 0,
  simTime: 0,
  muted,
  spawning: true,
  events: true,
  despawning: true,
  enemyMotion: true,
  enemyContact: true,
  weaponFire: true,
  effectMotion: true,
  drops: true,
  progression: true,
});
const passive = (s: S, id: PassiveId) =>
  s.run.passives.find((p) => p.id === id)?.level ?? 0;
const derived = (s: S) => ({
  maxHp: C.BASE_MAX_HP + C.TALLOW_HP_PER_LEVEL * passive(s, "tallow"),
  armor: C.BRASS_ARMOR_PER_LEVEL * passive(s, "brass"),
  move: C.MOVE_SPEED * (1 + C.BELLOWS_SPEED_PER_LEVEL * passive(s, "bellows")),
  pickup: C.PICKUP_RADIUS * (1 + C.LURE_PICKUP_PER_LEVEL * passive(s, "lure")),
  damage: 1 + C.WICK_DAMAGE_PER_LEVEL * passive(s, "wick"),
  area: 1 + C.GLASS_AREA_PER_LEVEL * passive(s, "glass"),
  cool: 1 - C.OIL_COOLDOWN_PER_LEVEL * passive(s, "oil"),
  xp: 1 + C.SOOT_XP_PER_LEVEL * passive(s, "soot"),
  recovery:
    C.BASE_RECOVERY + C.TINDER_RECOVERY_PER_LEVEL * passive(s, "tinder"),
});
const norm = (x: number, y: number, f = { x: 1, y: 0 }) => {
  const d = Math.hypot(x, y);
  return d ? { x: x / d, y: y / d } : f;
};
const dist = (a: { x: number; y: number }, b: { x: number; y: number }) =>
  Math.hypot(a.x - b.x, a.y - b.y);
const validNum = (n: number, min = -Infinity) => {
  if (!Number.isFinite(n) || n < min) throw new RangeError("invalid number");
};
const integer = (n: number, min: number, max = Infinity) => {
  if (!Number.isInteger(n) || n < min || n > max)
    throw new RangeError("invalid integer");
};
const setRun = (s: S, v: Partial<RunState>): WickState => {
  const n = cp(s);
  return { ...n, run: { ...n.run, ...v } };
};
const idx = (xs: readonly { id: number }[], id: number) => {
  const i = xs.findIndex((x) => x.id === id);
  if (i < 0) throw new RangeError("unknown entity");
  return i;
};
const entries = (tab: number): readonly string[] =>
  tab === 0
    ? [...C.BASE_WEAPON_IDS, ...C.EVOLUTION_IDS]
    : tab === 1
      ? C.PASSIVE_IDS
      : tab === 2
        ? C.ENEMY_IDS
        : [...C.GEM_TIERS, ...C.PICKUP_KINDS];
const pool = (s: S): OfferId[] => {
  const a: OfferId[] = [];
  for (const id of C.BASE_WEAPON_IDS) {
    const w = s.run.weapons.find((x) => x.id === id);
    if (w?.level && w.level < C.MAX_WEAPON_LEVEL) a.push(id);
    else if (!w && s.run.weapons.length < C.WEAPON_SLOTS) a.push(id);
  }
  for (const id of C.PASSIVE_IDS) {
    const p = s.run.passives.find((x) => x.id === id);
    if (p?.level && p.level < C.PASSIVES[id].maxLevel) a.push(id);
    else if (!p && s.run.passives.length < C.PASSIVE_SLOTS) a.push(id);
  }
  return a;
};
const rects = (s: S): WickRect[] => {
  let n =
    s.screen === "title"
      ? 3
      : s.screen === "levelup"
        ? s.run.offers.length
        : s.screen === "paused" || s.screen === "fallen" || s.screen === "dawn"
          ? 2
          : s.screen === "howto" || s.screen === "chest"
            ? 1
            : s.screen === "almanac"
              ? Math.min(
                  C.ALMANAC_ROWS,
                  entries(s.almanacTab).length - s.almanacScroll,
                )
              : 0;
  return Array.from({ length: n }, (_, i) => ({
    x: 380,
    y: 270 + i * 54,
    width: 520,
    height: 44,
  }));
};
const spawn = (s: S, type: EnemyId, x: number, y: number) => {
  if (!C.ENEMY_IDS.includes(type)) throw new RangeError("enemy");
  const e = C.ENEMIES[type],
    scale =
      e.rank === "common"
        ? 1 + C.HP_SCALE_PER_MINUTE * Math.floor(s.run.tick / C.TICK_HZ / 60)
        : 1,
    h = norm(s.run.player.x - x, s.run.player.y - y, {
      x: s.run.player.facing === "right" ? 1 : -1,
      y: 0,
    });
  return setRun(s, {
    enemies: [
      ...s.run.enemies,
      {
        id: s.run.nextId,
        type,
        x,
        y,
        hp: e.hp * scale,
        maxHp: e.hp * scale,
        heading: h,
        age: 0,
        contactCooldown: 0,
      },
    ],
    nextId: s.run.nextId + 1,
  });
};
const choose = (s: S, i: number) => {
  integer(i, 0, s.run.offers.length - 1);
  let n = cp(s),
    r = n.run,
    id = r.offers[i];
  if (id === C.LAMP_OIL_ID)
    r = {
      ...r,
      player: {
        ...r.player,
        hp: Math.min(derived(n).maxHp, r.player.hp + C.LAMP_OIL_HEAL),
      },
    };
  else if (C.PASSIVE_IDS.includes(id as PassiveId)) {
    const ps = [...r.passives],
      j = ps.findIndex((p) => p.id === id);
    if (j < 0) ps.push({ id: id as PassiveId, level: 1 });
    else ps[j] = { ...ps[j], level: ps[j].level + 1 };
    r = {
      ...r,
      passives: ps,
      player:
        id === "tallow"
          ? { ...r.player, hp: r.player.hp + C.TALLOW_HP_PER_LEVEL }
          : r.player,
    };
  } else {
    const ws = [...r.weapons],
      j = ws.findIndex((w) => w.id === id);
    if (j < 0) ws.push({ id: id as WeaponId, level: 1, cooldown: 0 });
    else ws[j] = { ...ws[j], level: ws[j].level + 1 };
    r = { ...r, weapons: ws };
  }
  const pending = r.pendingLevelUps - 1;
  if (pending > 0) {
    const t = { ...n, run: { ...r, pendingLevelUps: pending } },
      p = pool(t);
    return {
      ...t,
      screen: "levelup" as const,
      menuIndex: 0,
      run: {
        ...t.run,
        offers: p.sort(() => Math.random() - 0.5).slice(0, 3),
        nextOffers: null,
      },
    };
  }
  return {
    ...n,
    screen: "playing" as const,
    menuIndex: 0,
    run: { ...r, pendingLevelUps: 0, offers: [] },
  };
};

export interface WickDebugApi {
  readonly version: number;
  reset(s: S): WickState;
  snapshot(s: S): WickSnapshot;
  reconcile(s: S): WickState;
  menuRects(s: S): readonly WickRect[];
  tabRects(s: S): readonly WickRect[];
  setScreen(s: S, n: Screen): WickState;
  choose(s: S, i: number): WickState;
  setSpawning(s: S, on: boolean): WickState;
  setEvents(s: S, on: boolean): WickState;
  setDespawning(s: S, on: boolean): WickState;
  setEnemyMotion(s: S, on: boolean): WickState;
  setEnemyContact(s: S, on: boolean): WickState;
  setWeaponFire(s: S, on: boolean): WickState;
  setEffectMotion(s: S, on: boolean): WickState;
  setDrops(s: S, on: boolean): WickState;
  setProgression(s: S, on: boolean): WickState;
  setTick(s: S, n: number): WickState;
  setSpawnTimer(s: S, n: number): WickState;
  setNextSpawnAngle(s: S, n: number): WickState;
  setNextSwarmAngle(s: S, n: number): WickState;
  setNextSpawnType(s: S, id: EnemyId): WickState;
  setNextPuddleOffset(s: S, x: number, y: number): WickState;
  setNextStrikeTarget(s: S, id: number): WickState;
  setNextChestItem(s: S, id: WeaponId | PassiveId): WickState;
  setNextDrop(s: S, k: NextDrop): WickState;
  rollDrop(s: S): NextDrop;
  setPlayerPosition(s: S, x: number, y: number): WickState;
  setFacing(s: S, f: Facing): WickState;
  setHp(s: S, n: number): WickState;
  setLevel(s: S, n: number): WickState;
  setXp(s: S, n: number): WickState;
  setKills(s: S, n: number): WickState;
  setPendingLevelUps(s: S, n: number): WickState;
  setNextOffers(s: S, ids: readonly OfferId[]): WickState;
  setWeapon(s: S, slot: number, id: WeaponId, level: number): WickState;
  setWeaponCooldown(s: S, slot: number, n: number): WickState;
  removeWeapon(s: S, slot: number): WickState;
  setPassive(s: S, slot: number, id: PassiveId, level: number): WickState;
  removePassive(s: S, slot: number): WickState;
  spawnEnemy(s: S, t: EnemyId, x: number, y: number): WickState;
  setEnemyPosition(s: S, id: number, x: number, y: number): WickState;
  setEnemyHp(s: S, id: number, hp: number): WickState;
  setEnemyHeading(s: S, id: number, x: number, y: number): WickState;
  setEnemyAge(s: S, id: number, n: number): WickState;
  setEnemyContactCooldown(s: S, id: number, n: number): WickState;
  removeEnemy(s: S, id: number): WickState;
  clearEnemies(s: S): WickState;
  spawnProjectile(
    s: S,
    w: "ember" | "pin" | "shard" | "sconce" | "beacon" | "hail",
    x: number,
    y: number,
    vx: number,
    vy: number,
    p: number,
  ): WickState;
  clearProjectiles(s: S): WickState;
  spawnPuddle(s: S, w: "oil-splash" | "blaze", x: number, y: number): WickState;
  clearZones(s: S): WickState;
  spawnGem(s: S, t: GemTier, x: number, y: number): WickState;
  setGemAttracted(s: S, id: number, on: boolean): WickState;
  clearGems(s: S): WickState;
  spawnPickup(s: S, k: PickupKind, x: number, y: number): WickState;
  clearPickups(s: S): WickState;
}
const debug: WickDebugApi = {
  version: C.WICK_DEBUG_VERSION,
  reset: (s) => start(s.muted),
  snapshot: (s) => {
    const d = derived(s);
    return {
      version: 1,
      screen: s.screen,
      menuIndex: s.menuIndex,
      almanacTab: s.almanacTab,
      almanacScroll: s.almanacScroll,
      spawning: s.spawning,
      events: s.events,
      despawning: s.despawning,
      enemyMotion: s.enemyMotion,
      enemyContact: s.enemyContact,
      weaponFire: s.weaponFire,
      effectMotion: s.effectMotion,
      drops: s.drops,
      progression: s.progression,
      run: {
        ...cp(s).run,
        time: s.run.tick / C.TICK_HZ,
        xpToNext: C.XP_BASE + C.XP_STEP * (s.run.level - 1),
        maxHp: d.maxHp,
        armor: d.armor,
        moveSpeed: d.move,
        pickupRadius: d.pickup,
        spawnWindow: Math.min(
          19,
          Math.floor(s.run.tick / C.TICK_HZ / C.SPAWN_WINDOW),
        ),
        aliveCommons: s.run.enemies.filter(
          (e) => C.ENEMIES[e.type].rank === "common" && e.type !== "gnat",
        ).length,
        pool: s.screen === "levelup" ? pool(s) : [],
      },
      muted: s.muted,
      accumulator: s.accumulator,
      simTime: s.simTime,
    };
  },
  reconcile: cp,
  menuRects: rects,
  tabRects: (s) =>
    s.screen === "almanac"
      ? C.ALMANAC_TABS.map((_, i) => ({
          x: 260 + i * 190,
          y: 130,
          width: 170,
          height: 42,
        }))
      : [],
  setScreen: (s, n) => ({
    ...cp(s),
    screen: n,
    menuIndex: 0,
    almanacTab: 0,
    almanacScroll: 0,
    accumulator: n === "playing" ? s.accumulator : 0,
  }),
  choose,
  setSpawning: (s, on) => ({ ...cp(s), spawning: on }),
  setEvents: (s, on) => ({ ...cp(s), events: on }),
  setDespawning: (s, on) => ({ ...cp(s), despawning: on }),
  setEnemyMotion: (s, on) => ({ ...cp(s), enemyMotion: on }),
  setEnemyContact: (s, on) => ({ ...cp(s), enemyContact: on }),
  setWeaponFire: (s, on) => ({ ...cp(s), weaponFire: on }),
  setEffectMotion: (s, on) => ({ ...cp(s), effectMotion: on }),
  setDrops: (s, on) => ({ ...cp(s), drops: on }),
  setProgression: (s, on) => ({ ...cp(s), progression: on }),
  setTick: (s, n) => (
    integer(n, 0, C.DAWN_TIME * C.TICK_HZ - 1),
    setRun(s, { tick: n })
  ),
  setSpawnTimer: (s, n) => (validNum(n, 0), setRun(s, { spawnTimer: n })),
  setNextSpawnAngle: (s, n) => (
    validNum(n, 0),
    n >= 360
      ? (() => {
          throw new RangeError("angle");
        })()
      : setRun(s, { nextSpawnAngle: n })
  ),
  setNextSwarmAngle: (s, n) => (
    validNum(n, 0),
    n >= 360
      ? (() => {
          throw new RangeError("angle");
        })()
      : setRun(s, { nextSwarmAngle: n })
  ),
  setNextSpawnType: (s, id) => setRun(s, { nextSpawnType: id }),
  setNextPuddleOffset: (s, x, y) =>
    Math.hypot(x, y) > C.OIL_SCATTER
      ? (() => {
          throw new RangeError("offset");
        })()
      : setRun(s, { nextPuddleOffset: { x, y } }),
  setNextStrikeTarget: (s, id) => (
    idx(s.run.enemies, id),
    setRun(s, { nextStrikeTarget: id })
  ),
  setNextChestItem: (s, id) => setRun(s, { nextChestItem: id }),
  setNextDrop: (s, k) => setRun(s, { nextDrop: k }),
  rollDrop: () =>
    Math.random() < C.BREAD_CHANCE
      ? "bread"
      : Math.random() < C.DRAFT_CHANCE
        ? "draft"
        : "none",
  setPlayerPosition: (s, x, y) =>
    setRun(s, { player: { ...s.run.player, x, y } }),
  setFacing: (s, f) => setRun(s, { player: { ...s.run.player, facing: f } }),
  setHp: (s, n) => (
    validNum(n),
    setRun(s, { player: { ...s.run.player, hp: n } })
  ),
  setLevel: (s, n) => (integer(n, 1), setRun(s, { level: n })),
  setXp: (s, n) => (validNum(n, 0), setRun(s, { xp: n })),
  setKills: (s, n) => (integer(n, 0), setRun(s, { kills: n })),
  setPendingLevelUps: (s, n) => (
    integer(n, 0),
    setRun(s, { pendingLevelUps: n })
  ),
  setNextOffers: (s, ids) => {
    if (ids.length < 1 || ids.length > 3 || new Set(ids).size !== ids.length)
      throw new RangeError("offers");
    return setRun(s, { nextOffers: [...ids] });
  },
  setWeapon: (s, slot, id, level) => {
    integer(slot, 0, Math.min(s.run.weapons.length, 5));
    integer(level, 1, C.BASE_WEAPON_IDS.includes(id as C.BaseWeaponId) ? 8 : 1);
    const a = [...s.run.weapons],
      old = a[slot];
    a[slot] = { id, level, cooldown: old?.id === id ? old.cooldown : 0 };
    return setRun(s, { weapons: a });
  },
  setWeaponCooldown: (s, slot, n) => {
    integer(slot, 0, s.run.weapons.length - 1);
    validNum(n, 0);
    const a = [...s.run.weapons];
    a[slot] = { ...a[slot], cooldown: n };
    return setRun(s, { weapons: a });
  },
  removeWeapon: (s, slot) => (
    integer(slot, 0, s.run.weapons.length - 1),
    setRun(s, {
      weapons: s.run.weapons.filter((_, i) => i !== slot) as WeaponSlot[],
    })
  ),
  setPassive: (s, slot, id, level) => {
    integer(slot, 0, Math.min(s.run.passives.length, 5));
    integer(level, 1, C.PASSIVES[id].maxLevel);
    const a = [...s.run.passives];
    a[slot] = { id, level };
    return setRun(s, { passives: a });
  },
  removePassive: (s, slot) => (
    integer(slot, 0, s.run.passives.length - 1),
    setRun(s, {
      passives: s.run.passives.filter((_, i) => i !== slot) as PassiveSlot[],
    })
  ),
  spawnEnemy: (s, t, x, y) => spawn(s, t, x, y),
  setEnemyPosition: (s, id, x, y) => editEnemy(s, id, (e) => ({ ...e, x, y })),
  setEnemyHp: (s, id, hp) => (
    validNum(hp, Number.MIN_VALUE),
    editEnemy(s, id, (e) => ({ ...e, hp }))
  ),
  setEnemyHeading: (s, id, x, y) => {
    if (!x && !y) throw new RangeError("heading");
    return editEnemy(s, id, (e) => ({ ...e, heading: norm(x, y) }));
  },
  setEnemyAge: (s, id, n) => (
    validNum(n, 0),
    editEnemy(s, id, (e) => ({ ...e, age: n }))
  ),
  setEnemyContactCooldown: (s, id, n) => (
    validNum(n, 0),
    editEnemy(s, id, (e) => ({ ...e, contactCooldown: n }))
  ),
  removeEnemy: (s, id) => (
    idx(s.run.enemies, id),
    setRun(s, {
      enemies: s.run.enemies.filter((e) => e.id !== id) as EnemyState[],
    })
  ),
  clearEnemies: (s) => setRun(s, { enemies: [] }),
  spawnProjectile: (s, w, x, y, vx, vy, p) => projectile(s, w, x, y, vx, vy, p),
  clearProjectiles: (s) => setRun(s, { projectiles: [] }),
  spawnPuddle: (s, w, x, y) => puddle(s, w, x, y),
  clearZones: (s) => setRun(s, { zones: [] }),
  spawnGem: (s, t, x, y) =>
    setRun(s, {
      gems: [
        ...s.run.gems,
        { id: s.run.nextId, tier: t, x, y, attracted: false },
      ],
      nextId: s.run.nextId + 1,
    }),
  setGemAttracted: (s, id, on) => {
    const a = [...s.run.gems],
      i = idx(a, id);
    a[i] = { ...a[i], attracted: on };
    return setRun(s, { gems: a });
  },
  clearGems: (s) => setRun(s, { gems: [] }),
  spawnPickup: (s, k, x, y) =>
    setRun(s, {
      pickups: [...s.run.pickups, { id: s.run.nextId, kind: k, x, y }],
      nextId: s.run.nextId + 1,
    }),
  clearPickups: (s) => setRun(s, { pickups: [] }),
};
function editEnemy(s: S, id: number, f: (e: EnemyState) => EnemyState) {
  const a = s.run.enemies.map((e) => ({ ...e, heading: { ...e.heading } })),
    i = idx(a, id);
  a[i] = f(a[i]);
  return setRun(s, { enemies: a });
}
function row(id: WeaponId, l = 1): any {
  return C.BASE_WEAPON_IDS.includes(id as C.BaseWeaponId)
    ? C.WEAPON_LEVELS[id as C.BaseWeaponId][l - 1]
    : id === "pyre"
      ? C.PYRE_STATS
      : id === "beacon"
        ? C.BEACON_STATS
        : id === "hail"
          ? C.HAIL_STATS
          : id === "chandelier"
            ? C.CHANDELIER_STATS
            : id === "corona"
              ? C.CORONA_STATS
              : C.BLAZE_STATS;
}
function projectile(
  s: S,
  w: "ember" | "pin" | "shard" | "sconce" | "beacon" | "hail",
  x: number,
  y: number,
  vx: number,
  vy: number,
  p: number,
) {
  integer(p, -1);
  if (p < 0 && p !== -1) throw new RangeError("pierce");
  if (w === "sconce" && !vx && !vy) throw new RangeError("velocity");
  const q = row(w, s.run.weapons.find((a) => a.id === w)?.level),
    d = derived(s),
    h = norm(vx, vy),
    z: ProjectileState = {
      id: s.run.nextId,
      weapon: w,
      x,
      y,
      vx,
      vy,
      ax: w === "sconce" ? -h.x * C.SCONCE_DECEL : 0,
      ay: w === "sconce" ? -h.y * C.SCONCE_DECEL : 0,
      radius: q.radius * d.area,
      damage: q.damage * d.damage,
      ttl: q.duration,
      pierce: p,
      hits: [],
    };
  return setRun(s, {
    projectiles: [...s.run.projectiles, z],
    nextId: s.run.nextId + 1,
  });
}
function puddle(s: S, w: "oil-splash" | "blaze", x: number, y: number) {
  const q = row(w, s.run.weapons.find((a) => a.id === w)?.level),
    d = derived(s),
    z: ZoneState = {
      id: s.run.nextId,
      weapon: w,
      kind: "puddle",
      x,
      y,
      radius: q.radius * d.area,
      damage: q.damage * d.damage,
      ttl: q.duration,
      hits: [],
    };
  return setRun(s, { zones: [...s.run.zones, z], nextId: s.run.nextId + 1 });
}

let art = new Map<string, ImageBitmap>();
const artPaths = () => {
  const p = new Set([
    C.LAMPLIGHTER_IDLE_PATH,
    C.GROUND_TILE_PATH,
    ...Object.values(C.GEM_PATHS),
    ...Object.values(C.PICKUP_PATHS),
    ...Object.values(C.ICON_PATHS),
  ]);
  for (let i = 0; i < 6; i++) p.add(`${C.LAMPLIGHTER_WALK_SHEET.dir}/${i}.png`);
  for (const id of C.ENEMY_IDS)
    for (let i = 0; i < 4; i++) p.add(`${C.ENEMY_SHEET_DIR}/${id}/${i}.png`);
  for (const e of Object.values(C.EFFECT_SPRITES))
    for (let i = 0; i < e.frames; i++)
      p.add(e.frames === 1 ? e.path : `${e.path}/${i}.png`);
  return [...p];
};
function beginRun(s: S) {
  const n = cp(s);
  return {
    ...n,
    screen: "playing" as const,
    menuIndex: 0,
    accumulator: 0,
    run: {
      ...idle(),
      weapons: [{ id: "taper" as const, level: 1, cooldown: 0 }],
    },
  };
}
function oneTick(s: WickState, m: { x: number; y: number }, api: UpdateApi) {
  let n = cp(s),
    r = n.run,
    d = derived(n),
    v = norm(m.x, m.y, { x: 0, y: 0 });
  r = {
    ...r,
    tick: r.tick + 1,
    hurtFlash: Math.max(0, r.hurtFlash - C.TICK_DT),
    player: {
      ...r.player,
      x: r.player.x + v.x * d.move * C.TICK_DT,
      y: r.player.y + v.y * d.move * C.TICK_DT,
      facing: v.x ? (v.x < 0 ? "left" : "right") : r.player.facing,
      hp: Math.min(d.maxHp, r.player.hp + d.recovery * C.TICK_DT),
    },
  };
  r = {
    ...r,
    enemies: r.enemies.map((e) => {
      const h =
        n.enemyMotion && C.ENEMIES[e.type].behavior !== "drift"
          ? norm(r.player.x - e.x, r.player.y - e.y, e.heading)
          : e.heading;
      return {
        ...e,
        x: n.enemyMotion
          ? e.x + h.x * C.ENEMIES[e.type].speed * C.TICK_DT
          : e.x,
        y: n.enemyMotion
          ? e.y + h.y * C.ENEMIES[e.type].speed * C.TICK_DT
          : e.y,
        heading: h,
        age: e.age + C.TICK_DT,
        contactCooldown: Math.max(0, e.contactCooldown - C.TICK_DT),
      };
    }),
  };
  if (n.weaponFire) {
    let pro = [...r.projectiles],
      zones = [...r.zones],
      next = r.nextId;
    const weapons = r.weapons.map((w) => {
      let cd = Math.max(0, w.cooldown - C.TICK_DT);
      if (cd <= C.TICK_EPSILON) {
        const q = row(w.id, w.level),
          f = r.player.facing === "right" ? 1 : -1;
        if (
          ["ember", "pin", "shard", "sconce", "beacon", "hail"].includes(w.id)
        ) {
          for (let i = 0; i < (q.amount ?? 1); i++) {
            const z = projectile(
              { ...n, run: { ...r, projectiles: pro, nextId: next } },
              w.id as "ember",
              r.player.x,
              r.player.y,
              f * q.speed,
              (i - (q.amount - 1) / 2) * 10,
              w.id === "shard" || w.id === "sconce" ? -1 : q.pierce,
            );
            pro = [...z.run.projectiles];
            next = z.run.nextId;
          }
        } else {
          const kind: ZoneKind =
            w.id === "taper" || w.id === "pyre"
              ? "slash"
              : w.id === "halo" || w.id === "corona"
                ? "aura"
                : w.id === "flare"
                  ? "burst"
                  : w.id === "spark"
                    ? "strike"
                    : "puddle";
          zones.push({
            id: next++,
            weapon: w.id,
            kind,
            x: r.player.x + ((q.width ?? 0) / 2) * f,
            y: r.player.y,
            radius: (q.radius ?? q.area ?? 0) * d.area,
            width: q.width ? q.width * d.area : undefined,
            height: q.height ? q.height * d.area : undefined,
            damage: q.damage * d.damage,
            ttl:
              kind === "aura"
                ? null
                : kind === "slash"
                  ? C.SLASH_FLASH
                  : kind === "burst"
                    ? C.FLARE_FLASH
                    : kind === "strike"
                      ? C.SPARK_FLASH
                      : q.duration,
            hits: [],
          });
        }
        cd = Math.max(C.MIN_COOLDOWN, (q.cooldown ?? 99) * d.cool);
        api.audio.play(C.CUES.hit);
      }
      return { ...w, cooldown: cd };
    });
    r = { ...r, weapons, projectiles: pro, zones, nextId: next };
  }
  r = {
    ...r,
    projectiles: r.projectiles
      .map((p) => ({
        ...p,
        x: n.effectMotion ? p.x + p.vx * C.TICK_DT : p.x,
        y: n.effectMotion ? p.y + p.vy * C.TICK_DT : p.y,
        vx: n.effectMotion ? p.vx + p.ax * C.TICK_DT : p.vx,
        vy: n.effectMotion ? p.vy + p.ay * C.TICK_DT : p.vy,
        ttl: p.ttl - C.TICK_DT,
      }))
      .filter((p) => p.ttl > 0),
    zones: r.zones
      .map((z) => ({ ...z, ttl: z.ttl === null ? null : z.ttl - C.TICK_DT }))
      .filter((z) => z.ttl === null || z.ttl > 0),
  };
  let enemies = r.enemies.map((e) => ({ ...e, heading: { ...e.heading } }));
  for (const p of r.projectiles)
    for (let i = 0; i < enemies.length; i++)
      if (dist(p, enemies[i]) < p.radius + C.ENEMIES[enemies[i].type].radius)
        enemies[i] = { ...enemies[i], hp: enemies[i].hp - p.damage };
  for (const z of r.zones)
    for (let i = 0; i < enemies.length; i++) {
      const e = enemies[i],
        hit =
          z.kind === "slash"
            ? Math.abs(e.x - z.x) <
                (z.width ?? 0) / 2 + C.ENEMIES[e.type].radius &&
              Math.abs(e.y - z.y) <
                (z.height ?? 0) / 2 + C.ENEMIES[e.type].radius
            : dist(z, e) < z.radius + C.ENEMIES[e.type].radius;
      if (hit) enemies[i] = { ...e, hp: e.hp - z.damage };
    }
  const dead = enemies.filter((e) => e.hp <= 0);
  let gems = [...r.gems],
    pickups = [...r.pickups],
    nid = r.nextId;
  for (const e of dead) {
    api.audio.play(C.CUES.kill);
    if (n.drops) {
      const q = C.ENEMIES[e.type].drop;
      if (q === "chest")
        pickups.push({ id: nid++, kind: "chest", x: e.x, y: e.y });
      else if (q)
        gems.push({ id: nid++, tier: q, x: e.x, y: e.y, attracted: false });
    }
  }
  r = {
    ...r,
    enemies: enemies.filter((e) => e.hp > 0),
    kills: r.kills + dead.length,
    gems,
    pickups,
    nextId: nid,
  };
  if (n.enemyContact) {
    let hp = r.player.hp,
      hit = false;
    r = {
      ...r,
      enemies: r.enemies.map((e) => {
        if (
          dist(e, r.player) < C.ENEMIES[e.type].radius + C.PLAYER_RADIUS &&
          e.contactCooldown <= 0
        ) {
          hp -= Math.max(
            C.MIN_DAMAGE_TAKEN,
            C.ENEMIES[e.type].damage - d.armor,
          );
          hit = true;
          return { ...e, contactCooldown: C.CONTACT_COOLDOWN };
        }
        return e;
      }),
      player: { ...r.player, hp },
      hurtFlash: hit ? C.HURT_FLASH : r.hurtFlash,
    };
    if (hit) api.audio.play(C.CUES.hurt);
  }
  let chest = false,
    xp = r.xp;
  const rp: PickupState[] = [];
  for (const p of r.pickups)
    if (dist(p, r.player) < C.PICKUP_ITEM_RADIUS + C.PLAYER_RADIUS) {
      if (p.kind === "bread")
        r = {
          ...r,
          player: {
            ...r.player,
            hp: Math.min(d.maxHp, r.player.hp + C.BREAD_HEAL),
          },
        };
      else if (p.kind === "draft")
        gems = gems.map((g) => ({ ...g, attracted: true }));
      else chest = true;
      api.audio.play(C.CUES.pickup);
    } else rp.push(p);
  const rg: GemState[] = [];
  for (const x of gems) {
    let g = { ...x, attracted: x.attracted || dist(x, r.player) <= d.pickup };
    if (g.attracted) {
      const h = norm(r.player.x - g.x, r.player.y - g.y),
        z = Math.min(C.GEM_SPEED * C.TICK_DT, dist(g, r.player));
      g = { ...g, x: g.x + h.x * z, y: g.y + h.y * z };
    }
    if (dist(g, r.player) <= C.COLLECT_RADIUS) {
      xp += C.GEM_VALUES[g.tier] * d.xp;
      api.audio.play(C.CUES.gem);
    } else rg.push(g);
  }
  let level = r.level,
    pending = r.pendingLevelUps;
  if (n.progression)
    while (xp >= C.XP_BASE + C.XP_STEP * (level - 1)) {
      xp -= C.XP_BASE + C.XP_STEP * (level - 1);
      level++;
      pending++;
      api.audio.play(C.CUES.levelUp);
    }
  r = {
    ...r,
    pickups: rp,
    gems: rg,
    xp,
    level,
    pendingLevelUps: pending,
    chestResult: chest ? { kind: "heal" } : r.chestResult,
  };
  if (n.spawning) {
    let t = r.spawnTimer - C.TICK_DT;
    if (t <= 0) {
      const wi = Math.min(19, Math.floor(r.tick / C.TICK_HZ / C.SPAWN_WINDOW)),
        w = C.SPAWN_WINDOWS[wi],
        a = ((r.nextSpawnAngle ?? Math.random() * 360) * Math.PI) / 180,
        type =
          r.nextSpawnType && w.types.includes(r.nextSpawnType)
            ? r.nextSpawnType
            : w.types[Math.floor(Math.random() * w.types.length)],
        z = spawn(
          { ...n, run: r },
          type,
          r.player.x + Math.cos(a) * C.SPAWN_DISTANCE,
          r.player.y + Math.sin(a) * C.SPAWN_DISTANCE,
        );
      r = { ...z.run, nextSpawnAngle: null, nextSpawnType: null };
      t = w.interval;
    }
    r = { ...r, spawnTimer: t };
  }
  n = { ...n, run: r };
  if (r.tick >= C.DAWN_TIME * C.TICK_HZ)
    return { ...n, screen: "dawn" as const, accumulator: 0 };
  if (r.player.hp <= 0)
    return { ...n, screen: "fallen" as const, accumulator: 0 };
  if (chest) return { ...n, screen: "chest" as const, accumulator: 0 };
  if (pending > 0) {
    const p = pool(n),
      o: OfferId[] =
        r.nextOffers && r.nextOffers.every((x) => p.includes(x))
          ? [...r.nextOffers]
          : p.sort(() => Math.random() - 0.5).slice(0, 3);
    return {
      ...n,
      screen: "levelup" as const,
      accumulator: 0,
      run: { ...r, offers: o.length ? o : [C.LAMP_OIL_ID], nextOffers: null },
    } as WickState;
  }
  return n;
}

export const BACKGROUND = "#080b18";
export const game: Game<WickState, WickDebugApi> = {
  async initialize(api: InitApi<WickState>) {
    for (const a of C.ACTIONS)
      api.input.register(a, { keys: [...C.BINDINGS[a]] });
    art = new Map(
      await Promise.all(
        artPaths().map(
          async (p) => [p, await api.assets.loadImage(p)] as const,
        ),
      ),
    );
    await Promise.all(
      Object.entries(C.CUE_PATHS).map(([k, p]) => api.audio.load(k, p)),
    );
    for (const [name, read] of [
      ["screen", (s: S) => s.screen],
      ["clock", (s: S) => (s.run.tick / C.TICK_HZ).toFixed(1)],
      ["level", (s: S) => s.run.level],
      ["hp", (s: S) => s.run.player.hp.toFixed(0)],
      ["kills", (s: S) => s.run.kills],
      ["enemies", (s: S) => s.run.enemies.length],
      ["effects", (s: S) => s.run.projectiles.length + s.run.zones.length],
      ["gems", (s: S) => s.run.gems.length],
    ] as const)
      api.diagnostics.register(name, read);
    return [start(), debug];
  },
  update(state, api, dt) {
    let n = cp(state);
    n = { ...n, simTime: n.simTime + dt };
    if (api.input.pressed("mute")) api.audio.setMuted(!api.audio.muted());
    n = { ...n, muted: api.audio.muted() };
    const was = n.screen,
      up = api.input.pressed("up"),
      down = api.input.pressed("down"),
      confirm = api.input.pressed("confirm"),
      back = api.input.pressed("back"),
      pause = api.input.pressed("pause"),
      count = rects(n).length;
    if ((up || down) && count)
      n = { ...n, menuIndex: (n.menuIndex + (up ? -1 : 1) + count) % count };
    if (was === "title" && confirm)
      n =
        n.menuIndex === 0
          ? beginRun(n)
          : {
              ...n,
              screen: n.menuIndex === 1 ? "almanac" : "howto",
              menuIndex: 0,
            };
    else if ((was === "howto" || was === "almanac") && back)
      n = { ...n, screen: "title", menuIndex: was === "almanac" ? 1 : 2 };
    else if (was === "levelup" && confirm) n = choose(n, n.menuIndex);
    else if (was === "chest" && confirm)
      n = { ...n, screen: "playing", run: { ...n.run, chestResult: null } };
    else if (was === "playing" && pause)
      n = { ...n, screen: "paused", menuIndex: 0 };
    else if (was === "paused" && (pause || confirm))
      n = n.menuIndex === 0 ? { ...n, screen: "playing" } : start(n.muted);
    else if ((was === "fallen" || was === "dawn") && confirm)
      n = n.menuIndex === 0 ? beginRun(n) : start(n.muted);
    for (const cue of [C.CUES.music, C.CUES.hum]) {
      if (n.screen === "playing" && !api.audio.looping(cue))
        api.audio.loop(cue);
      else if (n.screen !== "playing") api.audio.stop(cue);
    }
    if (n.screen !== "playing") return { ...n, accumulator: 0 };
    let acc = n.accumulator + dt,
      m = {
        x: api.input.value("right") - api.input.value("left"),
        y: api.input.value("down") - api.input.value("up"),
      };
    while (acc >= C.TICK_DT - C.TICK_EPSILON && n.screen === "playing") {
      acc -= C.TICK_DT;
      n = oneTick(n, m, api);
    }
    return {
      ...n,
      accumulator:
        n.screen === "playing" && Math.abs(acc) > C.TICK_EPSILON ? acc : 0,
    };
  },
  render(s, api) {
    draw(s, api.ctx);
  },
};
const label = (
  c: CanvasRenderingContext2D,
  t: string,
  x: number,
  y: number,
  z = 24,
  color = "#f5ddaa",
) => {
  c.fillStyle = color;
  c.font = `${z}px Georgia,serif`;
  c.textAlign = "center";
  c.fillText(t, x, y);
};
function draw(s: S, c: CanvasRenderingContext2D) {
  c.imageSmoothingEnabled = false;
  const p = s.run.player,
    tile = art.get(C.GROUND_TILE_PATH);
  if (tile)
    for (
      let x = Math.floor((p.x - C.STAGE_CX) / 64) * 64;
      x < p.x + C.STAGE_CX;
      x += 64
    )
      for (
        let y = Math.floor((p.y - C.STAGE_CY) / 64) * 64;
        y < p.y + C.STAGE_CY;
        y += 64
      )
        c.drawImage(tile, x - p.x + C.STAGE_CX, y - p.y + C.STAGE_CY, 64, 64);
  const xy = (x: number, y: number) => ({
    x: x - p.x + C.STAGE_CX,
    y: y - p.y + C.STAGE_CY,
  });
  for (const g of s.run.gems) {
    const q = xy(g.x, g.y),
      z = C.GEM_SPRITE_SIZES[g.tier],
      im = art.get(C.GEM_PATHS[g.tier]);
    if (im) c.drawImage(im, q.x - z / 2, q.y - z / 2, z, z);
  }
  for (const z of [...s.run.zones, ...s.run.projectiles]) {
    const q = xy(z.x, z.y),
      e = C.EFFECT_SPRITES[z.weapon],
      im = art.get(e.frames === 1 ? e.path : `${e.path}/0.png`),
      w = "width" in z && z.width ? z.width : z.radius * 2,
      h = "height" in z && z.height ? z.height : z.radius * 2;
    if (im) c.drawImage(im, q.x - w / 2, q.y - h / 2, w, h);
  }
  for (const e of s.run.enemies) {
    const q = xy(e.x, e.y),
      im = art.get(
        `${C.ENEMY_SHEET_DIR}/${e.type}/${Math.floor(e.age / 0.1) % 4}.png`,
      ),
      z = C.ENEMIES[e.type].radius * 2;
    if (im) c.drawImage(im, q.x - z / 2, q.y - z / 2, z, z);
  }
  for (const u of s.run.pickups) {
    const q = xy(u.x, u.y),
      im = art.get(C.PICKUP_PATHS[u.kind]);
    if (im) c.drawImage(im, q.x - 12, q.y - 12, 24, 24);
  }
  if (!["title", "howto", "almanac"].includes(s.screen)) {
    const im = art.get(C.LAMPLIGHTER_IDLE_PATH);
    if (im) c.drawImage(im, C.STAGE_CX - 12, C.STAGE_CY - 16, 24, 32);
    c.fillStyle = "#1b1b2c";
    c.fillRect(24, 24, 300, 20);
    c.fillStyle = "#b84a59";
    c.fillRect(
      27,
      27,
      294 * Math.max(0, s.run.player.hp / derived(s).maxHp),
      14,
    );
    label(
      c,
      `${Math.floor(s.run.tick / C.TICK_HZ / 60)
        .toString()
        .padStart(2, "0")}:${Math.floor((s.run.tick / C.TICK_HZ) % 60)
        .toString()
        .padStart(2, "0")}`,
      C.STAGE_CX,
      42,
      22,
    );
  }
  if (s.screen !== "playing") {
    c.fillStyle = "rgba(5,7,18,.92)";
    c.fillRect(220, 80, 840, 560);
    c.strokeStyle = "#b88a45";
    c.strokeRect(228, 88, 824, 544);
    const head =
      s.screen === "title"
        ? C.TITLE_TEXT
        : s.screen === "howto"
          ? "HOW TO PLAY"
          : s.screen === "almanac"
            ? C.ALMANAC_TEXT
            : s.screen === "levelup"
              ? C.LEVEL_UP_TEXT
              : s.screen === "chest"
                ? C.CHEST_TEXT
                : s.screen === "paused"
                  ? C.PAUSED_TEXT
                  : s.screen === "fallen"
                    ? C.FALLEN_TEXT
                    : C.DAWN_TEXT;
    label(c, head, C.STAGE_CX, 160, s.screen === "title" ? 72 : 40);
    if (s.screen === "howto")
      [
        "MOVE — WASD / ARROWS",
        "SURVIVE UNTIL DAWN",
        "TOOLS FIRE AUTOMATICALLY",
        "P — PAUSE   M — MUTE",
        "ESC — RETURN",
      ].forEach((x, i) => label(c, x, C.STAGE_CX, 260 + i * 48, 21));
    else if (s.screen === "almanac") {
      C.ALMANAC_TABS.forEach((x, i) =>
        label(
          c,
          x,
          355 + i * 190,
          200,
          18,
          i === s.almanacTab ? "#ffe58c" : "#8d846e",
        ),
      );
      entries(s.almanacTab)
        .slice(0, 10)
        .forEach((x, i) =>
          label(c, x.toUpperCase(), C.STAGE_CX, 250 + i * 32, 17),
        );
    } else {
      const items: readonly string[] =
        s.screen === "title"
          ? C.TITLE_ITEMS
          : s.screen === "paused"
            ? C.PAUSE_ITEMS
            : s.screen === "fallen" || s.screen === "dawn"
              ? C.END_ITEMS
              : s.screen === "levelup"
                ? s.run.offers.map(String)
                : s.screen === "chest"
                  ? ["CONTINUE"]
                  : [];
      items.forEach((x, i) =>
        label(
          c,
          (i === s.menuIndex ? "◆  " : "") + x,
          C.STAGE_CX,
          300 + i * 54,
          23,
          i === s.menuIndex ? "#ffe58c" : "#c9bda4",
        ),
      );
    }
  }
}
