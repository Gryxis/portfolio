import { AppleRenderer } from "./apple-renderer";
import { GameLogic } from "../game-logic";
import { GrindRenderer } from "./grid-renderer";
import { SnakeConstants } from "../snake-constants";
import { SnakeRenderer } from "./snake-renderer";

export class GameRenderer {

  private snakeRenderer: SnakeRenderer;
  private appleRenderer: AppleRenderer;
  private gridRenderer: GrindRenderer;

  constructor(
    private readonly foreground: CanvasRenderingContext2D,
    background: CanvasRenderingContext2D,
    gameLogic: GameLogic,
  ) {
    this.snakeRenderer = new SnakeRenderer( foreground, gameLogic);
    this.appleRenderer = new AppleRenderer( foreground, gameLogic);
    this.gridRenderer = new GrindRenderer( background);
  }

  public init() {
    this.gridRenderer.draw();
    this.appleRenderer.draw();
    this.snakeRenderer.draw();
  }

  public drawFrame(): void {
    this.clearForeground();
    this.appleRenderer.draw();
    this.snakeRenderer.draw();
  }

  private clearForeground(): void {
    this.foreground.fillStyle = "transparent";
    this.foreground.fillRect(
      0,
      0,
      SnakeConstants.SIZE * SnakeConstants.PIXEL_SIZE,
      SnakeConstants.SIZE * SnakeConstants.PIXEL_SIZE
    );
  }
}