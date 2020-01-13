import { Component, OnInit } from '@angular/core';

import { Hero } from '../hero';
import { HEROES } from '../mock-heroes';
import { HeroService } from '../hero.service';
import { observable } from 'rxjs';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent implements OnInit {

  heroes: Hero[];
  selectedHero: Hero;

  constructor(
    private heroService: HeroService
  ) { }

  ngOnInit() {
    this.getHeroes();
  }

  onSelect(hero: Hero): void {
    this.selectedHero = hero;
  }

  getHeroes(): void {
    let observableHeroes = this.heroService.getHeroes();
    observableHeroes.subscribe(recievedHeroes => this.heroes = recievedHeroes);
    // this.heroes = this.heroService.getHeroes();
  }

}
