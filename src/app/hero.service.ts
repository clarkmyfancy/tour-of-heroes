import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Hero } from './hero';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})
export class HeroService {

  // url to web api
  private heroesUrl = 'api/heroes';

  httpOptions = {
    headers: new HttpHeaders(
      { 'Content-Type': 'application/json' }
    )
  };

  constructor(
    private messageService: MessageService,
    private http: HttpClient
  ) { }

  getHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url).pipe(
      tap(_ => this.log(`fetched hero with id: ${id}`)),
      catchError(this.handleFailedHttpOperation<Hero>(`getHero id=${id}`))
    );
  }

  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.heroesUrl).pipe(
      tap(_ => this.log('Fetched heroes')),
      catchError(this.handleFailedHttpOperation<Hero[]>('getHeroes', []))
    );
  }

  updateHero(hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, this.httpOptions).pipe(
      tap(_ => this.log(`Updated hero with id: ${hero.id}`)),
      catchError(this.handleFailedHttpOperation<any>('updateHero'))
    );
  }

  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions).pipe(
      tap((newHero: Hero) => this.log(`Adding new hero with name: ${newHero.name} and id: ${newHero.id}`)),
      catchError(this.handleFailedHttpOperation<Hero>('addHero'))
    );
  }

  removeHero(hero: Hero | number): Observable<Hero> {
    const id = typeof hero === 'number' ? hero : hero.id;
    const url = `${this.heroesUrl}/${id}`;
    return this.http.delete<Hero>(url, this.httpOptions).pipe(
      tap(_ => this.log(`Deleted hero with id: ${id}`)),
      catchError(this.handleFailedHttpOperation<Hero>('removeHero'))
    );
  }

  searchForHeroesWithTerm(term: string): Observable<Hero[]> {
    if (!term.trim()) {
      // if not search term, return empty hero array
      return of([]);
    }

    const url = `${this.heroesUrl}/?name=${term}`;
    return this.http.get<Hero[]>(url).pipe(
      tap(_ => this.log(`Found heroes matching ${term}`)),
      catchError(this.handleFailedHttpOperation<Hero[]>('searchForHeroesWithTerm', []))
    );
  }

  private log(message: string) {
    this.messageService.addMessage(`HeroService: ${message}`);
  }

  private handleFailedHttpOperation<T>(operationThatFailed = 'operation', safeReturnValue?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error);

      // TODO: better job of transofming error for user consumption
      this.log(`${operationThatFailed} failed: ${error.message}`);

      // Let the app keep running by returning empty result
      return of(safeReturnValue as T);
    }
  }
}
