import { ChangeDetectionStrategy, Component, inject, resource } from '@angular/core';
import { Notification } from '../../services';
import { firstValueFrom } from 'rxjs';
import { DaysPipe } from '../../../plan';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chats-list',
  imports: [DaysPipe],
  templateUrl: './chats-list.html',
  styleUrl: './chats-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatsList {
  private notifService = inject(Notification);
  private router = inject(Router);

  getNotifs = resource({
    loader: () => firstValueFrom(this.notifService.notifs()).then((res) => res.notifications),
  });

  protected async readNotif(notif_id: string, room_id: string): Promise<void> {
    await firstValueFrom(this.notifService.read(notif_id)).then(() => {
      this.router.navigate(['chats', room_id]);
    });
  }
}
