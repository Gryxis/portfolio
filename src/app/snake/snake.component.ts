import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-snake',
  templateUrl: './snake.component.html',
  styleUrls: ['./snake.component.scss']
})
export class SnakeComponent implements AfterViewInit {

  /** the width and height of the grid */
  public readonly SIZE = 24;

  /** the size of one pixel in the grid*/
  public readonly PIXEL_SIZE = 32;

  @ViewChild('snakeCanvas')
  private snakeCanvas!: ElementRef<HTMLCanvasElement>;
  private foregroundRenderCtxt!: CanvasRenderingContext2D;
  
  @ViewChild('backgroundCanvas')
  private backgroundCanvas!: ElementRef<HTMLCanvasElement>;

  public ngAfterViewInit(): void {
    this.foregroundRenderCtxt = this.snakeCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
    
    this.drawBackground();
  }

  private async drawBackground(): Promise<void> {
    const context = this.backgroundCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
    
    // fill one color after the other
    // first light green
    context.fillStyle = "#d1e7dd";
    for (let x = 0; x < this.SIZE; x += 2) {
      for (let y = 0; y < this.SIZE; y += 2) {
        context.fillRect(
          x * this.PIXEL_SIZE,
          y * this.PIXEL_SIZE,
          this.PIXEL_SIZE,
          this.PIXEL_SIZE
        );
      }
    }
    // secondly darker green
    context.fillStyle = "#a3cfbb";
    for (let x = 1; x < this.SIZE; x += 2) {
      for (let y = 1; y < this.SIZE; y += 2) {
        context.fillRect(
          x * this.PIXEL_SIZE,
          y * this.PIXEL_SIZE,
          this.PIXEL_SIZE,
          this.PIXEL_SIZE
        );
      }
    }
    
  }

  
  public onStartGame() {

  }

  
  private drawFrame(): void {

  }

}
