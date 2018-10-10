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

  //boxes: number[][];

  levelState: number[] = new Array();

  player: number;

  playerPosition: number[];

  makeAction: boolean = false;

  validateEnter: number = 0;

  endGame : boolean = false;

  constructor(private http: Http) {
    http.get("level1.json").subscribe(res => {
      const matrix: number[][] = res.json().levels;
      this.level = [];
      this.points = [];
      //this.boxes = [];
      this.playerPosition = [];
      for (let x = 0; x < matrix.length; x++) {
        this.level[x] = [];
        this.points[x] = [];
        //this.boxes[x] = [];
        for (let y = 0; y < matrix[0].length; y++) {
          const index = x * matrix[0].length + y;
          this.level[x][y] = new Tile(index, matrix[x][y]);
          this.levelState[index] = matrix[x][y];
          if (this.level[x][y].sprite == TileType.Player) {
            this.player = this.level[x][y].index;
            this.playerPosition[0] = x;
            this.playerPosition[1] = y;
            this.points[x][y] = false;
          } else if (this.level[x][y].sprite == TileType.Point || 
            this.level[x][y].sprite == TileType.BoxReady) {
            this.points[x][y] = true;
          }
          /* else if (this.level[x][y].sprite == TileType.Box) {
            this.boxes[x][y] = 1;
          }
          else if (this.level[x][y].sprite == TileType.BoxReady) {
            this.boxes[x][y] = 2;
          } */
          else {
            //this.boxes[x][y] = 0;
            this.points[x][y] = false;
          }
        }
      }
      //console.log(this.points);
    })
  }

  Action(tileX: Tile, tileY: Tile[]) {
    if(!this.endGame){
    if (this.validateEnter > 0) {
      const x = this.level.indexOf(tileY);
      const y = tileY.indexOf(tileX);
      this.makeAction = true;
      this.UpdatePlayer(x, y);
      this.validateEnter = 0;
    }
  }
  }

  Enter(tileX: Tile, tileY: Tile[]) {
    if(!this.endGame){
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
    }}
  }
  Exit(tileX: Tile, tileY: Tile[]) {
    if(!this.endGame){
    const x = this.level.indexOf(tileY);
    const y = tileY.indexOf(tileX);
    if (!this.makeAction) {
      this.level[x][y].sprite = this.levelState[tileX.index];
      /* for (let i = 0; i < this.level.length; i++) {
        for (let j = 0; j < this.level[0].length; j++) {
          if (this.boxes[i][j] == 1 && this.boxes[i][j] == 2) {
            this.level[i][j].sprite = this.boxes[i][j] == 1 ? TileType.Box : TileType.BoxReady;
          }
        }
      } */
      this.PreviewPlayerExit(x, y);
    }
    else {
      this.makeAction = false;
    }
  }
}
  PreviewPlayerEnter(x: number, y: number, arrow: number) {
    const index = this.level[x][y].index;
    if (this.levelState[index] == TileType.Ground ||
      this.levelState[this.level[x][y].index] == TileType.Point) {
      this.level[x][y].sprite = arrow + 7;
      this.validateEnter = arrow;
    }
    else if (this.levelState[index] == TileType.Box ||
      this.levelState[index] == TileType.BoxReady) {
      switch (arrow) {
        case 1://RIGHT
          if (this.level[x][y + 1].sprite == TileType.Ground ||
            this.level[x][y + 1].sprite == TileType.Point) {
            if (this.level[x][y + 1].sprite != TileType.Wall &&
              this.level[x][y + 1].sprite != TileType.Box &&
              this.level[x][y + 1].sprite != TileType.BoxReady) {
              this.level[x][y].sprite = arrow + 11;
              //this.boxes[x][y] = 0;
              this.level[x][y + 1].sprite = (this.levelState[index] == TileType.Box ? TileType.Box : TileType.BoxReady);
              //this.boxes[x][y + 1] = 1;
              this.validateEnter = arrow;
            } else {
              this.validateEnter = 0;
            }
          } else {
            this.validateEnter = 0;
          }
          break;
        case 2://LEFT
          if (this.level[x][y - 1].sprite == TileType.Ground ||
            this.level[x][y - 1].sprite == TileType.Point) {
            if (this.level[x][y - 1].sprite != TileType.Wall &&
              this.level[x][y - 1].sprite != TileType.Box &&
              this.level[x][y - 1].sprite != TileType.BoxReady) {
              this.level[x][y].sprite = arrow + 11;
              //this.boxes[x][y] = 0;
              this.level[x][y - 1].sprite = (this.levelState[index] == TileType.Box ? TileType.Box : TileType.BoxReady);
              //this.boxes[x][y - 1] = 1;
              this.validateEnter = arrow;
            } else {
              this.validateEnter = 0;
            }
          } else {
            this.validateEnter = 0;
          }
          break;
        case 3://UP
          if (this.level[x - 1][y].sprite == TileType.Ground ||
            this.level[x - 1][y].sprite == TileType.Point) {
            if (this.level[x - 1][y].sprite != TileType.Wall &&
              this.level[x - 1][y].sprite != TileType.Box &&
              this.level[x - 1][y].sprite != TileType.BoxReady) {
              this.level[x][y].sprite = arrow + 11;
              //this.boxes[x][y] = 0;
              this.level[x - 1][y].sprite = (this.levelState[index] == TileType.Box ? TileType.Box : TileType.BoxReady);
              //this.boxes[x + 1][y] = 1;
              this.validateEnter = arrow;
            } else {
              this.validateEnter = 0;
            }
          } else {
            this.validateEnter = 0;
          }
          break;
        case 4://DOWN
          if (this.level[x + 1][y].sprite == TileType.Ground ||
            this.level[x + 1][y].sprite == TileType.Point) {
            if (this.level[x + 1][y].sprite != TileType.Wall &&
              this.level[x + 1][y].sprite != TileType.Box &&
              this.level[x + 1][y].sprite != TileType.BoxReady) {
              this.level[x][y].sprite = arrow + 11;
              //this.boxes[x][y] = 0;
              this.level[x + 1][y].sprite = (this.levelState[index] == TileType.Box ? TileType.Box : TileType.BoxReady);
              //this.boxes[x - 1][y] = 1;
              this.validateEnter = arrow;
            } else {
              this.validateEnter = 0;
            }
          } else {
            this.validateEnter = 0;
          }
          break;
      }
    }
    else {
      this.validateEnter = 0;
    }
    //console.log(this.validateEnter.toString() + arrow);
  }

  PreviewPlayerExit(x: number, y: number) {
    for (let i = 0; i < this.level.length; i++) {
      for (let j = 0; j < this.level[0].length; j++) {
        this.level[i][j].sprite = this.levelState[this.level[i][j].index];        
      }
    }
    this.level[this.playerPosition[0]][this.playerPosition[1]].sprite = TileType.Player
  }

  UpdatePlayer(x: number, y: number) {
    let countWin = 0;
    for (let i = 0; i < this.level.length; i++) {
      for (let j = 0; j < this.level[0].length; j++) {
        if (this.level[i][j].sprite == TileType.ArrowDown ||
          this.level[i][j].sprite == TileType.ArrowUp ||
          this.level[i][j].sprite == TileType.ArrowRight ||
          this.level[i][j].sprite == TileType.ArrowLeft ||
          this.level[i][j].sprite == TileType.ArrowLeft ||          
          this.level[i][j].sprite == TileType.HitRight ||          
          this.level[i][j].sprite == TileType.HitUp ||          
          this.level[i][j].sprite == TileType.HitDown) {
          this.level[i][j].sprite = (this.points[i][j] ? TileType.Point : TileType.Ground);
        }
        if (this.level[i][j].sprite == TileType.Player ||
          this.level[i][j].sprite == TileType.PlayerDisable) {
          this.level[i][j].sprite = (this.points[i][j] ? TileType.Point : TileType.Ground);
        }
        if (this.level[i][j].sprite == TileType.Box || this.level[i][j].sprite == TileType.BoxReady) {
          this.level[i][j].sprite = (this.points[i][j] ? TileType.BoxReady : TileType.Box);
        }
        if(this.points[i][j]){
          if(this.level[i][j].sprite != TileType.BoxReady){
            countWin += 1;
          }
        }        
        this.levelState[this.level[i][j].index] = this.level[i][j].sprite;
      }
    }
    this.player = this.level[x][y].index;
    this.playerPosition[0] = x;
    this.playerPosition[1] = y;
    this.level[x][y].sprite = TileType.Player;
  if(countWin == 0)
  {
    console.log("Você venceu.");    
      this.endGame = true;
  }
  }
}