import { Component } from '@angular/core';
import { Http, Response } from '@angular/http';
import { map } from 'rxjs/operators';
import { Tile, TileType } from 'src/app/tile';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  tiles: string = "./assets/Tiles/";

  level: Tile[][];

  points: boolean[][];

  levelState: number[] = new Array();

  player: number;

  makeAction: boolean = false;

  validateEnter: number = 0;

  constructor(private http: Http) {
    http.get("level1.json").subscribe(res => {
      const matrix: number[][] = res.json().levels;
      this.level = [];
      this.points = [];
      for (let x = 0; x < matrix.length; x++) {
        this.level[x] = [];
        this.points[x] = [];
        for (let y = 0; y < matrix[0].length; y++) {
          const index = x * matrix[0].length + y;
          this.level[x][y] = new Tile(index, matrix[x][y]);
          this.levelState[index] = matrix[x][y];
          if (this.level[x][y].sprite == TileType.Player) {
            this.player = this.level[x][y].index;
            this.points[x][y] = false;
          } else if (this.level[x][y].sprite == TileType.Point) {
            this.points[x][y] = true;
          }
          else {
            this.points[x][y] = false;
          }
        }
      }
      console.log(this.points);
    })
  }

  Action(tileX: Tile, tileY: Tile[]) {
    if (this.validateEnter > 0) {
      const x = this.level.indexOf(tileY);
      const y = tileY.indexOf(tileX);
      this.makeAction = true;
      this.UpdatePlayer(x, y);
      this.validateEnter = 0;
    }
  }

  Enter(tileX: Tile, tileY: Tile[]) {
    const x = this.level.indexOf(tileY);
    const y = tileY.indexOf(tileX);
    const sprite = this.level[x][y].sprite;
    const index = this.level[x][y].index;
    this.levelState[tileX.index] = sprite;

    if (index == this.player + 1) {
      this.PreviewPlayerEnter(x, y, 1);
    } else if (index == this.player - 1) {
      this.PreviewPlayerEnter(x, y, 2);
    } else if (index == this.player - tileY.length) {
      this.PreviewPlayerEnter(x, y, 3);
    } else if (index == this.player + tileY.length) {
      this.PreviewPlayerEnter(x, y, 4);
    } else {
      this.validateEnter = 0;
    }
  }
  Exit(tileX: Tile, tileY: Tile[]) {
    const x = this.level.indexOf(tileY);
    const y = tileY.indexOf(tileX);
    if (!this.makeAction) {
      this.level[x][y].sprite = this.levelState[tileX.index];
      this.PreviewPlayerExit(x, y);
    }
    else {
      this.makeAction = false;
    }
  }
  PreviewPlayerEnter(x: number, y: number, arrow: number) {    
    const index = this.level[x][y].index;
    switch (this.levelState[this.level[x][y].index]) {
      case TileType.Ground:
        this.level[x][y].sprite = arrow + 7;
        this.validateEnter = arrow;
        break;
      case TileType.Box:
        switch (arrow) {
          case 1:
            if (this.level[x][y+1].sprite == TileType.Ground ||
              this.level[x][y+1].sprite == TileType.Point) {
              this.level[x][y].sprite = arrow + 11;
              this.levelState[index] = this.level[x][y+1].sprite = TileType.Box;
              this.validateEnter = arrow;
            }
            break;
            if (this.level[x][y-1].sprite == TileType.Ground ||
              this.level[x][y-1].sprite == TileType.Point) {
              this.level[x][y].sprite = arrow + 11;
              this.levelState[index] = this.level[x][y-1].sprite = TileType.Box;
              this.validateEnter = arrow;
            }
          case 2:
            if (this.level[x-1][y].sprite == TileType.Ground ||
              this.level[x-1][y].sprite == TileType.Point) {
              this.level[x][y].sprite = arrow + 11;
              this.levelState[index] = this.level[x-1][y].sprite = TileType.Box;
              this.validateEnter = arrow;
            }
            break;
          case 3:
            if (this.level[x+1][y].sprite == TileType.Ground ||
              this.level[x+1][y].sprite == TileType.Point) {
              this.level[x][y].sprite = arrow + 11;
              this.levelState[index] = this.level[x+1][y].sprite = TileType.Box;
              this.validateEnter = arrow;
            }
            break;
          case 4:
            break;
        }
        break;
      case TileType.BoxReady:
        this.level[x][y].sprite = arrow + 11;
        this.validateEnter = arrow;
        break;
      case TileType.Point:
        this.level[x][y].sprite = arrow + 7;
        this.validateEnter = arrow;
        break;
    }
    console.log(this.validateEnter.toString() + arrow);
  }

  PreviewPlayerExit(x: number, y: number) {

    for (let i = 0; i < this.level.length; i++) {
      for (let j = 0; j < this.level[0].length; j++) {
        //this.level[i][j].sprite = this.levelState[this.level[i][j].index];
        if (this.level[i][j].sprite == TileType.PlayerDisable) {
          this.level[i][j].sprite = TileType.Player;
        }        
      }
    }
  }

  UpdatePlayer(x: number, y: number) {
    for (let i = 0; i < this.level.length; i++) {
      for (let j = 0; j < this.level[0].length; j++) {
        if (this.level[i][j].sprite == TileType.Player ||
          this.level[i][j].sprite == TileType.PlayerDisable) {
          this.level[i][j].sprite = (this.points[i][j] ? TileType.Point : TileType.Ground);
        }
      }
    }
    this.player = this.level[x][y].index;
    this.level[x][y].sprite = TileType.Player;
  }
}