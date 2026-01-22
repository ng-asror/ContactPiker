import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { IPlanReq, IPlansRes } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class Plan {
  private http = inject(HttpClient);

  friends(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/plans/friends`);
  }

  createPlan(data: IPlanReq): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/plans/create/`, data);
  }

  plansList(): Observable<IPlansRes> {
    return this.http.get<IPlansRes>(`${environment.apiUrl}/plans/list/`);
  }
}
