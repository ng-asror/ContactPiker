import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { IFriendsRes, IRemoveUserRes } from '../interface';

@Injectable({
  providedIn: 'root',
})
export class Friends {
  private http = inject(HttpClient);

  getFriends(): Observable<IFriendsRes> {
    return this.http.get<IFriendsRes>(`${environment.apiUrl}/plans/friends/`);
  }

  removeFriend(room_id: string, user_id: string): Observable<IRemoveUserRes> {
    return this.http.delete<IRemoveUserRes>(
      `${environment.apiUrl}/chat/rooms/${room_id}/remove-user/${user_id}/`,
    );
  }
}
