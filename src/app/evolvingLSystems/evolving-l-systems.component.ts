import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Turtle, IPosition } from './turtle';

@Component({
  selector: 'app-evolving-l-systems',
  templateUrl: './evolving-l-systems.component.html',
  styleUrls: ['./evolving-l-systems.component.scss']
})
export class EvolvingLSystemsComponent implements AfterViewInit {

  // e.g. F + F - F -F + F
  // teleport: F [-F] F [+F] [F]
  public LGrammar: string = ' F + F - F -F + F';

  public stepSize: number = 8;

  public expansions: number = 1;
  public startDirection = 0;
  public angle: number = 90;

  @ViewChild('turtleCanvas')
  private turtleCanvas!: ElementRef<HTMLCanvasElement>;
  private canvasContext!: CanvasRenderingContext2D;

  public canvasWidth : number = 64;
  public canvasHeight : number = 64;


  ngAfterViewInit(): void {
    this.canvasContext = this.turtleCanvas?.nativeElement.getContext('2d') as CanvasRenderingContext2D;
  }

  
  public onStart(): void {

    if (this.expansions < 0) {
      return;
    }

    if (this.LGrammar.length == 0) {
      return;
    }

    const commands = this.expand();

    const turtle = new Turtle( { dir: this.startDirection, x: 0, y:0});
    const teleportStack: Array<IPosition> = [];

    for (let i = 0; i <  commands.length; i++) {
      const current = commands.charAt(i);

      switch (current) {
        case 'F':
        case 'f':
          turtle.step();
          break;
        case '-':
          turtle.rotate( -1 * this.angle);
          break;
        case '+':
          turtle.rotate( this.angle);
          break;
        case '[':
          teleportStack.push( turtle.getPosition());
          break;
        case ']':
          turtle.teleport(teleportStack.pop() as IPosition);
          break;
        default:
          break;
      }
    }

    this.drawPath( turtle);

  }

  private expand(): string {
    let result = this.LGrammar;

    for (let i = 0; i < this.expansions; i++) {
      result = result.replaceAll( 'F', this.LGrammar);
    }

    return result.replaceAll(' ', '');
  }

  private drawPath( turtle: Turtle) {
    const span = turtle.getDimension();
    const padding = 1;
    this.canvasWidth = span.bottomRight.x - span.topLeft.x + 2 * padding; // add padding
    this.canvasWidth = Math.max( this.canvasWidth, 1 + 2 * padding);

    this.canvasHeight = span.topLeft.y - span.bottomRight.y + 2 * padding ;
    this.canvasHeight = Math.max( this.canvasHeight, 1 + 2 * padding );
    
    
    this.canvasWidth *= this.stepSize;
    this.canvasHeight *= this.stepSize;



    setTimeout( () => {

      this.canvasContext.clearRect( 0, 0, this.canvasWidth, this.canvasHeight);
  
      this.canvasContext.beginPath();
      
      // shift turtle away from dimension minimum
      const origin = { x : Math.abs( span.topLeft.x) + padding, y: Math.abs( span.bottomRight.y) + padding};

      this.canvasContext.moveTo( origin.x * this.stepSize , this.canvasHeight - origin.y * this.stepSize);

      turtle.getPath().reduce( (prev, cur, idx, arr) => {
        
        if ( !!prev && prev.x == cur.x && prev.y == cur.y) {
          return cur;
        }
        const posX = (cur.x + origin.x) * this.stepSize;
        const posY = this.canvasHeight - (cur.y + origin.y) * this.stepSize; // flip y since canvas y direction is from top to bottom
        
        if (cur.teleported) {
          this.canvasContext.stroke();
          this.canvasContext.beginPath();
          this.canvasContext.moveTo( posX, posY);
        } else {
          this.canvasContext.lineTo( posX, posY);
        }

        return cur;
      });

      this.canvasContext.stroke();

    }, 0);
  }

}

