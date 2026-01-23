import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { IApprovedAndYoursPlan, IPlanReq, IPlanShare, IPlansRes } from '../interfaces';

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

	plansList(
		data: { date?: string; filter_type?: 'new' | 'date' }
	): Observable<IPlansRes> {
		let params = new HttpParams();

		if (data.date) {
			params = params.set('date', data.date);
		}

		if (data.filter_type) {
			params = params.set('filter_type', data.filter_type);
		}

		return this.http.get<IPlansRes>(
			`${environment.apiUrl}/plans/list/`,
			{ params }
		);
	}

	getPlan(id: string): Observable<IApprovedAndYoursPlan> {
		return this.http.get<IApprovedAndYoursPlan>(`${environment.apiUrl}/plans/${id}/`);
	}

	sharePlan(plan_id: string): Observable<IPlanShare> {
		return this.http.post<IPlanShare>(`${environment.apiUrl}/plans/${plan_id}/generate-token/`, {})
	}
}
