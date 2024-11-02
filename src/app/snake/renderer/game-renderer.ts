import { AppleRenderer } from "./apple-renderer";
import { GameLogic } from "../game-logic";
import { GrindRenderer } from "./grid-renderer";
import { SnakeConstants } from "../snake-constants";
import { SnakeRenderer } from "./snake-renderer";

export class GameRenderer {

  private snakeRenderer: SnakeRenderer;
  private appleRenderer: AppleRenderer;
  private gridRenderer: GrindRenderer;

  private alive = true;

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
    
    this.alive = true;
    requestAnimationFrame( (time) => {
      this.gridRenderer.draw();
      this.drawFrame();
    });
  }

  public destroy() {
    // stop rendering
    this.alive = false;
  }

  public drawFrame(): void {
    if (!this.alive) {
      return;
    }
    this.clearForeground();
    this.appleRenderer.draw();
    this.snakeRenderer.draw();
    requestAnimationFrame(() => this.drawFrame());
  }

  private clearForeground(): void {
    this.foreground.clearRect(
      0,
      0,
      SnakeConstants.SIZE * SnakeConstants.PIXEL_SIZE,
      SnakeConstants.SIZE * SnakeConstants.PIXEL_SIZE
    );
  }
}