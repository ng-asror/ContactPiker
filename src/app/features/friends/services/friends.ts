import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { IFriendsRes } from '../interface';

@Injectable({
	providedIn: 'root',
})
export class Friends {
	private http = inject(HttpClient)


	getFriends(): Observable<IFriendsRes> {
		return this.http.get<IFriendsRes>(`${environment.apiUrl}/plans/friends/`)
	}
}
