export class Tile {
  index: number;
  sprite: number;
  constructor(index: number, sprite: number) {
    this.index = index;
    this.sprite = sprite;
  }
}

export enum TileType {
  Empty,
  Wall,
  Ground,
  Point,
  Box,
  BoxReady,
  Player,
  PlayerDisable,
  ArrowRight,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  HitRight,
  HitLeft,
  HitUp,
  HitDown
}