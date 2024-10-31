import { SnakeConstants } from "./snake-constants";

export class GameLogic {

    private snake: ISnake;

    private apple: IPosition;


    constructor() {
        const middle = Math.floor( SnakeConstants.SIZE / 2);
        this.snake = {
            positions: [
                {x : 1, y: middle},
                {x : 2, y: middle},
                {x : 3, y: middle},
                {x : 3, y: middle - 1},
                {x : 2, y: middle - 1},
            ],
            direction : 'right'
        };

        this.apple = { x: middle, y: middle};
    }

    public getSnake(): ISnake {
        return {
            positions: [... this.snake.positions],
            direction: this.snake.direction
        };
    }

    public getApple(): IPosition {
        return {
            x: this.apple.x,
            y: this.apple.y,
        };
    }

}

export interface ISnake {
    positions: IPosition[],
    direction: 'right' | 'left' | 'up' | 'down', 
}

interface IPosition {
    x: number;
    y: number;
}