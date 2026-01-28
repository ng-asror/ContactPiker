import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { IMessagesRes, IRoom, IRoomRes, IRoomsRes } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class Notification {
    private http = inject(HttpClient);


  rooms():Observable<IRoomsRes> {
    return this.http.get<IRoomsRes>(`${environment.apiUrl}/chat/rooms/`)
  }
  
  room(room_id: string):Observable<IRoomRes> {
    return this.http.get<IRoomRes>(`${environment.apiUrl}/chat/rooms/${room_id}/`)
  }
  messages(room_id: string):Observable<IMessagesRes> {
    return this.http.get<IMessagesRes>(`${environment.apiUrl}/chat/rooms/${room_id}/messages/`)
  }
}
