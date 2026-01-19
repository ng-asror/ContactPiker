import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class Account {
  private http = inject(HttpClient);

  login(data: { initData: string; invite_token?: string }): Observable<string> {
    return this.http.post<string>(`${environment.apiUrl}/accounts/auth/telegram`, data);
  }
}
