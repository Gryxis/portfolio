import { SnakeComponent } from './snake.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

const routes: Routes = [
  {
    path: '',
    component: SnakeComponent
  }
];

@NgModule({
  declarations: [
    SnakeComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgbModalModule,
  ],
  exports: [
    RouterModule,
  ]
})
export class SnakeModule { }
