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

  // Variables
  protected message: string = '';

  // Inputs
  room_id = input.required<string>({ alias: 'id' });

  // Resources
  roomResource = resource({
    loader: () => firstValueFrom(this.notificationService.room(this.room_id())),
  });

  messagesResource = resource({
    loader: () =>
      firstValueFrom(this.notificationService.messages(this.room_id())).then((res) =>
        res.messages.reverse(),
      ),
  });

  // ViewChilds
  @ViewChild('messagesContent') messagesContent!: ElementRef<HTMLElement>;

  async ngOnInit(): Promise<void> {
    this.telegramService.showBackButton('/chats');

    // Socket
    const token: string | null = await this.telegramService.getCloudStorage('access_token');
    this.socketService.initSocket(token, `chat/${this.room_id()}`);

    // listenMessages
    this.listenMessages();
  }

  // Send message
  sendMessage(): void {
    if (this.message.trim().length) {
      this.socketService.emit('message', this.message.trim());
      this.message = '';
    }
  }

  listenMessages(): void {
    this.socketService.listen<IMessage>('chat_message').subscribe({
      next: (res: IMessage) => {
        this.messagesResource.update((messages) =>
          messages ? [{ ...res }, ...messages] : undefined,
        );

        // scrollTo
        const el = this.messagesContent.nativeElement;
        setTimeout(() => {
          el.scrollTo({
            top: el.scrollHeight + 100,
            behavior: 'smooth',
          });
        }, 500);
      },
    });
  }

  ngOnDestroy(): void {
    this.telegramService.hiddeBackButton('/chats');
  }
}
