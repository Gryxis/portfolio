import { SnakeConstants } from "../snake-constants";

export class GrindRenderer {

  constructor(
    private readonly layer: CanvasRenderingContext2D
  ) {

    }

    public draw(): void {
        // fill one color after the other
        // first light green
        this.layer.fillStyle = SnakeConstants.colors.lightGridCell;
        this.layer.fillRect(
          0,
          0,
          SnakeConstants.PIXEL_SIZE * SnakeConstants.SIZE,
          SnakeConstants.PIXEL_SIZE * SnakeConstants.SIZE
        );

        this.layer.fillStyle = SnakeConstants.colors.darkGridCell;
        
        for (let x = 0; x < SnakeConstants.SIZE; x += 2) {
            for (let y = 0; y < SnakeConstants.SIZE; y += 2) {
                this.layer.fillRect(
                    x * SnakeConstants.PIXEL_SIZE,
                    y * SnakeConstants.PIXEL_SIZE,
                    SnakeConstants.PIXEL_SIZE,
                    SnakeConstants.PIXEL_SIZE
                );
            }
        }
        // secondly darker green
        this.layer.fillStyle = SnakeConstants.colors.darkGridCell;
        for (let x = 1; x < SnakeConstants.SIZE; x += 2) {
            for (let y = 1; y < SnakeConstants.SIZE; y += 2) {
                this.layer.fillRect(
                    x * SnakeConstants.PIXEL_SIZE,
                    y * SnakeConstants.PIXEL_SIZE,
                    SnakeConstants.PIXEL_SIZE,
                    SnakeConstants.PIXEL_SIZE
                );
            }
        }
    }
}