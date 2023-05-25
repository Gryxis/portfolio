import { Component } from '@angular/core';

@Component({
  selector: 'app-game-of-life',
  templateUrl: './game-of-life.component.html',
  styleUrls: ['./game-of-life.component.scss']
})
export class GameOfLifeComponent {

  public size: number = 16;
  public currentState: boolean[][] = [];
  public isRunning = false;
  private simulationInterval?: any;
  public fps = 5;
  public soupChance = 30;

  public readonly sizeTooltip = `Configure the size of the square grid,I recommend to use ~64. larger grids may lead to performance issues.`;
  public readonly fpsTooltip = `Configure speed of the simulation in frames per second`;
  public readonly soupTooltip = `This way you can create some "soup", a.k.a random grid with the given percentage of cells alive`;


  public onCreate(): void {
    this.pauseGame();
    this.currentState = [];

    for (let y = 0; y < this.size; y++) {
      this.currentState[y] = new Array(this.size);
      this.currentState[y].fill(false);
    }
  }

  public onFillSoup() {
    this.currentState = this.currentState.map(
      (row, y, lastState) => row.map(
        (state, x)  => {
          return Math.random() <= this.soupChance / 100;
        }
      )
    );
  }

  public onKillAll(): void {
    this.pauseGame();
    this.currentState = this.currentState.map(
      (row) => row.map( (state)  => false)
    );
  }

  public onStartOrPause() {
    if (this.isRunning) {
      this.pauseGame();
    }
    else {
      this.startGame();
    }
  }

  private pauseGame() {
    this.isRunning = false;
    if (this.simulationInterval) {
      clearInterval(this.simulationInterval);
      this.simulationInterval = undefined;
    }
  }

  private startGame() {
    this.pauseGame();
    this.isRunning = true;
    this.simulationInterval = setInterval( () => {this.step()}, 1000 / this.fps);
  }

  private step() {
    this.currentState = this.currentState.map(
      (row, y, lastState) => row.map(
      (state, x)  => {
        let livingNeigbours = 0;
        for (let divY = -1; divY <= 1; divY++) {
          for (let divX = -1; divX <= 1; divX++) {
            if (!!divX || !!divY) { // not the cell itself
              let nbPos /** neighbour Position */ = {  
                y: (this.size +  y + divY) % this.size,
                x: (this.size +  x + divX) % this.size,
              }
              if (lastState[nbPos.y][nbPos.x]) {
                livingNeigbours ++;
              }
            }
          }
        }

        // case become alive
        if (!state && livingNeigbours === 3) {
          return true;
        }
        // case survive
        else if (state && [2, 3].includes(livingNeigbours) ) {
          return true;
        }
        // case die
        else {
          return false;
        }
      }
    ));
  }

}
