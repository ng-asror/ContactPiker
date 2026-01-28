import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { IRoomsRes } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class Notification {
    private http = inject(HttpClient);


  rooms():Observable<IRoomsRes> {
    return this.http.get<IRoomsRes>(`${environment.apiUrl}/chat/rooms/`)
  }
}
