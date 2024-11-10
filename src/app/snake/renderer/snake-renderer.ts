import { GameLogic, ISnake, IPosition } from "../game-logic";
import { SnakeConstants } from "../snake-constants";

export class SnakeRenderer {

  constructor(
    private readonly layer: CanvasRenderingContext2D,
    private readonly gameLogic: GameLogic,
  ) {

  }

  public draw(): void {

    const snake = this.gameLogic.getSnake();

    this.drawTorso(snake);
    this.drawHead(snake);
    this.drawTail(snake);
  }

  private drawHead(snake: ISnake) {
    
    const pos = snake.positions[snake.positions.length - 1];
    const throat = snake.positions[snake.positions.length - 2];
    const pixelSize = SnakeConstants.PIXEL_SIZE;
    const snakeWidth = SnakeConstants.SNAKE_WIDTH;
    
    const cellCenter = this.getCellCenterInPx( pos);
    let rotAngle: number = 0;

    if (pos.x > throat.x) {
      rotAngle = 0;
    }
    else if (pos.x < throat.x) {
      rotAngle = Math.PI
    } else if (pos.y > throat.y) {
      rotAngle = 1 * Math.PI / 2;
    } else {
      rotAngle = -1 * Math.PI / 2;
    }

    this.layer.save();
    this.layer.translate( cellCenter.x, cellCenter.y);
    this.layer.rotate(rotAngle);

    this.layer.beginPath();
    this.layer.fillStyle = SnakeConstants.colors.snake.body;

    this.layer.roundRect(
      -1 * pixelSize / 2,
      -1 * pixelSize / 2 * snakeWidth,
      pixelSize,
      pixelSize * snakeWidth,
      [ 0, pixelSize / 2.25, pixelSize / 2.25, 0]
    );
    this.layer.fill();

    this.layer.beginPath();
    this.layer.fillStyle = SnakeConstants.colors.snake.eye;
    this.layer.strokeStyle = SnakeConstants.colors.snake.body;
    this.layer.lineWidth = pixelSize / 4;

    this.layer.arc(
      -1 * pixelSize / 4 * snakeWidth,
      -1 * pixelSize / 2 * snakeWidth,
      pixelSize / 4 * snakeWidth,
      0,
      Math.PI * 2
    );

    this.layer.arc(
      -1 * pixelSize / 4 * snakeWidth,
      + pixelSize / 2 * snakeWidth,
      pixelSize / 4 * snakeWidth,
      0,
      Math.PI * 2
    );

    this.layer.stroke();
    this.layer.fill();

    // pupille
    this.layer.beginPath();
    this.layer.fillStyle = SnakeConstants.colors.snake.pupilla;

    this.layer.arc(
      (-1 * pixelSize / 4 + pixelSize / 12) * snakeWidth,
      + pixelSize / 2 * snakeWidth,
      pixelSize / 12 * snakeWidth,
      0,
      Math.PI * 2
    );

    this.layer.arc(
      (-1 * pixelSize / 4 + pixelSize / 12) * snakeWidth,
      -1 * pixelSize / 2 * snakeWidth,
      pixelSize / 12 * snakeWidth,
      0,
      Math.PI * 2
    );
    this.layer.fill();


    this.layer.restore();
  }

  private getCellCenterInPx( pos: IPosition): IPosition {
    return this.posToPx( { x: (pos.x + 0.5), y: (pos.y + 0.5)});
  }

  private posToPx( pos: IPosition): IPosition {
    return {
      x: pos.x * SnakeConstants.PIXEL_SIZE,
      y: pos.y * SnakeConstants.PIXEL_SIZE,
    };
  }

