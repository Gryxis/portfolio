import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, TemplateRef, ViewChild } from '@angular/core';
import { Direction, GameLogic, ISnake } from './game-logic';
import { SnakeConstants } from './snake-constants';
import { GameRenderer } from './renderer/game-renderer';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';

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

  @ViewChild('pauseModal')
  private pauseModal!: TemplateRef<any>;
  @ViewChild('gameOverModal')
  private gameOverModal!: TemplateRef<any>;

  public gameLogic: GameLogic = new GameLogic();
  private renderer!: GameRenderer;

  private modalOpener!: Subscription;

  constructor(private readonly ngbModal: NgbModal) {}

  public ngAfterViewInit(): void {
    const foreground = this.snakeCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;

    const background = this.backgroundCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
    
    this.renderer = new GameRenderer(
      foreground,
      background,
      this.gameLogic
    );

    this.renderer.init();

    this.modalOpener = this.gameLogic.state.subscribe( state => {
      let result: Promise<void> = undefined as any;
      if (state === 'playing') {
        return
      } else if (state === 'paused') {
        result = this.ngbModal.open( this.pauseModal).result;
      } else if (state === 'gameOver') {
        result = this.ngbModal.open( this.gameOverModal).result;
      }
      result?.finally( () => this.gameLogic.resume())
    });
  }

  public ngOnDestroy(): void {
    this.modalOpener.unsubscribe();
    this.renderer.destroy();
    this.gameLogic.destroy();
  }

  @HostListener('window:keydown.arrowup',['$event'])
  @HostListener('window:keydown.arrowdown',['$event'])
  @HostListener('window:keydown.arrowright',['$event'])
  @HostListener('window:keydown.arrowleft',['$event'])
  public onDirectionChange( event: KeyboardEvent) {
    
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
  public onPause( event: KeyboardEvent) {
    this.ngbModal.dismissAll();
    if ( [ 'paused', 'gameOver'].includes( this.gameLogic.state.getValue())) {
      this.gameLogic.resume();
    } else {
      this.gameLogic.pause();
    }
  }

}
