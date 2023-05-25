import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'game-of-life',
    loadChildren: () => import('./gameOfLife/game-of-life.module').then( module => module.GameOfLifeModule), 
  },
  {
    path: '',
    pathMatch: 'full',
    loadChildren: () => import('./home/home.module').then( module => module.HomeModule), 
  },
  {
    path: '**',
    redirectTo: ''
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
