import { ChangeDetectionStrategy, Component, inject, input, OnDestroy, OnInit, resource } from '@angular/core';
import {TextFieldModule} from '@angular/cdk/text-field';
import { RouterLink } from '@angular/router';
import { Notification } from '../../services';
import { firstValueFrom } from 'rxjs';
import { Telegram } from '../../../../core';
import { DaysPipe } from '../../../plan';
@Component({
  selector: 'app-chat',
  imports: [RouterLink, DaysPipe, TextFieldModule],
  templateUrl: './chat.html',
  styleUrl: './chat.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Chat implements OnInit, OnDestroy{
  private notificationService = inject(Notification);
  private telegramService = inject(Telegram);

  // Inputs
  room_id = input.required<string>({ alias: 'id' });

  // Resources
  roomResource = resource({
    loader: () => firstValueFrom(this.notificationService.room(this.room_id())),
  });

  messagesResource = resource({
    loader: () => firstValueFrom(this.notificationService.messages(this.room_id())).then(res => res.messages)
  })

  ngOnInit(): void {
    this.telegramService.showBackButton('/chats')
  }
  
  ngOnDestroy(): void {
    this.telegramService.hiddeBackButton('/chats')
  }
}
