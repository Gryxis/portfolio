import { GameOfLifeComponent } from './game-of-life.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

const routes: Routes = [
  {
    path: '',
    component: GameOfLifeComponent
  }
];

@NgModule({
  declarations: [
    GameOfLifeComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbTooltipModule,
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule,
  ]
})
export class GameOfLifeModule { }
