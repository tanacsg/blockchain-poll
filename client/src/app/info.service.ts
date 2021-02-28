import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';

import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InfoService {

  private pollUrl = environment.apiUrl + '/api';

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };


  constructor(private http: HttpClient) { }

    /** GET info object from the server */
  getInfo(): Observable<any> {
    return this.http.get<any>(this.pollUrl + '/info', this.httpOptions);
  }
}
