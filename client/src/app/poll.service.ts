import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class PollService {

  private pollUrl = 'http://localhost:3000';  
  
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient) { }

  /** GET polls from the server */
  getPolls(): Observable<any[]> {
    return this.http.get<any[]>(this.pollUrl + '/query')
      .pipe(
        tap(_ => this.log('fetched polls')),
        catchError(this.handleError<any[]>('getPolls', []))
      );
  }

    /** POST: add a new hero to the server */
  vote(vote: any): Observable<any> {
      console.log('Vote in Angular Service');
      return this.http.post<any>(this.pollUrl + '/vote', vote, this.httpOptions);      
  }

    /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a PollService message with the MessageService */
  private log(message: string) {
    console.log(`PollService: ${message}`);
  }

}
