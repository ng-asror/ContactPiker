import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { IMessagesRes, IRoomRes, IRoomsRes } from '../interfaces';
import { INotification } from '../../../core';

@Injectable({
  providedIn: 'root',
})
export class Notification {
  private http = inject(HttpClient);

  rooms(): Observable<IRoomsRes> {
    return this.http.get<IRoomsRes>(`${environment.apiUrl}/chat/rooms/`);
  }

  room(room_id: string): Observable<IRoomRes> {
    return this.http.get<IRoomRes>(`${environment.apiUrl}/chat/rooms/${room_id}/`);
  }
  notifs(): Observable<{ notifications: INotification[] }> {
    return this.http.get<{ notifications: INotification[] }>(
      `${environment.apiUrl}/chat/notifications/`,
    );
  }
  read(id: string): Observable<{ notifications: INotification[] }> {
    return this.http.get<{ notifications: INotification[] }>(
      `${environment.apiUrl}/chat/notifications/${id}/`,
    );
  }
  messages(room_id: string): Observable<IMessagesRes> {
    return this.http.get<IMessagesRes>(`${environment.apiUrl}/chat/rooms/${room_id}/messages/`);
  }
}
