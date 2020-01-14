import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Hero } from './hero';
import { HEROES } from './mock-heroes';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})
export class HeroService {

  // url to web api
  private heroesUrl = 'api/heroes';

  constructor(
    private messageService: MessageService,
    private http: HttpClient
  ) { }

  private log(message: string) {
    this.messageService.addMessage(`HeroService: ${message}`);
  }

  getHero(id: number): Observable<Hero> {
    // TODO: send the message _after_ fetching the hero
    this.log(`HeroService: fetched hero id=${id}`);
    return of(HEROES.find(hero => hero.id === id));
  }

  // getHeroes(): Observable<Hero[]> {
  //   // TODO: send the message _after_ fetching the heroes
  //   this.log('HeroService: fetched heroes');
  //   return of(HEROES);
  // }

  // get heroes from the server
  getHeroes(): Observable<Hero[]> {
    this.log('HeroService: fetching heroes');

    let observable = this.http.get<Hero[]>(this.heroesUrl);

    // function takes the name of the operation that failed and a safe return value
    observable.pipe(
      catchError(this.handleFailedHttpOperation<Hero[]>('getHeroes', []))
    );
    return observable;
  }

  private handleFailedHttpOperation<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error);

      // TODO: better job of transofming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning empty result
      return of(result as T);
    }
  }

}
