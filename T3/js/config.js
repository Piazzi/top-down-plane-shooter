import { spawnEnemy } from "./enemy.js";
import { spawnHealthpack } from "./healthpack.js";

// game configurations, changes how the game works
export const OFF_SCREEN_TOP = 30;
export const OFF_SCREEN_BOTTOM = -45;
export const OFF_SCREEN_LEFT = -45;
export const OFF_SCREEN_RIGHT = 45;
export const SCREEN_LEFT_EDGE = -30;
export const SCREEN_RIGHT_EDGE = 30;
export const SCREEN_TOP_EDGE = 20;
export const SCREEN_BOTTOM_EDGE = -15;
export var HEIGHT = 10;
export const SPAWN_TYPE_1_ENEMY_INTERVAL = 3000; //  spawns every x milliseconds
export const SPAWN_TYPE_2_ENEMY_INTERVAL = 5000;
export const SPAWN_TYPE_3_ENEMY_INTERVAL = 5000;
export const SPAWN_TYPE_4_ENEMY_INTERVAL = 8000;
export const SPAWN_TYPE_5_ENEMY_INTERVAL = 6000;
export const SPAWN_HEALTHPACK_INTERVAL = 15000;
export const SHOOT_COOLDOWN = 500; // decresase every X milliseconds
export const MIN_ENEMY_SPEED = -0.1;
export const MAX_ENEMY_SPEED = -0.3;
export const GROUND_ENEMY_SPEED = -0.06;
export const ENEMY_PROJECTILE_SPEED = 0.3;
export const PLAYER_PROJECTILE_SPEED = 0.9;
export const PLAYER_SPEED = 30;
export const PLANE_SPEED = 0.1;
export var GROUND_ENEMY_POSITION = 1.5;
export let ENEMY_1_INTERVAL_HANDLER;
export let ENEMY_2_INTERVAL_HANDLER;
export let ENEMY_3_INTERVAL_HANDLER;
export let ENEMY_4_INTERVAL_HANDLER;
export let ENEMY_5_INTERVAL_HANDLER;
export let HEALTHPACK_INTERVAL_HANDLER;
export let HEALTHPACK_TIMEOUT_HANDLER;
export let ENEMY_1_TIMEOUT_HANDLER;
export let ENEMY_2_TIMEOUT_HANDLER;
export let ENEMY_3_TIMEOUT_HANDLER;
export let ENEMY_4_TIMEOUT_HANDLER;
export let ENEMY_5_TIMEOUT_HANDLER;
const SPAWN_TYPE_1_ENEMY_AFTER = 1000; //  spawns after X milliseconds passed on clock
const SPAWN_TYPE_2_ENEMY_AFTER = 10000;
const SPAWN_TYPE_3_ENEMY_AFTER = 30000;
const SPAWN_TYPE_4_ENEMY_AFTER = 60000;
const SPAWN_TYPE_5_ENEMY_AFTER = 1000;
const SPAWN_HEALTHPACK_AFTER = 15000;

export function resetTimeouts() {
  HEALTHPACK_TIMEOUT_HANDLER = setTimeout(() => {
    HEALTHPACK_INTERVAL_HANDLER = setInterval(
      spawnHealthpack,
      SPAWN_HEALTHPACK_INTERVAL
    );
  }, SPAWN_HEALTHPACK_AFTER);

  ENEMY_1_TIMEOUT_HANDLER = setTimeout(() => {
    ENEMY_1_INTERVAL_HANDLER = setInterval(() => {
      spawnEnemy(1);
    }, SPAWN_TYPE_1_ENEMY_INTERVAL);
  }, SPAWN_TYPE_1_ENEMY_AFTER);

  ENEMY_2_TIMEOUT_HANDLER = setTimeout(() => {
    ENEMY_2_INTERVAL_HANDLER = setInterval(() => {
      spawnEnemy(2);
    }, SPAWN_TYPE_2_ENEMY_INTERVAL);
  }, SPAWN_TYPE_2_ENEMY_AFTER);

  ENEMY_3_TIMEOUT_HANDLER = setTimeout(() => {
    ENEMY_3_INTERVAL_HANDLER = setInterval(() => {
      spawnEnemy(3);
    }, SPAWN_TYPE_3_ENEMY_INTERVAL);
  }, SPAWN_TYPE_3_ENEMY_AFTER);

  ENEMY_4_TIMEOUT_HANDLER = setTimeout(() => {
    ENEMY_4_INTERVAL_HANDLER = setInterval(() => {
      spawnEnemy(4);
    }, SPAWN_TYPE_4_ENEMY_INTERVAL);
  }, SPAWN_TYPE_4_ENEMY_AFTER);

  ENEMY_5_TIMEOUT_HANDLER = setTimeout(() => {
    ENEMY_5_INTERVAL_HANDLER = setInterval(() => {
      spawnEnemy(5);
    }, SPAWN_TYPE_5_ENEMY_INTERVAL);
  }, SPAWN_TYPE_5_ENEMY_AFTER);
}

resetTimeouts();