  private drawTail(snake: ISnake) {
    this.layer.save();
    this.layer.beginPath();
    this.layer.fillStyle = SnakeConstants.colors.snake.body;

    const tailPos = snake.positions[0];
    const hipPos = snake.positions[1];
    const pixelSize = SnakeConstants.PIXEL_SIZE;
    const snakeWidth = SnakeConstants.SNAKE_WIDTH;

    const drawCenter = {
      x: tailPos.x + 0.5 + (hipPos.x - tailPos.x) / 2.25,
      y: tailPos.y + 0.5 + (hipPos.y - tailPos.y) / 2.25,
    }
    const drawPx = this.posToPx( drawCenter);

    this.layer.translate( drawPx.x, drawPx.y);
    
    if (tailPos.y != hipPos.y) {
      this.layer.rotate( Math.PI / 2 );
    }


    this.layer.roundRect(
      -0.5 * pixelSize,
      (- 0.5 * snakeWidth) * pixelSize,
      pixelSize,
      pixelSize * snakeWidth,
      pixelSize / 2.25
    );

    this.layer.fill();

    this.layer.restore();
  }

  private drawTorso(snake: ISnake) {
    this.layer.save();
    this.layer.beginPath();
    this.layer.fillStyle = SnakeConstants.colors.snake.body;

    snake.positions.forEach((pos, index) => {
      if (index == 0 || index == snake.positions.length - 1) {
        return // do not draw head/tail
      }

      if (this.isCornerAt(snake, index)) {
        this.addCornerToPath(snake, index);
      } else {
        this.addStraightToPath( snake, index);
      }

    });

    this.layer.fill();

    this.layer.restore();

  }

  private isCornerAt( snake: ISnake, index: number): boolean {
    const prev = snake.positions[index - 1];
    const next = snake.positions[index + 1];

    // check if corner

    const way = {
      x: prev.x - next.x,
      y: prev.y - next.y,
    };
    
    return (way.x != 0 && way.y != 0);
  }

  private addCornerToPath(snake: ISnake, index: number) {
    
    const pixelSize = SnakeConstants.PIXEL_SIZE;
    const snakeWidth = SnakeConstants.SNAKE_WIDTH;
    const prev = snake.positions[index - 1];
    const pos = snake.positions[index];
    const next = snake.positions[index + 1];
    let possibleCorners = new Set([0,1,2,3]);

    const cellCenter = this.getCellCenterInPx( pos);
    
    if (prev.x  < pos.x || next.x < pos.x) {
      possibleCorners.delete(1);
      possibleCorners.delete(2);
    }
    if (prev.x  > pos.x || next.x > pos.x) {
      possibleCorners.delete(0);
      possibleCorners.delete(3);
    }
    if (prev.y  < pos.y || next.y < pos.y) {
      possibleCorners.delete(2);
      possibleCorners.delete(3);
    }
    if (prev.y  > pos.y || next.y > pos.y) {
      possibleCorners.delete(0);
      possibleCorners.delete(1);
    }
    const cornerIdx  = [... possibleCorners.values()][0];

    this.layer.save();
    this.layer.translate( cellCenter.x, cellCenter.y);

    this.layer.rotate(Math.PI * cornerIdx * 0.5);
  
    this.layer.moveTo( -0.5 * pixelSize, -0.5 * pixelSize);
    this.layer.arc(
      -0.5 * pixelSize,
      -0.5 * pixelSize,
      (1 - (1 - snakeWidth) * 0.5) * pixelSize,
      0,
      Math.PI / 2
    );

    // cut out inner part
    this.layer.moveTo( -0.5 * pixelSize, -0.5 * pixelSize);
    this.layer.arc(
      -0.5 * pixelSize,
      -0.5 * pixelSize,
      0.5 * (1 - snakeWidth) * pixelSize,
      Math.PI / 2,
      0,
      true
    );

    this.layer.restore();
  }

  private addStraightToPath( snake: ISnake, index: number) {
    const pixelSize = SnakeConstants.PIXEL_SIZE;
    const snakeWidth = SnakeConstants.SNAKE_WIDTH;
    const prev = snake.positions[index-1];
    const pos = snake.positions[index];
    const cellCenter = this.getCellCenterInPx( pos);

    this.layer.save();

    this.layer.translate( cellCenter.x, cellCenter.y);

    if (prev.y != pos.y) {
      this.layer.rotate( Math.PI / 2 );
    }

    this.layer.rect(
      -0.5 * pixelSize,
      -0.5 * snakeWidth * pixelSize,
      pixelSize,
      pixelSize * snakeWidth,
    );

    this.layer.restore();
  }
}