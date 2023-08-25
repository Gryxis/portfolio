import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, ViewChild } from '@angular/core';

@Component({
  selector: 'app-endless-dungeon-crawler',
  templateUrl: './endless-dungeon-crawler.component.html',
  styleUrls: ['./endless-dungeon-crawler.component.scss']
})
export class EndlessDungeonCrawlerComponent implements AfterViewInit, OnDestroy {

  public simulationStepCount: number = 5;
  public threshold: number = 5;
  public propability: number = 50;
  public readonly SIZE = 150;

  public position: Position = { x:0, y:0}; 

  private readonly BOTTOM_COLOR = [245,245,220, 255];
  private readonly STONE_COLOR = [158,74,74, 255];
  public readonly PIXEL_SIZE = 16;

  @ViewChild('endlessCrawlerCanvas')
  private endlessCrawlerCanvas!: ElementRef<HTMLCanvasElement>;

  private canvasContext!: CanvasRenderingContext2D;
  private dungeonBitMap?: ImageBitmap;

  /**
   * The dungeon of the dungeon crawler.
   * 
   * the dungeon is split into 9 parts.
   * each part contains SIZE * SIZE cells.
   * each cell can either be empty (0) or a stone (1).
   * 
   * the dungeon is in row-column order.
   */
  public dungeon: number[] = [];

  ngAfterViewInit(): void {
    this.canvasContext = this.endlessCrawlerCanvas?.nativeElement.getContext('2d') as CanvasRenderingContext2D;
  }

  ngOnDestroy(): void {
    this.dungeonBitMap?.close();
  }


  public onStart(): void {
    this.dungeon = [];
    const fullDungeon = { x:0, y:0, w: this.SIZE, h: this.SIZE};
    this.generateDungeonPart( fullDungeon);
    this.constructBitmap().then(
      () => this.drawCanvas()
    );
  }

  generateDungeonPart( part: Rectangle) {
    this.sprinkleOnDungeon( part);
    this.simulateCA( part);
  }

  private sprinkleOnDungeon( rectangle: Rectangle): void { 
    // sprinkle:
    for (let x = rectangle.x; x < rectangle.x + rectangle.w; x++) {
      for (let y = rectangle.y; y < rectangle.y + rectangle.h; y++) {
        const pos = x + y * this.SIZE;
        this.dungeon[pos] = Math.random() <= (this.propability * 0.01) ? 1 : 0;
      }
    }
  }

  private simulateCA( rectangle: Rectangle): void {

    for (let currentStep = 0; currentStep < this.simulationStepCount; currentStep++) {

      const nextField = [... this.dungeon];
      for (let x = rectangle.x; x < rectangle.x + rectangle.w; x++) {
        for (let y = rectangle.y; y < rectangle.y + rectangle.h; y++) {
          const pos = x + y * this.SIZE;
    
          // count neighbours, repeating on the edge:
          let countNeighbourStones = 0;
  
          for ( let y = -1; y <= 1; y++) {
            for ( let x = -1; x <= 1; x++) {
              let neighborPos = (pos + x + y * this.SIZE);
              neighborPos = (neighborPos + this.SIZE * this.SIZE) % (this.SIZE * this.SIZE);
              
              if (this.dungeon[neighborPos]) {
                countNeighbourStones++;
              }
            }
          }
  
          nextField[pos] = countNeighbourStones >= this.threshold ? 1 : 0;
        }
      }
    
      this.dungeon = nextField;
    }
  }

  /**
   * shifts the content of the dungeon in diraction of dx and dy vector
   * @param dx change in x-axis
   * @param dy change in y-axis
   */
  private shiftDungeon( dx: number, dy: number) {
    for ( let pos = 0; pos < this.dungeon.length; pos++) {
      if ( pos / this.SIZE + dy >= this.SIZE
           || pos / this.SIZE + dy < 0
           || pos % this.SIZE + dx >= this.SIZE
           || pos % this.SIZE + dx < 0) {
        continue;
      }
      const copyPos = pos + dx + (dy * this.SIZE);
      this.dungeon[pos] = this.dungeon[copyPos];
    }
  }

