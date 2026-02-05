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
  QueryList,
  ViewChildren,
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
import { ChatDatePipe } from '../../pipes';
@Component({
  selector: 'app-chat',
  imports: [Message, RouterLink, DaysPipe, TextFieldModule, FormsModule, ChatDatePipe],
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
      firstValueFrom(this.notificationService.messages(this.room_id())).then((res) => {
        const messages = res.messages;

        const map = new Map<string, IMessage[]>();

        messages.forEach((msg) => {
          const date = new Date(msg.created_at).toLocaleDateString('ru-RU');

          if (!map.has(date)) {
            map.set(date, []);
          }

          map.get(date)!.unshift(msg);
        });
        return (
          Array.from(map.entries())
            .map(([date, messages]) => ({
              date,
              messages,
            }))
            .reverse() ?? null
        );
      }),
  });

  // ===== VIEW CHILD =====
  private _messagesContent?: ElementRef<HTMLElement>;
  @ViewChild('chatCanvas') chatContent!: ElementRef<HTMLDivElement>;
  @ViewChildren('lastMsg') lastMsg!: QueryList<ElementRef>;

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

    // socket
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
    this.socketService.listenMessage().subscribe({
      next: (res: IMessage) => {
        this.messagesResource.update((groups) => {
          const msgDate = new Date(res.created_at).toLocaleDateString('ru-RU');

          if (!groups || groups.length === 0) {
            return [
              {
                date: msgDate,
                messages: [res],
              },
            ];
          }

          const todayGroup = groups.find((g) => g.date === msgDate);

          if (todayGroup) {
            return groups.map((g) =>
              g.date === msgDate ? { ...g, messages: [res, ...g.messages] } : g,
            );
          }

          return [
            {
              messages: [res],
              date: msgDate,
            },
            ...groups,
          ];
        });
      },
    });
  }

  ngAfterViewInit(): void {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // if (entry.isIntersecting && this.chat_page < this.last_page()) {
          //   this.chat_loading.set(true);
          //   this.chat_page++;
          //   this.getChats(this.chat_page);
          // }
        });
      },
      { threshold: 0.1 },
    );

    // this.lastMsg.changes.subscribe((list) => {
    //   const last = list.last?.nativeElement;
    //   if (last) observer.observe(last);
    // });
  }
}
