import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  input,
  OnDestroy,
  OnInit,
  resource,
  ViewChild,
  effect,
} from '@angular/core';
import { TextFieldModule } from '@angular/cdk/text-field';
import { RouterLink } from '@angular/router';
import { Notification } from '../../services';
import { firstValueFrom } from 'rxjs';
import { Socket, Telegram } from '../../../../core';
import { DaysPipe } from '../../../plan';
import { FormsModule } from '@angular/forms';
import { IMessage } from '../../interfaces';
import { Message } from '../../components';

@Component({
  selector: 'app-chat',
  imports: [Message, RouterLink, DaysPipe, TextFieldModule, FormsModule],
  templateUrl: './chat.html',
  styleUrl: './chat.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Chat implements OnInit, OnDestroy {
  private notificationService = inject(Notification);
  private telegramService = inject(Telegram);
  private socketService = inject(Socket);

  // ===== STATE =====
  protected message: string = '';

  // ===== INPUT =====
  room_id = input.required<string>({ alias: 'id' });

  // ===== RESOURCES =====
  roomResource = resource({
    loader: () => firstValueFrom(this.notificationService.room(this.room_id())),
  });

  messagesResource = resource({
    loader: () =>
      firstValueFrom(this.notificationService.messages(this.room_id())).then((res) =>
        res.messages.reverse(),
      ),
  });

  // ===== VIEW CHILD =====
  private _messagesContent?: ElementRef<HTMLElement>;

  @ViewChild('messagesContent')
  set messagesContent(el: ElementRef<HTMLElement>) {
    if (!el) return;
    this._messagesContent = el;
  }

  // ===== AUTO SCROLL =====
  private messagesScrollEffect = effect(() => {
    this.messagesResource.value();

    setTimeout(() => {
      const el = this._messagesContent?.nativeElement;
      if (!el) return;

      el.scrollTop = 0;
    });
  });

  // ===== LIFECYCLE =====
  async ngOnInit(): Promise<void> {
    this.telegramService.showBackButton('/chats');

    const token = await this.telegramService.getCloudStorage('access_token');
    this.socketService.initSocket(token, `chat/${this.room_id()}`);

    this.listenMessages();
  }

  ngOnDestroy(): void {
    this.telegramService.hiddeBackButton('/chats');
  }

  // ===== SEND =====
  sendMessage(): void {
    if (!this.message.trim()) return;

    this.socketService.emit('message', this.message.trim());
    this.message = '';
  }

  // ===== SOCKET =====
  private listenMessages(): void {
    this.socketService.listen<IMessage>('chat_message').subscribe({
      next: (res: IMessage) => {
        this.messagesResource.update((messages) => (messages ? [{ ...res }, ...messages] : [res]));
      },
    });
  }
}