  async constructBitmap() {
    const rgbaPixels: Uint8ClampedArray = new Uint8ClampedArray(this.SIZE * 4 * this.SIZE);

    for ( let i = 0; i < this.dungeon.length; i++) {
      const field = this.dungeon[i];
      const color = field === 1 ? this.STONE_COLOR : this.BOTTOM_COLOR;
      rgbaPixels[i*4 + 0] = color[0]; // R value
      rgbaPixels[i*4 + 1] = color[1]; // G value
      rgbaPixels[i*4 + 2] = color[2]; // B value
      rgbaPixels[i*4 + 3] = color[3]; // A value
    };

    const imageData: ImageData = new ImageData(rgbaPixels, this.SIZE, this.SIZE);

    const canvasSize = this.SIZE * this.PIXEL_SIZE;
    const imageOptions: ImageBitmapOptions = {
      resizeHeight: canvasSize,
      resizeQuality: "pixelated",
      resizeWidth: canvasSize,
    };
    this.dungeonBitMap?.close();
    this.dungeonBitMap = await createImageBitmap(imageData, 0, 0, this.SIZE, this.SIZE, imageOptions);
  }

  private drawCanvas() {
    const canvasSize = this.SIZE * this.PIXEL_SIZE;
    this.canvasContext.drawImage(
      this.dungeonBitMap!,
      -canvasSize/3 - this.position.x * this.PIXEL_SIZE,
      -canvasSize/3 - this.position.y * this.PIXEL_SIZE
    );
  }


  // move logic:
  @HostListener('window:keydown.arrowup',['$event'])
  @HostListener('window:keydown.arrowdown',['$event'])
  @HostListener('window:keydown.arrowright',['$event'])
  @HostListener('window:keydown.arrowleft',['$event'])
  public async move(event: KeyboardEvent): Promise<void> {
    if (!this.dungeonBitMap) {
      return;
    }

    switch (event.key) {
      case "ArrowLeft":
        this.position.x--;
        break;
      case "ArrowRight":
        this.position.x++;
        break;
      case "ArrowUp":
        this.position.y--;
        break;
        case "ArrowDown":
        this.position.y++;
        break;
    }

    if (
      Math.abs(this.position.x ) >= this.SIZE/3
      ||  Math.abs(this.position.y) >= this.SIZE/3
    ) {
      await this.generateBorderAndResetShift();
    }

    this.drawCanvas();
  }

  private async generateBorderAndResetShift(): Promise<void> {
    
    if (Math.abs( this.position.x) >= this.SIZE / 3) {
      const newPart: Rectangle = {
        x: this.position.x + this.SIZE / 3,
        y: 0,
        w: this.SIZE / 3,
        h: this.SIZE,
      };

      this.shiftDungeon( this.position.x * 1, 0);
      this.generateDungeonPart(newPart);
      
      if (this.position.x >= this.SIZE /3) {
        this.position.x -= this.SIZE / 3;
      } else {
        this.position.x += this.SIZE / 3;
      }
    }
    if (Math.abs( this.position.y) >= this.SIZE / 3) {
      const newPart: Rectangle = {
        x: 0,
        y: this.position.y + this.SIZE / 3,
        w: this.SIZE,
        h: this.SIZE / 3,
      };
      this.shiftDungeon( 0, this.position.y * 1);
      this.generateDungeonPart(newPart);
      
      if (this.position.y >= this.SIZE / 3) {
        this.position.y -= this.SIZE / 3;
      } else {
        this.position.y += this.SIZE / 3;
      }  
    }

    await this.constructBitmap();
  }
}

interface Position {
  x: number,
  y: number,
};

interface Rectangle {
  x: number,
  y: number,
  w:number,
  h:number
}