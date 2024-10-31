import { GameLogic, ISnake } from "../game-logic";
import { SnakeConstants } from "../snake-constants";

export class SnakeRenderer {

  constructor(
    private readonly layer: CanvasRenderingContext2D,
    private readonly gameLogic: GameLogic,
  ) {

  }

  public draw(): void {

    // clear canvas for redrawing:
    this.layer.fillStyle = "transparent";
    this.layer.fillRect(
      0, 0, SnakeConstants.SIZE * SnakeConstants.PIXEL_SIZE, SnakeConstants.SIZE * SnakeConstants.PIXEL_SIZE
    );

    const snake = this.gameLogic.getSnake();

    this.drawTorso(snake);
    this.drawHead(snake);
    this.drawTail(snake);
  }

  private drawHead(snake: ISnake) {
    
    const pos = snake.positions[snake.positions.length - 1];
    const throat = snake.positions[snake.positions.length - 2];
    const pixelSize = SnakeConstants.PIXEL_SIZE;
    
    const cellCenter = {
      x: pos.x * pixelSize + pixelSize / 2,
      y: pos.y * pixelSize + pixelSize / 2
    }
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
      -1 * pixelSize / 2,
      pixelSize,
      pixelSize,
      [ 0, pixelSize / 2.25, pixelSize / 2.25, 0]
    );
    this.layer.fill();

    this.layer.beginPath();
    this.layer.fillStyle = SnakeConstants.colors.snake.eye;
    this.layer.strokeStyle = SnakeConstants.colors.snake.body;
    this.layer.lineWidth = pixelSize / 4;

    this.layer.arc(
      -1 * pixelSize / 4,
      -1 * pixelSize / 2,
      pixelSize / 4,
      0,
      Math.PI * 2
    );

    this.layer.arc(
      -1 * pixelSize / 4,
      + pixelSize / 2,
      pixelSize / 4,
      0,
      Math.PI * 2
    );

    this.layer.stroke();
    this.layer.fill();

    // pupille
    this.layer.beginPath();
    this.layer.fillStyle = SnakeConstants.colors.snake.pupilla;

    this.layer.arc(
      -1 * pixelSize / 4 + pixelSize / 12,
      + pixelSize / 2,
      pixelSize / 12,
      0,
      Math.PI * 2
    );

    this.layer.arc(
      -1 * pixelSize / 4 + pixelSize / 12,
      -1 * pixelSize / 2,
      pixelSize / 12,
      0,
      Math.PI * 2
    );
    this.layer.fill();


    this.layer.restore();
  }

  private drawTail(snake: ISnake) {
    this.layer.save();
    this.layer.beginPath();
    this.layer.fillStyle = SnakeConstants.colors.snake.body;

    const tailPos = snake.positions[0];
    const hipPos = snake.positions[1];
    const tailSize = 0.75;
    const pixelSize = SnakeConstants.PIXEL_SIZE;
    // let rotAngle:;
    const drawPos = {
      x: tailPos.x + (hipPos.x - tailPos.x) / 2.25,
      y: tailPos.y + (hipPos.y - tailPos.y) / 2.25,
    }



    this.layer.roundRect(
      drawPos.x * pixelSize,
      drawPos.y * pixelSize,
      pixelSize,
      pixelSize,
      pixelSize / 2.25
    );

    this.layer.fill();

    this.layer.restore();
  }

  private drawTorso(snake: ISnake) {
    const pixelSize = SnakeConstants.PIXEL_SIZE;

    this.layer.save();
    this.layer.beginPath();

    this.layer.fillStyle = SnakeConstants.colors.snake.body;

    snake.positions.forEach((pos, index) => {
      if (index == 0 || index == snake.positions.length - 1) {
        return // do not draw head/tail
      }

      // if pos is at edge round one corner
      const corners = [0, 0, 0, 0];

      const prev = snake.positions[index - 1];
      const next = snake.positions[index + 1];

      // check if corner

      const way = {
        x: prev.x - next.x,
        y: prev.y - next.y,
      };
      
      if (way.x != 0 && way.y != 0) {
        
        let possibleCorners = new Set([0,1,2,3]);
        
        if (prev.x  < pos.x || next.x < pos.x) {
          possibleCorners.delete(0);
          possibleCorners.delete(3);
        }
        if (prev.x  > pos.x || next.x > pos.x) {
          possibleCorners.delete(1);
          possibleCorners.delete(2);
        }
        if (prev.y  < pos.y || next.y < pos.y) {
          possibleCorners.delete(0);
          possibleCorners.delete(1);
        }
        if (prev.y  > pos.y || next.y > pos.y) {
          possibleCorners.delete(2);
          possibleCorners.delete(3);
        }
        const cornerIdx  = [... possibleCorners.values()][0];

        corners[cornerIdx] = pixelSize;
      }

      this.layer.roundRect(
        pos.x * pixelSize,
        pos.y * pixelSize,
        pixelSize,
        pixelSize,
        corners
      );
    });

    this.layer.fill();

    this.layer.restore();

  }
}