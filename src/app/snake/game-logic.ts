import { BehaviorSubject, filter, interval, Subscription } from "rxjs";
import { SnakeConstants } from "./snake-constants";
import { isEqual } from 'lodash-es';

export class GameLogic {

  private snake!: ISnake;

  private apple!: IPosition;

  public score = 0;
  public highScore = 0;

  public loop: Subscription | undefined;

  public state: BehaviorSubject<GameState> = new BehaviorSubject<any>('paused'); 

  constructor() {
    this.init();
  }

  private init(): void {

    const middle = Math.floor( SnakeConstants.SIZE / 2);
    this.score = 0;
    this.snake = {
      positions: [
        { x: 1, y: middle },
        { x: 2, y: middle },
        { x: 3, y: middle },
        { x: 4, y: middle },
        { x: 5, y: middle },
      ],
      directions: [],
    };

    this.apple = { x: middle, y: middle };

    if (!this.loop) {
      this.loop = interval(SnakeConstants.PERIOD).pipe(
        filter( x => this.state.getValue() == 'playing')
      ).subscribe( () => {
        this.update();
      });
    }
    
  }

  public getSnake(): ISnake {
    return this.snake;
  }

  public getApple(): IPosition {
    return {
      x: this.apple.x,
      y: this.apple.y,
    };
  }

  public destroy() {
    this.loop?.unsubscribe();
    this.state.complete();
  }

  public resume() {
    if (this.state.getValue() == 'playing') {
      return;
    }

    if (this.state.getValue() == 'gameOver') {
      this.init();
    }
    this.state.next( 'playing');
  }

  public pause() {
    if (this.state.getValue() === 'paused') {
      return;
    }
    this.state.next( 'paused');
  }

  public turn( direction: Direction): void {

    if (this.state.getValue() == 'paused') {
      return; // ignore input when paused
    }

    let dirBeforeTurn: Direction;
    if (this.snake.directions.length > 0) {
      dirBeforeTurn = this.snake.directions[this.snake.directions.length - 1];
    } else {
      dirBeforeTurn = this.getDirectionOfLastStep();
    }

    if (
      dirBeforeTurn == 'right' && direction == 'left'
      || dirBeforeTurn == 'left' && direction == 'right'
      || dirBeforeTurn == 'down' && direction == 'up'
      || dirBeforeTurn == 'up' && direction == 'down'
    ) {
      return; // can not move into itself
    }
    if (this.snake.directions[this.snake.positions.length - 1] == direction
      || this.snake.directions.length > 2
    ) {
      return
    }

    this.snake.directions.push( direction);
  }

  private update(): void {
    const head = this.snake.positions[ this.snake.positions.length - 1];

    const nextPos: IPosition = {
      x: head.x, y: head.y
    };

    let nextDirection: Direction = this.getNextDirection();
    this.snake.directions.shift();

    switch (nextDirection) {
      case 'right':
        nextPos.x++;
        break;
      case 'left':
        nextPos.x--;
        break;
      case 'up':
        nextPos.y--;
        break;
      case 'down':
        nextPos.y++;
        break;

      default:
        break;
    }

    if (
      nextPos.x < 0 || nextPos.y < 0
      || nextPos.x >= SnakeConstants.SIZE || nextPos.y >= SnakeConstants.SIZE
      || this.snake.positions.some( pos => isEqual( pos, nextPos))
    ) {
      this.lose();
      return
    }

    this.snake.positions.push( nextPos);

    if (isEqual( this.apple, nextPos)) {
      this.eatApple();
    } else {
      this.snake.positions.shift();
    }
  }

  private getNextDirection(): Direction {
    if (this.snake.directions.length > 0) {
      return this.snake.directions[0];
    }
    return this.getDirectionOfLastStep();
  }

  private getDirectionOfLastStep(): Direction {
    const head = this.snake.positions[this.snake.positions.length - 1];
    const prev = this.snake.positions[this.snake.positions.length - 2];

    if (head.x > prev.x) {
      return 'right'
    } else if (head.x < prev.x) {
      return 'left';
    } else if (head.y > prev.y) {
      return 'down'; // y is pointing downwards
    } else {
      return 'up';
    }
  }

  private lose(): void {
    this.highScore = Math.max(this.score, this.highScore);
    this.state.next('gameOver');
  }

  private eatApple(): void {
    this.score++;
    const possiblePositions = new Set<number>();

    for (let i = 0; i < SnakeConstants.SIZE * SnakeConstants.SIZE; i++) {
        possiblePositions.add( i);
    }
    this.snake.positions.forEach( pos => {
      possiblePositions.delete( pos.y * SnakeConstants.SIZE + pos.x);
    });

    const nextIdx = Math.round(
      Math.random() * possiblePositions.size - 1
    );
    const NextAgg = [... possiblePositions.values()][nextIdx]; 

    this.apple.x = NextAgg % SnakeConstants.SIZE;
    this.apple.y = Math.floor( NextAgg / SnakeConstants.SIZE);
  }
}

export type Direction = 'right' | 'left' | 'up' | 'down';

export interface ISnake {
  positions: IPosition[],
  directions: Direction[],
}

export interface IPosition {
  x: number;
  y: number;
}

export type GameState = 'paused' | 'playing' | 'gameOver';
