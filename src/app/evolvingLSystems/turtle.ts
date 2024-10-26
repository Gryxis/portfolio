import * as _ from 'lodash';

export class Turtle {

    private pos: IPosition;

    public getPosition(): IPosition {
        return _.cloneDeep( this.pos);
    }

    private dimension: Rectangle = {
        topLeft: { x: 0, y:0},
        bottomRight: { x: 0, y:0},
    }

    public getDimension(): Rectangle {
        return _.cloneDeep( this.dimension);
    }
    
    private path: Array<IPosition>;

    public getPath() {
        return _.cloneDeep( this.path);
    }

    constructor(startPos = {dir : 0, x : 0, y : 0}) {
        this.pos = { x: startPos.x, y: startPos.y, dir: startPos.dir};
        this.path = [ _.cloneDeep( this.pos)];
    }
    
    public rotate( degree: number) {
        this.pos.dir += degree;
        this.pos.teleported = false;
        this.path.push ( _.cloneDeep( this.pos));
    }

    public step() {
        const radians = this.pos.dir / 360 * Math.PI * 2;

        const stepSizeX = Math.cos( radians);
        const stepSizeY = Math.sin( radians);

        this.pos.x += stepSizeX,
        this.pos.y += stepSizeY,

        this.pos.teleported = false;

        this.path.push ( _.cloneDeep( this.pos));
        this.updateDimension();
    }


    public teleport( newPosition : IPosition) {
        this.pos = _.cloneDeep( newPosition);
        this.pos.teleported = true;
        this.updateDimension();
        this.path.push ( _.cloneDeep( this.pos));
    }

    private updateDimension() {
        this.dimension.topLeft.x = Math.min( this.pos.x, this.dimension.topLeft.x);
        this.dimension.topLeft.y = Math.max( this.pos.y, this.dimension.topLeft.y);
        this.dimension.bottomRight.x = Math.max( this.pos.x, this.dimension.bottomRight.x);
        this.dimension.bottomRight.y = Math.min( this.pos.y, this.dimension.bottomRight.y);
    }

}

export interface IPosition {
    /**
     * x-Position
     */
    x: number,

    /**
     * y-Position
     */
    y: number,

    /** direction in degrees */
    dir: number,

    teleported?: boolean
}

export interface Rectangle {
    topLeft: { x: number, y: number},
    bottomRight: { x: number, y: number},
}