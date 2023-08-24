import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';

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

  private readonly BOTTOM_COLOR = [245,245,220, 255];
  private readonly STONE_COLOR = [158,74,74, 255];
  public readonly PIXEL_SIZE = 8;

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
    this.generateDungeonPart();
    this.fillCanvas();
  }

  generateDungeonPart() {
    
    this.dungeon = this.simulateCA(
      this.getSprinkle()
    );
  }

  private getSprinkle(): number[] { 
    let sprinkledField = [];
    // sprinkle:
    for (let i = 0; i < this.SIZE * this.SIZE; i++) {
      sprinkledField[i] = Math.random() <= (this.propability * 0.01) ? 1 : 0;
    }

    return sprinkledField;
  }


  private simulateCA( oldField: number[]): number[] {

    let currentField = [... oldField];
    for (let currentStep = 0; currentStep < this.simulationStepCount; currentStep++) {

      const nextField = [];
      for (let pos = 0; pos < this.SIZE * this.SIZE; pos++) {

        // count neighbours, repeating on the edge:
        let countNeighbourStones = 0;

        for ( let y = -1; y <= 1; y++) {
          for ( let x = -1; x <= 1; x++) {
            let neighborPos = (pos + x + y * this.SIZE);
            neighborPos = (neighborPos + this.SIZE * this.SIZE) % (this.SIZE * this.SIZE);
            
            if (currentField[neighborPos]) {
              countNeighbourStones++;
            }
          }
        }

        nextField[pos] = countNeighbourStones >= this.threshold ? 1 : 0;
      }

      currentField = nextField;
    }
    
    return currentField;

  }

  async fillCanvas() {
    const rgbaPixels: Uint8ClampedArray = new Uint8ClampedArray(this.SIZE * 4 * this.SIZE);

    this.dungeon.forEach( (field, i) => {
      const color = field === 1 ? this.STONE_COLOR : this.BOTTOM_COLOR;
      rgbaPixels[i*4 + 0] = color[0]; // R value
      rgbaPixels[i*4 + 1] = color[1]; // G value
      rgbaPixels[i*4 + 2] = color[2]; // B value
      rgbaPixels[i*4 + 3] = color[3]; // A value
    });

    const imageData: ImageData = new ImageData(rgbaPixels, this.SIZE, this.SIZE);

    const imageOptions: ImageBitmapOptions = {
      resizeHeight: this.SIZE * this.PIXEL_SIZE,
      resizeQuality: "pixelated",
      resizeWidth: this.SIZE * this.PIXEL_SIZE,
    };
    this.dungeonBitMap?.close();
    this.dungeonBitMap = await createImageBitmap(imageData, 0, 0, this.SIZE, this.SIZE, imageOptions);
    this.canvasContext.drawImage(this.dungeonBitMap, 0, 0);
  }
}