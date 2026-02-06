import { ChangeDetectionStrategy, Component, inject, resource } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Notification } from '../../services';
import { firstValueFrom } from 'rxjs';
import { DaysPipe } from '../../../plan';

@Component({
  selector: 'app-chats-list',
  imports: [RouterLink, DaysPipe],
  templateUrl: './chats-list.html',
  styleUrl: './chats-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatsList {
  private notifService = inject(Notification);

  rooms = resource({
    loader: () => firstValueFrom(this.notifService.rooms()).then(res => res.rooms)
  })
}
