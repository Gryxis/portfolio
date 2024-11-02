import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, ViewChild } from '@angular/core';
import { Direction, GameLogic, ISnake } from './game-logic';
import { SnakeConstants } from './snake-constants';
import { GameRenderer } from './renderer/game-renderer';

@Component({
  selector: 'app-snake',
  templateUrl: './snake.component.html',
  styleUrls: ['./snake.component.scss']
})
export class SnakeComponent implements AfterViewInit, OnDestroy {

  /** the width and height of the grid */
  public readonly SIZE = SnakeConstants.SIZE;

  /** the size of one pixel in the grid*/
  public readonly PIXEL_SIZE = SnakeConstants.PIXEL_SIZE;

  @ViewChild('snakeCanvas')
  private snakeCanvas!: ElementRef<HTMLCanvasElement>;
  
  @ViewChild('backgroundCanvas')
  private backgroundCanvas!: ElementRef<HTMLCanvasElement>;

  public gameLogic: GameLogic = new GameLogic();
  private renderer!: GameRenderer;
  private frameHandle: number = -1;

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

  public ngOnDestroy(): void {
    this.renderer.destroy();
    this.gameLogic.destroy();
  }

  @HostListener('window:keydown.arrowup',['$event'])
  @HostListener('window:keydown.arrowdown',['$event'])
  @HostListener('window:keydown.arrowright',['$event'])
  @HostListener('window:keydown.arrowleft',['$event'])
  public onDirectionChange( event: KeyboardEvent) {
    
    if (this.gameLogic.paused) {
      return;
    }

    let direction: Direction = 'up';
    switch (event.key) {
      case "ArrowLeft":
        direction = 'left';
        break;
      case "ArrowRight":
        direction = 'right';
        break;
      case "ArrowUp":
        direction = 'up';
        break;
        case "ArrowDown":
          direction = 'down';
        break;
    }
    
    this.gameLogic.turn( direction);
  }

  @HostListener('window:keydown.space',['$event'])
  public onPause() {
    if (this.gameLogic.paused) {
      this.gameLogic.resume();
    } else {
      this.gameLogic.pause();
    }
  }

}
