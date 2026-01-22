import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class Plan {
  private http = inject(HttpClient);

  friends(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/plans/friends`);
  }

  plansList(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/plans/list/`);
  }
}
