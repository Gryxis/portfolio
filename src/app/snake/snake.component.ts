import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { GameLogic, ISnake } from './game-logic';
import { SnakeConstants } from './snake-constants';
import { GameRenderer } from './renderer/game-renderer';

@Component({
  selector: 'app-snake',
  templateUrl: './snake.component.html',
  styleUrls: ['./snake.component.scss']
})
export class SnakeComponent implements AfterViewInit {

  /** the width and height of the grid */
  public readonly SIZE = SnakeConstants.SIZE;

  /** the size of one pixel in the grid*/
  public readonly PIXEL_SIZE = SnakeConstants.PIXEL_SIZE;

  @ViewChild('snakeCanvas')
  private snakeCanvas!: ElementRef<HTMLCanvasElement>;
  
  @ViewChild('backgroundCanvas')
  private backgroundCanvas!: ElementRef<HTMLCanvasElement>;

  private gameLogic: GameLogic = new GameLogic();
  private renderer!: GameRenderer;

  public ngAfterViewInit(): void {
    const foreground = this.snakeCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;

    const background = this.backgroundCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
    
    this.renderer = new GameRenderer(
      foreground,
      background,
      this.gameLogic
    );

    this.renderer.init();
  }
  
  public onStartGame() {

  }

}
