import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, switchMap, tap } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { Telegram } from './telegram';

export interface IProfile {
  id: number;
  first_name: string;
  last_name: string;
  avatar: string;
}

@Injectable({
  providedIn: 'root',
})
export class Account {
  private http = inject(HttpClient);
  private telegram = inject(Telegram);

  // Subject & BehoviorSubject
  profileSubject = new BehaviorSubject<IProfile | null>(null);
  profile$ = this.profileSubject.asObservable();

  login(data: {
    initData: string;
    invite_token?: string;
  }): Observable<{ access_token: string; refresh_token: string }> {
    const body: { initData: string; invite_token?: string } = { initData: data.initData };
    if (data.invite_token) {
      body.invite_token = data.invite_token;
    }

    return this.http
      .post<{
        access_token: string;
        refresh_token: string;
      }>(`${environment.apiUrl}/accounts/auth/telegram/`, JSON.stringify(body))
      .pipe(
        tap((res) => {
          this.telegram.setCloudItem('access_token', res.access_token);
          this.telegram.setCloudItem('refresh_token', res.refresh_token);
        }),
      );
  }

  profile(): Observable<IProfile> {
    return this.http.get<IProfile>(`${environment.apiUrl}/accounts/profile/`).pipe(
      tap((res: IProfile) => {
        this.profileSubject.next(res);
      }),
    );
  }
}
