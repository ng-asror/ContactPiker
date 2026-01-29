import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import {
  IApprovedAndYoursPlan,
  IPlanReq,
  IPlanShare,
  IPlansRes,
  IPlanUser,
  IRootPlanRes,
} from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class Plan {
  private http = inject(HttpClient);

  friends(): Observable<void> {
    return this.http.get<void>(`${environment.apiUrl}/plans/friends`);
  }

  sendFriends(plan_id: string, user_ids: number[]): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/plans/${plan_id}/generate-token/friends/`, {
      user_ids,
    });
  }

  createPlan(data: IPlanReq): Observable<IApprovedAndYoursPlan> {
    return this.http.post<IApprovedAndYoursPlan>(`${environment.apiUrl}/plans/create/`, data);
  }

  updatePlan(plan_id: string, data: IPlanReq): Observable<void> {
    return this.http.put<void>(`${environment.apiUrl}/plans/${plan_id}/update/`, data);
  }

  plansList(data: { date?: string; filter_type?: 'new' | 'date' }): Observable<IPlansRes> {
    let params = new HttpParams();

    if (data.date) {
      params = params.set('date', data.date);
    }

    if (data.filter_type) {
      params = params.set('filter_type', data.filter_type);
    }

    return this.http.get<IPlansRes>(`${environment.apiUrl}/plans/list/`, { params });
  }

  getPlan(id: string): Observable<IApprovedAndYoursPlan> {
    return this.http.get<IApprovedAndYoursPlan>(`${environment.apiUrl}/plans/${id}/`);
  }

  getPlanForToken(invite_token: string): Observable<IRootPlanRes> {
    return this.http.get<IRootPlanRes>(`${environment.apiUrl}/plans/token/${invite_token}/`);
  }

  sharePlan(plan_id: string): Observable<IPlanShare> {
    return this.http.post<IPlanShare>(`${environment.apiUrl}/plans/${plan_id}/generate-token/`, {});
  }
  deletePlan(plan_id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/plans/${plan_id}/delete/`);
  }

  approvePlan(plan_id: string): Observable<IPlanUser> {
    return this.http.put<IPlanUser>(`${environment.apiUrl}/plans/approve/`, { plan_id });
  }
  rejectPlan(plan_id: string): Observable<IPlanUser> {
    return this.http.put<IPlanUser>(`${environment.apiUrl}/plans/reject/`, { plan_id });
  }
}
