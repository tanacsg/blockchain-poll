import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../environments/environment';

import { PollBlockchain } from '../../../core/PollBlockchain';


@Injectable({
  providedIn: 'root'
})
export class PollService {

  private pollUrl = environment.apiUrl + '/api';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient) { }


   getHttpOptionsAuth(username:string, password:string) {
    return {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Basic ' + btoa(username +':' + password)
      })
    }
  };


  /** GET polls from the server */
  getPolls(username:string,password?:string): Observable<any[]> {
    return this.http.get<any[]>(this.pollUrl + '/query', this.getHttpOptionsAuth(username,password));
  }

    /** GET polls from the server */
  getPoll(id: string): Observable<PollBlockchain> {
      return this.http.get<PollBlockchain>(this.pollUrl + '/poll/' + id)
        .pipe(
          tap(_ => this.log('fetched poll')),
          catchError(this.handleError<PollBlockchain>('getPoll', null))
        );
  }


  /** POST: vote */
  register(id: string, username: string): Observable<any> {
    return this.http.post<any>(this.pollUrl + '/register' , {"pollId": id, "username": username}, this.httpOptions);
  }

    /** POST: vote */
  vote(vote: any): Observable<any> {
      return this.http.post<any>(this.pollUrl + '/vote', vote, this.httpOptions);
  }

  mine(id: string): Observable<any> {
    return this.http.post<any>(this.pollUrl + '/createblock?id=' + id, this.httpOptions);
  }

  create(pollBlockchain: PollBlockchain): Observable<any> {
    return this.http.post<string>(this.pollUrl + '/poll/', pollBlockchain , this.httpOptions);
  }

  delete(id: string, username: string, password: string): Observable<any> {
    return this.http.delete<string>(this.pollUrl + '/admin/poll/' + id, this.getHttpOptionsAuth(username,password));
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
