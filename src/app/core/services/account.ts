import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
	providedIn: 'root',
})
export class Account {
	private http = inject(HttpClient);

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
}
