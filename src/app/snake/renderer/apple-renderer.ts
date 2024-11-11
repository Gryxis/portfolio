import { GameLogic } from "../game-logic";
import { SnakeConstants } from "../snake-constants";

export class AppleRenderer {

  private heartPath!: Path2D;

  constructor(
    private readonly layer: CanvasRenderingContext2D,
    private readonly gameLogic: GameLogic,
  ) {
    this.constructHeart();
  }

  public draw(): void {

    const apple = this.gameLogic.getApple();
    this.layer.save();
    this.layer.beginPath();
    this.layer.fillStyle = SnakeConstants.colors.apple;
    
    this.layer.translate(
      (apple.x + 0.5) * SnakeConstants.PIXEL_SIZE,
      (apple.y + 0.5) * SnakeConstants.PIXEL_SIZE);

    this.layer.scale( SnakeConstants.PIXEL_SIZE, SnakeConstants.PIXEL_SIZE);
    this.layer.fill( this.heartPath);

    this.layer.restore();

  }

  private constructHeart() {
    this.heartPath = new Path2D();
    this.heartPath.moveTo(                 0,        -0.25);
    this.heartPath.bezierCurveTo(          0,   -0.2734375,  -0.0390625,   -0.3671875,   -0.1953125,   -0.3671875);
    this.heartPath.bezierCurveTo( -0.4296875,   -0.3671875,  -0.4296875,  -0.07421875,   -0.4296875,  -0.07421875);
    this.heartPath.bezierCurveTo( -0.4296875,       0.0625,  -0.2734375,     0.234375,            0,        0.375);
    this.heartPath.bezierCurveTo(  0.2734375,     0.203125,   0.4296875,       0.0625,    0.4296875,  -0.07421875);
    this.heartPath.bezierCurveTo(  0.4296875,  -0.07421875,   0.4296875,   -0.3671875,    0.1953125,   -0.3671875);
    this.heartPath.bezierCurveTo(  0.078125,    -0.3671875,           0,   -0.2734375,            0,        -0.25);
  }
}