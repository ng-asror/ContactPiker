import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, switchMap, tap } from 'rxjs';
import { environment } from '../../../environments/environment.development';

export interface IProfile {
	id: number,
	first_name: string,
	last_name: string,
	avatar: string,
}

@Injectable({
	providedIn: 'root',
})
export class Account {
	private http = inject(HttpClient);

	// Subject & BehoviorSubject
	profileSubject = new BehaviorSubject<IProfile | null>(null);
	profile$ = this.profileSubject.asObservable();

	login(data: {
		initData: string;
		invite_token?: string | null;
	}): Observable<{ access_token: string; refresh_token: string }> {
		return this.http.post<{ access_token: string; refresh_token: string }>(
			`${environment.apiUrl}/accounts/auth/telegram/`,
			{
				initData: data.initData,
				invite_token: data.invite_token
			},
		);
	}
	profile(): Observable<IProfile> {
		return this.http.get<IProfile>(`${environment.apiUrl}/accounts/profile/`).pipe(
			tap((res: IProfile) => {
				this.profileSubject.next(res)
			})
		)
	}
}
