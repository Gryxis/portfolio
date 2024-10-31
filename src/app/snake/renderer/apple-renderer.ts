import { GameLogic } from "../game-logic";
import { SnakeConstants } from "../snake-constants";

export class AppleRenderer {

  constructor(
    private readonly layer: CanvasRenderingContext2D,
    private readonly gameLogic: GameLogic,
  ) {

  }

  public draw(): void {
    console.log("draw apple")

    const apple = this.gameLogic.getApple();
    this.layer.save();
    this.layer.beginPath();
    this.layer.fillStyle = SnakeConstants.colors.apple;
    
    this.layer.arc(
      (apple.x + 0.5) * SnakeConstants.PIXEL_SIZE,
      (apple.y + 0.5) * SnakeConstants.PIXEL_SIZE,
      SnakeConstants.PIXEL_SIZE * 0.375,
      0,
      Math.PI * 2
    );

    this.layer.fill();

    this.layer.restore();

  }
}