import { Component } from '@angular/core';

type Project = {
  title: string;
  description: string;
  link: string;
};

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  projects: Project[] =  [
    {
      title: 'Game of Life',
      link: 'game-of-life',
      description: 'a small implementation of the game of life.',
    },
    {
      title: 'Endless Dungeon Crawler',
      link: 'endless-dungeon-crawler',
      description: 'an example of a procedurally generated dungeon crawler using cellular automata.',
    },
  ];
}
