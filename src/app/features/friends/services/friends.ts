import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

@Injectable({
	providedIn: 'root',
})
export class Friends {
	private http = inject(HttpClient)


	getFriends(): Observable<any> {
		return this.http.get<any>(`${environment.apiUrl}/plans/friends/`)
	}
}
